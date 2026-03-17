package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

// ==========================================
// 1. Database Models (GORM)
// ==========================================

type Patient struct {
	ID   uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name string    `gorm:"not null" json:"name"`
	Age  int       `json:"age"`
}

type Consultation struct {
	ID                  uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PatientID           uuid.UUID `gorm:"type:uuid;not null" json:"patient_id"`
	RawVoiceOrTextInput string    `json:"raw_voice_or_text_input"`
	ParsedObservations  string    `json:"parsed_observations"`
	CreatedAt           time.Time `json:"created_at"`

	Patient       Patient        `gorm:"foreignKey:PatientID" json:"patient"`
	Prescriptions []Prescription `gorm:"foreignKey:ConsultationID" json:"prescriptions"`
	LabTests      []LabTest      `gorm:"foreignKey:ConsultationID" json:"lab_tests"`
	Bill          Bill           `gorm:"foreignKey:ConsultationID" json:"bill"`
}

type Prescription struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ConsultationID uuid.UUID `gorm:"type:uuid;not null" json:"consultation_id"`
	DrugName       string    `gorm:"not null" json:"drug_name"`
	Dosage         string    `json:"dosage"`
	Cost           float64   `gorm:"type:decimal(10,2);default:0.00" json:"cost"`
}

type LabTest struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ConsultationID uuid.UUID `gorm:"type:uuid;not null" json:"consultation_id"`
	TestName       string    `gorm:"not null" json:"test_name"`
	Cost           float64   `gorm:"type:decimal(10,2);default:0.00" json:"cost"`
}

type Bill struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ConsultationID uuid.UUID `gorm:"type:uuid;not null" json:"consultation_id"`
	TotalDrugsCost float64   `gorm:"type:decimal(10,2);default:0.00" json:"total_drugs_cost"`
	TotalTestsCost float64   `gorm:"type:decimal(10,2);default:0.00" json:"total_tests_cost"`
	OtherCharges   float64   `gorm:"type:decimal(10,2);default:0.00" json:"other_charges"`
	FinalAmount    float64   `gorm:"->;type:decimal(10,2)" json:"final_amount"`
}

// ==========================================
// 2. Request & Response Structs
// ==========================================

type ProcessNoteRequest struct {
	PatientID uuid.UUID `json:"patient_id" binding:"required"`
	RawInput  string    `json:"raw_input" binding:"required"`
}

type AIParsedDrug struct {
	Name   string  `json:"name"`
	Dosage string  `json:"dosage"`
	Cost   float64 `json:"cost"`
}

type AIParsedTest struct {
	Name string  `json:"name"`
	Cost float64 `json:"cost"`
}

type AIParsedResult struct {
	Observations string         `json:"observations"`
	Drugs        []AIParsedDrug `json:"drugs"`
	LabTests     []AIParsedTest `json:"lab_tests"`
}

// ==========================================
// 3. Main Application
// ==========================================

var db *gorm.DB

func main() {
	// අලුතින් එකතු කරපු කෑල්ල: .env file එක load කරනවා
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading it")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=clinic port=5432 sslmode=disable"
	}

	db, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, // Supabase Pooler එකත් එක්ක වැඩ කරන්න මේක අනිවාර්යයි
	}), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	r := gin.Default()

	// Enable CORS for React Frontend
	r.Use(cors.Default())

	api := r.Group("/api")
	{
		api.POST("/process-note", processNoteHandler)
		api.GET("/consultations/:id", getConsultationHandler)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000" // Set to 3000 by default
	}
	r.Run(":" + port)
}

// ==========================================
// 4. Handlers & Business Logic
// ==========================================

func processNoteHandler(c *gin.Context) {
	var req ProcessNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	parsedData, err := parseNoteWithAI(c.Request.Context(), req.RawInput)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI Parsing failed: " + err.Error()})
		return
	}

	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start database transaction"})
		return
	}

	consultation := Consultation{
		PatientID:           req.PatientID,
		RawVoiceOrTextInput: req.RawInput,
		ParsedObservations:  parsedData.Observations,
	}

	if err := tx.Create(&consultation).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save consultation"})
		return
	}

	var totalDrugsCost float64 = 0
	for _, d := range parsedData.Drugs {
		prescription := Prescription{
			ConsultationID: consultation.ID,
			DrugName:       d.Name,
			Dosage:         d.Dosage,
			Cost:           d.Cost,
		}
		if err := tx.Create(&prescription).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save prescription"})
			return
		}
		totalDrugsCost += d.Cost
	}

	var totalTestsCost float64 = 0
	for _, t := range parsedData.LabTests {
		labTest := LabTest{
			ConsultationID: consultation.ID,
			TestName:       t.Name,
			Cost:           t.Cost,
		}
		if err := tx.Create(&labTest).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save lab test"})
			return
		}
		totalTestsCost += t.Cost
	}

	const doctorFee = 1500.00
	bill := Bill{
		ConsultationID: consultation.ID,
		TotalDrugsCost: totalDrugsCost,
		TotalTestsCost: totalTestsCost,
		OtherCharges:   doctorFee,
	}

	if err := tx.Create(&bill).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save bill"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	var completeConsultation Consultation
	err = db.Preload("Patient").
		Preload("Prescriptions").
		Preload("LabTests").
		Preload("Bill").
		First(&completeConsultation, "id = ?", consultation.ID).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch saved record"})
		return
	}

	c.JSON(http.StatusOK, completeConsultation)
}

func getConsultationHandler(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var consultation Consultation
	result := db.Preload("Patient").
		Preload("Prescriptions").
		Preload("LabTests").
		Preload("Bill").
		First(&consultation, "id = ?", id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Consultation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, consultation)
}

// ==========================================
// 5. AI Integration (Google Gemini)
// ==========================================

func parseNoteWithAI(ctx context.Context, rawInput string) (*AIParsedResult, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Println("WARNING: GEMINI_API_KEY not set. Using mock AI response.")
		return mockAIParsing(rawInput), nil
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create AI client: %w", err)
	}
	defer client.Close()

	// model := client.GenerativeModel("gemini-1.5-flash")
	model := client.GenerativeModel("gemini-2.5-flash")
	model.ResponseMIMEType = "application/json"

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(`You are a strict medical data extractor. Parse the raw input and return ONLY a valid JSON object. 
DO NOT use markdown formatting, backticks, or bullet points (like '-'). 
Use exactly this JSON schema:
{
  "observations": "string (summary of notes)",
  "drugs": [{"name": "string", "dosage": "string", "cost": number}],
  "lab_tests": [{"name": "string", "cost": number}]
}
If a cost is not mentioned, use 0. Return NOTHING ELSE except the JSON object.`),
		},
	}

	resp, err := model.GenerateContent(ctx, genai.Text(rawInput))
	if err != nil {
		return nil, fmt.Errorf("AI generation error: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from AI")
	}

	part := resp.Candidates[0].Content.Parts[0]
	text, ok := part.(genai.Text)
	if !ok {
		return nil, fmt.Errorf("unexpected response type from AI")
	}

	jsonText := string(text)

	jsonText = strings.TrimPrefix(jsonText, "```json")
	jsonText = strings.TrimPrefix(jsonText, "```")
	jsonText = strings.TrimSuffix(jsonText, "```")
	jsonText = strings.TrimSpace(jsonText)

	var result AIParsedResult
	if err := json.Unmarshal([]byte(jsonText), &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal AI JSON: %w", err)
	}

	return &result, nil
}

func mockAIParsing(rawInput string) *AIParsedResult {
	return &AIParsedResult{
		Observations: "Patient presents with mild fever and sore throat. Suspected viral pharyngitis.",
		Drugs: []AIParsedDrug{
			{Name: "Paracetamol", Dosage: "500mg BID", Cost: 150.00},
			{Name: "Amoxicillin", Dosage: "250mg TID", Cost: 450.00},
		},
		LabTests: []AIParsedTest{
			{Name: "Complete Blood Count (CBC)", Cost: 800.00},
			{Name: "Throat Swab Culture", Cost: 1200.00},
		},
	}
}

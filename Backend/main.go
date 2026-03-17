package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
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
	ID     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name   string    `gorm:"not null" json:"name"`
	Age    int       `json:"age"`
	Gender string    `json:"gender"` // අලුතින් එක් කළා
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
	PatientName   string `json:"patient_name" binding:"required"`
	PatientAge    int    `json:"patient_age" binding:"required"`
	PatientGender string `json:"patient_gender" binding:"required"`
	RawInput      string `json:"raw_input" binding:"required"`
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
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Database Schema එක auto update කිරීමට මෙය එක් කරන්න
	db.AutoMigrate(&Patient{}, &Consultation{}, &Prescription{}, &LabTest{}, &Bill{})

	r := gin.Default()
	r.Use(cors.Default())

	api := r.Group("/api")
	{
		api.POST("/process-note", processNoteHandler)
		api.GET("/consultations/:id", getConsultationHandler)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
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

	// Step 1: Create Patient
	patient := Patient{
		ID:     uuid.New(),
		Name:   req.PatientName,
		Age:    req.PatientAge,
		Gender: req.PatientGender,
	}
	if err := tx.Create(&patient).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create patient"})
		return
	}

	// Step 2: Create Consultation
	consultation := Consultation{
		ID:                  uuid.New(),
		PatientID:           patient.ID,
		RawVoiceOrTextInput: req.RawInput,
		ParsedObservations:  parsedData.Observations,
	}
	if err := tx.Create(&consultation).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save consultation"})
		return
	}

	// Step 3: Create Prescriptions
	var totalDrugsCost float64 = 0
	for _, d := range parsedData.Drugs {
		p := Prescription{
			ID:             uuid.New(),
			ConsultationID: consultation.ID,
			DrugName:       d.Name,
			Dosage:         d.Dosage,
			Cost:           d.Cost,
		}
		tx.Create(&p)
		totalDrugsCost += d.Cost
	}

	// Step 4: Create Lab Tests
	var totalTestsCost float64 = 0
	for _, t := range parsedData.LabTests {
		lt := LabTest{
			ID:             uuid.New(),
			ConsultationID: consultation.ID,
			TestName:       t.Name,
			Cost:           t.Cost,
		}
		tx.Create(&lt)
		totalTestsCost += t.Cost
	}

	// Step 5: Create Bill
	const doctorFee = 1500.00
	bill := Bill{
		ID:             uuid.New(),
		ConsultationID: consultation.ID,
		TotalDrugsCost: totalDrugsCost,
		TotalTestsCost: totalTestsCost,
		OtherCharges:   doctorFee,
	}
	tx.Create(&bill)

	tx.Commit()

	// Return full data
	var completeConsultation Consultation
	db.Preload("Patient").Preload("Prescriptions").Preload("LabTests").Preload("Bill").
		First(&completeConsultation, "id = ?", consultation.ID)

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
	result := db.Preload("Patient").Preload("Prescriptions").Preload("LabTests").Preload("Bill").First(&consultation, "id = ?", id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Consultation not found"})
		return
	}

	c.JSON(http.StatusOK, consultation)
}

// AI Integration සහ MockParsing ශ්‍රිත එලෙසම පවතී...
func parseNoteWithAI(ctx context.Context, rawInput string) (*AIParsedResult, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return mockAIParsing(rawInput), nil
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash") // Version එක fixed කළා
	model.ResponseMIMEType = "application/json"
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(`Parse raw medical notes into JSON with 'observations', 'drugs' (name, dosage, cost), and 'lab_tests' (name, cost). No markdown.`),
		},
	}

	resp, err := model.GenerateContent(ctx, genai.Text(rawInput))
	if err != nil {
		return nil, err
	}

	text := string(resp.Candidates[0].Content.Parts[0].(genai.Text))
	var result AIParsedResult
	json.Unmarshal([]byte(text), &result)
	return &result, nil
}

func mockAIParsing(rawInput string) *AIParsedResult {
	return &AIParsedResult{
		Observations: "Mock observation",
		Drugs:        []AIParsedDrug{{Name: "Mock Drug", Dosage: "1 daily", Cost: 100}},
		LabTests:     []AIParsedTest{{Name: "Mock Test", Cost: 500}},
	}
}

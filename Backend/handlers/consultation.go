package handlers

import (
	"clinic-backend/database"
	"clinic-backend/models"
	"clinic-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func ProcessNoteHandler(c *gin.Context) {
	var req models.ProcessNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	parsedData, err := services.ParseNoteWithAI(c.Request.Context(), req.RawInput)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	tx := database.DB.Begin()

	patient := models.Patient{
		ID: uuid.New(), Name: req.PatientName, Age: req.PatientAge, Gender: req.PatientGender,
	}
	tx.Create(&patient)

	consultation := models.Consultation{
		ID: uuid.New(), PatientID: patient.ID, RawVoiceOrTextInput: req.RawInput, ParsedObservations: parsedData.Observations,
	}
	tx.Create(&consultation)

	var totalDrugs, totalTests float64
	for _, d := range parsedData.Drugs {
		tx.Create(&models.Prescription{ID: uuid.New(), ConsultationID: consultation.ID, DrugName: d.Name, Dosage: d.Dosage, Cost: d.Cost})
		totalDrugs += d.Cost
	}
	for _, t := range parsedData.LabTests {
		tx.Create(&models.LabTest{ID: uuid.New(), ConsultationID: consultation.ID, TestName: t.Name, Cost: t.Cost})
		totalTests += t.Cost
	}

	const doctorFee = 1500.00
	tx.Create(&models.Bill{ID: uuid.New(), ConsultationID: consultation.ID, TotalDrugsCost: totalDrugs, TotalTestsCost: totalTests, OtherCharges: doctorFee, FinalAmount: totalDrugs + totalTests + doctorFee})

	tx.Commit()

	var completeConsultation models.Consultation
	database.DB.Preload("Patient").Preload("Prescriptions").Preload("LabTests").Preload("Bill").First(&completeConsultation, "id = ?", consultation.ID)
	c.JSON(http.StatusOK, completeConsultation)
}

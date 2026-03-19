package models

import (
	"time"

	"github.com/google/uuid"
)

// --- Database Models ---

type Patient struct {
	ID     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name   string    `gorm:"not null" json:"name"`
	Age    int       `json:"age"`
	Gender string    `json:"gender"`
}

type Consultation struct {
	ID                  uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PatientID           uuid.UUID      `gorm:"type:uuid;not null" json:"patient_id"`
	RawVoiceOrTextInput string         `json:"raw_voice_or_text_input"`
	ParsedObservations  string         `json:"parsed_observations"`
	CreatedAt           time.Time      `json:"created_at"`
	Patient             Patient        `gorm:"foreignKey:PatientID" json:"patient"`
	Prescriptions       []Prescription `gorm:"foreignKey:ConsultationID" json:"prescriptions"`
	LabTests            []LabTest      `gorm:"foreignKey:ConsultationID" json:"lab_tests"`
	Bill                Bill           `gorm:"foreignKey:ConsultationID" json:"bill"`
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
	FinalAmount    float64   `gorm:"column:final_payable_amount;type:decimal(10,2);default:0.00" json:"final_amount"`
}

// --- Request/AI Structs ---

type ProcessNoteRequest struct {
	PatientName   string `json:"patient_name" binding:"required"`
	PatientAge    int    `json:"patient_age" binding:"required"`
	PatientGender string `json:"patient_gender" binding:"required"`
	RawInput      string `json:"raw_input" binding:"required"`
}

type AIParsedResult struct {
	Observations string `json:"observations"`
	Drugs        []struct {
		Name   string  `json:"name"`
		Dosage string  `json:"dosage"`
		Cost   float64 `json:"cost"`
	} `json:"drugs"`
	LabTests []struct {
		Name string  `json:"name"`
		Cost float64 `json:"cost"`
	} `json:"lab_tests"`
}

package services

import (
	"clinic-backend/models"
	"context"
	"encoding/json"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func ParseNoteWithAI(ctx context.Context, rawInput string) (*models.AIParsedResult, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return MockAIParsing(rawInput), nil
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")
	model.ResponseMIMEType = "application/json"

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(`Extract medical information and return ONLY raw JSON. Costs must be numbers only. Default cost is 0.
			Schema: { "observations": "string", "drugs": [{"name": "string", "dosage": "string", "cost": number}], "lab_tests": [{"name": "string", "cost": number}] }`),
		},
	}

	resp, err := model.GenerateContent(ctx, genai.Text(rawInput))
	if err != nil {
		return nil, err
	}

	text := string(resp.Candidates[0].Content.Parts[0].(genai.Text))

	var result models.AIParsedResult
	if err := json.Unmarshal([]byte(text), &result); err != nil {
		return nil, err
	}

	return &result, nil
}

func MockAIParsing(rawInput string) *models.AIParsedResult {
	return &models.AIParsedResult{
		Observations: "Mock observation for testing",
	}
}

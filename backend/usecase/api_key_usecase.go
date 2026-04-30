package usecase

import (
	"backend/repository"
	"crypto/rand"
	"encoding/hex"
)

type APIKeyUsecase struct {
	repo repository.APIKeyRepository
}

func NewAPIKeyUsecase(r repository.APIKeyRepository) *APIKeyUsecase {
	return &APIKeyUsecase{repo: r}
}

func (u *APIKeyUsecase) ValidateAPIKey(key string) (int, error) {
	return u.repo.GetUserIDByAPIKey(key)
}

// 🔥 ตัวที่ fix error นี้
func (u *APIKeyUsecase) CreateKey(userID int) (string, error) {
	apiKey, err := generateAPIKey()
	if err != nil {
		return "", err
	}

	err = u.repo.CreateAPIKey(userID, apiKey)
	if err != nil {
		return "", err
	}

	return apiKey, nil
}

func generateAPIKey() (string, error) {
	bytes := make([]byte, 32)

	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(bytes), nil
}
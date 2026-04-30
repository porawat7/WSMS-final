package usecase

import (
	"crypto/rand"
	"encoding/hex"
)

// 🔥 interface (สำคัญ)
type APIKeyRepository interface {
	FindByKey(key string) (int, error)
	Create(userID int, key string) error
}

type APIKeyUsecase struct {
	repo APIKeyRepository
}

func NewAPIKeyUsecase(r APIKeyRepository) *APIKeyUsecase {
	return &APIKeyUsecase{repo: r}
}

// 🔥 validate key
func (u *APIKeyUsecase) ValidateKey(key string) (int, error) {
	return u.repo.FindByKey(key)
}

// 🔥 generate key
func generateAPIKey() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// 🔥 create key
func (u *APIKeyUsecase) CreateKey(userID int) (string, error) {
	key := generateAPIKey()

	err := u.repo.Create(userID, key)
	if err != nil {
		return "", err
	}

	return key, nil
}
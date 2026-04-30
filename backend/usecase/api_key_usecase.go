package usecase

import (
	"crypto/rand"
	"encoding/hex"
)

// interface
type APIKeyRepository interface {
	FindByKey(key string) (int, error)
	Create(userID int, key string) error
	FindByUserID(userID int) (string, error) // 🔥 เพิ่ม
}

type APIKeyUsecase struct {
	repo APIKeyRepository
}

func NewAPIKeyUsecase(r APIKeyRepository) *APIKeyUsecase {
	return &APIKeyUsecase{repo: r}
}

// validate key
func (u *APIKeyUsecase) ValidateKey(key string) (int, error) {
	return u.repo.FindByKey(key)
}

// generate key
func generateAPIKey() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// create key
func (u *APIKeyUsecase) CreateKey(userID int) (string, error) {

	for {
		key, err := generateAPIKey()
		if err != nil {
			return "", err
		}

		err = u.repo.Create(userID, key)
		if err == nil {
			return key, nil
		}
	}
}

// 🔥 ตัวหลัก (สำคัญ)
func (u *APIKeyUsecase) GetOrCreateKey(userID int) (string, error) {

	// หา key เดิม
	key, err := u.repo.FindByUserID(userID)
	if err == nil {
		return key, nil
	}

	// ไม่มี → สร้างใหม่
	return u.CreateKey(userID)
}
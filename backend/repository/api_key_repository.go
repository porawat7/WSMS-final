package repository

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
)

type APIKeyRepository struct {
	db *sql.DB
}

func NewAPIKeyRepository(db *sql.DB) *APIKeyRepository {
	return &APIKeyRepository{db: db}
}

// สร้าง random api key
func generateAPIKey() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (r *APIKeyRepository) CreateAPIKey(userID int) (string, error) {
	key, err := generateAPIKey()
	if err != nil {
		return "", err
	}

	_, err = r.db.Exec(`
		INSERT INTO api_keys (user_id, api_key)
		VALUES ($1, $2)
	`, userID, key)

	if err != nil {
		return "", err
	}

	return key, nil
}

func (r *APIKeyRepository) ValidateAPIKey(key string) (int, error) {
	var userID int

	err := r.db.QueryRow(`
		SELECT user_id
		FROM api_keys
		WHERE api_key = $1
	`, key).Scan(&userID)

	if err != nil {
		return 0, err
	}

	return userID, nil
}
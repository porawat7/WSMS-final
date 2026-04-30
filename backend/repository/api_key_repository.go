package repository

import "database/sql"

type APIKeyRepository interface {
	GetUserIDByAPIKey(key string) (int, error)
	CreateAPIKey(userID int, apiKey string) error
}

type apiKeyRepository struct {
	db *sql.DB
}

func NewAPIKeyRepository(db *sql.DB) APIKeyRepository {
	return &apiKeyRepository{db: db}
}

func (r *apiKeyRepository) GetUserIDByAPIKey(key string) (int, error) {
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

func (r *apiKeyRepository) CreateAPIKey(userID int, apiKey string) error {
	_, err := r.db.Exec(`
		INSERT INTO api_keys (user_id, api_key)
		VALUES ($1, $2)
	`, userID, apiKey)

	return err
}
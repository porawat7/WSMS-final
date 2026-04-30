package repository

import "database/sql"

type apiKeyRepository struct {
	db *sql.DB
}

func NewAPIKeyRepository(db *sql.DB) *apiKeyRepository {
	return &apiKeyRepository{db: db}
}

// validate
func (r *apiKeyRepository) FindByKey(key string) (int, error) {
	var userID int

	err := r.db.QueryRow(
		"SELECT user_id FROM api_keys WHERE api_key = $1",
		key,
	).Scan(&userID)

	return userID, err
}

// create
func (r *apiKeyRepository) Create(userID int, key string) error {
	_, err := r.db.Exec(
		"INSERT INTO api_keys (user_id, api_key) VALUES ($1, $2)",
		userID, key,
	)
	return err
}

// 🔥 เพิ่ม
func (r *apiKeyRepository) FindByUserID(userID int) (string, error) {

	var key string

	err := r.db.QueryRow(
		"SELECT api_key FROM api_keys WHERE user_id=$1 LIMIT 1",
		userID,
	).Scan(&key)

	return key, err
}
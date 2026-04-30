package repository

import "database/sql"

// 🔥 ต้องมี struct นี้
type apiKeyRepository struct {
	db *sql.DB
}

func NewAPIKeyRepository(db *sql.DB) *apiKeyRepository {
	return &apiKeyRepository{db: db}
}

// 🔥 ใช้ตอน validate
func (r *apiKeyRepository) FindByKey(key string) (int, error) {
	var userID int
	err := r.db.QueryRow(
		"SELECT user_id FROM api_keys WHERE api_key=$1",
		key,
	).Scan(&userID)

	return userID, err
}

// 🔥 ใช้ตอนสร้าง key
func (r *apiKeyRepository) Create(userID int, key string) error {
	_, err := r.db.Exec(
		"INSERT INTO api_keys (user_id, api_key) VALUES ($1, $2)",
		userID, key,
	)
	return err
}
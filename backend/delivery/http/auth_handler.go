package http

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
)

type AuthHandler struct {
	db *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID       int
	Name     string
	Email    string
	Status   string
	Password string
}

// 🔥 สร้าง API KEY
func generateAPIKey() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {

	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var user User

	err = h.db.QueryRow(`
		SELECT id, name, email, password, status
		FROM users
		WHERE email = $1
	`, req.Email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Status,
	)

	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if user.Password != req.Password {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// 🔥 หา api_key
	var apiKey string

	err = h.db.QueryRow(`
		SELECT api_key FROM api_keys WHERE user_id = $1
	`, user.ID).Scan(&apiKey)

	// 🔥 ถ้าไม่มี → สร้างใหม่
	if err == sql.ErrNoRows {

		apiKey = generateAPIKey()

		_, err = h.db.Exec(`
			INSERT INTO api_keys (user_id, api_key)
			VALUES ($1, $2)
		`, user.ID, apiKey)

		if err != nil {
			http.Error(w, "Cannot create api key", http.StatusInternalServerError)
			return
		}
	}

	// 🔥 response ครบ
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      user.ID,
		"name":    user.Name,
		"email":   user.Email,
		"status":  user.Status,
		"api_key": apiKey, // 🔥 ตัวสำคัญ
	})
}
package http

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
)

type AuthHandler struct {
	DB *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{DB: db}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func generateAPIKey() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var userID int
	var name, email, status string

	err := h.DB.QueryRow(`
		SELECT id, name, email, status
		FROM users
		WHERE email=$1 AND password=$2
	`, req.Email, req.Password).Scan(&userID, &name, &email, &status)

	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// 🔥 หา api key เดิมก่อน
	var apiKey string
	err = h.DB.QueryRow(`
		SELECT api_key FROM api_keys WHERE user_id=$1
	`, userID).Scan(&apiKey)

	// ถ้าไม่มี → สร้างใหม่
	if err == sql.ErrNoRows {
		apiKey = generateAPIKey()
		_, err = h.DB.Exec(`
			INSERT INTO api_keys (user_id, api_key)
			VALUES ($1, $2)
		`, userID, apiKey)

		if err != nil {
			http.Error(w, "Failed to create API key", http.StatusInternalServerError)
			return
		}
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      userID,
		"name":    name,
		"email":   email,
		"status":  status,
		"api_key": apiKey,
	})
}
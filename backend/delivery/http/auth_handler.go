package http

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type AuthHandler struct {
	DB *sql.DB
	apiKeyUsecase interface {
		GetOrCreateKey(userID int) (string, error)
	}
}

func NewAuthHandler(db *sql.DB, apiKeyUsecase interface {
	GetOrCreateKey(userID int) (string, error)
}) *AuthHandler {
	return &AuthHandler{
		DB: db,
		apiKeyUsecase: apiKeyUsecase,
	}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {

	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", 400)
		return
	}

	var userID int
	var name, email, role string

	err = h.DB.QueryRow(`
		SELECT id, name, email, status
		FROM users
		WHERE email=$1 AND password=$2
	`, req.Email, req.Password).Scan(&userID, &name, &email, &role)

	if err != nil {
		http.Error(w, "Invalid credentials", 401)
		return
	}

	// 🔥 สำคัญ: get หรือ create key
	apiKey, err := h.apiKeyUsecase.GetOrCreateKey(userID)
	if err != nil {
		http.Error(w, "Failed to get API key", 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      userID,
		"name":    name,
		"email":   email,
		"role":    role,
		"api_key": apiKey,
	})
}
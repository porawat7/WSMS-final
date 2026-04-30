package http

import (
	"backend/domain"
	"database/sql"
	"encoding/json"
	"net/http"
)

type AuthHandler struct {
	DB *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{DB: db}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {

	var req domain.LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var name string

	err = h.DB.QueryRow(
		"SELECT name FROM users WHERE email=$1 AND password=$2",
		req.Email,
		req.Password,
	).Scan(&name)

	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(domain.LoginResponse{
		Message: "login success",
		Role:    "user",
		Name:    name,
	})
}
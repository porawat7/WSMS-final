package http

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type UserHandler struct {
	db *sql.DB
}

func NewUserHandler(db *sql.DB) *UserHandler {
	return &UserHandler{db: db}
}

// ---------------- GET ME ----------------
func (h *UserHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	apiKey := r.Header.Get("x-api-key")

	var name, email, status string

	err := h.db.QueryRow(`
		SELECT u.name, u.email, u.status
		FROM users u
		JOIN api_keys a ON a.user_id = u.id
		WHERE a.api_key = $1
	`, apiKey).Scan(&name, &email, &status)

	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"name":   name,
		"email":  email,
		"status": status,
	})
}

// ---------------- UPDATE PACKAGE ----------------
func (h *UserHandler) UpdateUserPackage(w http.ResponseWriter, r *http.Request) {
	apiKey := r.Header.Get("x-api-key")

	var body struct {
		Status string `json:"status"`
	}

	json.NewDecoder(r.Body).Decode(&body)

	_, err := h.db.Exec(`
		UPDATE users
		SET status = $1
		WHERE id = (
			SELECT user_id FROM api_keys WHERE api_key = $2
		)
	`, body.Status, apiKey)

	if err != nil {
		http.Error(w, "Update failed", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "updated",
	})
}
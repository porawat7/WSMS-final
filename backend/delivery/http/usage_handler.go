package http

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type UsageHandler struct {
	db *sql.DB
}

func NewUsageHandler(db *sql.DB) *UsageHandler {
	return &UsageHandler{db: db}
}

func (h *UsageHandler) GetUsage(w http.ResponseWriter, r *http.Request) {

	apiKey, ok := r.Context().Value("apiKey").(string)
	if !ok || apiKey == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var used int
	var status string

	err := h.db.QueryRow(`
		SELECT u.numrequest, u.status
		FROM users u
		JOIN api_keys a ON a.user_id = u.id
		WHERE a.api_key = $1
	`, apiKey).Scan(&used, &status)

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// limit ตาม plan (ต้องตรงกับ middleware)
	limitMap := map[string]int{
		"basic":  1000,
		"silver": 5000,
		"gold":   10000,
	}

	limit := limitMap[status]

	response := map[string]interface{}{
		"used":  used,
		"limit": limit,
		"plan":  status,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
package http

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type UsageHandler struct {
	db *sql.DB
}

func NewUsageHandler(db *sql.DB) *UsageHandler {
	return &UsageHandler{db: db}
}

func (h *UsageHandler) GetUsage(w http.ResponseWriter, r *http.Request) {

	apiKey := r.Header.Get("x-api-key")
	if apiKey == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var status string
	var used int

	err := h.db.QueryRow(`
		SELECT u.status, COALESCE(u.numrequest,0)
		FROM users u
		JOIN api_keys a ON a.user_id = u.id
		WHERE a.api_key = $1
	`, apiKey).Scan(&status, &used)

	if err != nil {
		log.Println("❌ Query error:", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// 🔥 FIX: normalize status
	status = strings.ToLower(status)

	// 🔥 DEBUG
	log.Println("✅ STATUS:", status)
	log.Println("✅ USED:", used)

	// 🔥 map limit
	limit := 1000

	switch status {
	case "silver":
		limit = 5000
	case "gold":
		limit = 10000
	case "basic":
		limit = 1000
	default:
		limit = 1000
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"used":   used,
		"limit":  limit,
		"status": status,
	})
}
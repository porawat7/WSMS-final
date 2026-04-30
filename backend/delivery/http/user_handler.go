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

type UpgradeRequest struct {
	Status string `json:"status"`
}

func (h *UserHandler) UpgradePlan(w http.ResponseWriter, r *http.Request) {

	apiKey := r.Header.Get("x-api-key")
	if apiKey == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req UpgradeRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	// 🔥 update status ผ่าน api_key
	_, err = h.db.Exec(`
		UPDATE users
		SET status = $1
		WHERE id = (
			SELECT user_id FROM api_keys WHERE api_key = $2
		)
	`, req.Status, apiKey)

	if err != nil {
		http.Error(w, "Update failed", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "updated",
	})
}
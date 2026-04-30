	package http

	import (
		"database/sql"
		"encoding/json"
		"net/http"
	)

	type UsageHandler struct {
		DB *sql.DB
	}

	func NewUsageHandler(db *sql.DB) *UsageHandler {
		return &UsageHandler{DB: db}
	}

	func (h *UsageHandler) GetUsage(w http.ResponseWriter, r *http.Request) {

		apiKey, _ := r.Context().Value("apiKey").(string)

		var total int
		err := h.DB.QueryRow(`
			SELECT COUNT(*) FROM api_usage WHERE api_key = $1
		`, apiKey).Scan(&total)

		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		json.NewEncoder(w).Encode(map[string]int{
			"total_requests": total,
		})
	}
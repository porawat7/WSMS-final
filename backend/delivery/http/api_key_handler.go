package http

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend/usecase"
)

type APIKeyHandler struct {
	usecase *usecase.APIKeyUsecase
}

func NewAPIKeyHandler(u *usecase.APIKeyUsecase) *APIKeyHandler {
	return &APIKeyHandler{usecase: u}
}

// POST /api/v1/apikey?user_id=1
func (h *APIKeyHandler) CreateAPIKey(w http.ResponseWriter, r *http.Request) {

	userIDStr := r.URL.Query().Get("user_id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "invalid user_id", 400)
		return
	}

	key, err := h.usecase.CreateAPIKey(userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"api_key": key,
	})
}
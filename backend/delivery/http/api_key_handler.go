package http

import (
	"encoding/json"
	"net/http"

	"backend/usecase"
)

type APIKeyHandler struct {
	usecase *usecase.APIKeyUsecase
}

func NewAPIKeyHandler(u *usecase.APIKeyUsecase) *APIKeyHandler {
	return &APIKeyHandler{usecase: u}
}

// create api key
func (h *APIKeyHandler) CreateKey(w http.ResponseWriter, r *http.Request) {

	userID := 1 // 🔥 test (ภายหลังค่อย bind จาก auth)

	key, err := h.usecase.CreateKey(userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// 🔥 FIX: set header
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"api_key": key,
	})
}
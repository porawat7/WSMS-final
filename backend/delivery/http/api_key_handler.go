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

// 🔥 ไม่ต้องส่ง user_id แล้ว
func (h *APIKeyHandler) CreateKey(w http.ResponseWriter, r *http.Request) {

	userID := 1 // 🔥 test ไปก่อน

	key, err := h.usecase.CreateKey(userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"api_key": key,
	})
}
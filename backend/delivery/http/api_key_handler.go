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


func (h *APIKeyHandler) CreateKey(w http.ResponseWriter, r *http.Request) {

	userID := 1 

	key, err := h.usecase.CreateKey(userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"api_key": key,
	})
}


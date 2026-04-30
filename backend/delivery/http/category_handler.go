package http

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend/usecase"
)

type CategoryHandler struct {
	usecase *usecase.CategoryUsecase
}

func NewCategoryHandler(u *usecase.CategoryUsecase) *CategoryHandler {
	return &CategoryHandler{usecase: u}
}

func (h *CategoryHandler) GetAllCategories(w http.ResponseWriter, r *http.Request) {

	categories, err := h.usecase.GetAllCategories()
	if err != nil {
		fmt.Println("ERROR:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(categories)
}
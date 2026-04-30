package http

import (
	"encoding/json"
	"net/http"

	"backend/usecase"
)

type CourseHandler struct {
	usecase *usecase.CourseUsecase
}

func NewCourseHandler(u *usecase.CourseUsecase) *CourseHandler {
	return &CourseHandler{usecase: u}
}

func (h *CourseHandler) GetAllCourses(w http.ResponseWriter, r *http.Request) {
	courses, err := h.usecase.GetAllCourses()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}
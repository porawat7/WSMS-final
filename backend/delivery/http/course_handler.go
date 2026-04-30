package http

import (
	"backend/usecase"
	"encoding/json"
	"net/http"
	"strconv"
)

type CourseHandler struct {
	usecase *usecase.CourseUsecase
}

func NewCourseHandler(u *usecase.CourseUsecase) *CourseHandler {
	return &CourseHandler{usecase: u}
}

// GET /api/v1/courses
// GET /api/v1/courses?category_id=1
func (h *CourseHandler) GetCourses(w http.ResponseWriter, r *http.Request) {

	categoryStr := r.URL.Query().Get("category_id")

	var (
		data interface{}
		err  error
	)

	if categoryStr != "" {
		id, _ := strconv.Atoi(categoryStr)
		data, err = h.usecase.GetByCategoryID(id)
	} else {
		data, err = h.usecase.GetAllCourses()
	}

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}


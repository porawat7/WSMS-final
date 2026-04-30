package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"backend/usecase"
)

type CourseHandler struct {
	usecase *usecase.CourseUsecase
}

func NewCourseHandler(u *usecase.CourseUsecase) *CourseHandler {
	return &CourseHandler{usecase: u}
}

//
// ---------------- GET ALL + FILTER ----------------
//

func (h *CourseHandler) GetAllCourses(w http.ResponseWriter, r *http.Request) {

	categoryIDStr := r.URL.Query().Get("category_id")

	// ✅ ถ้ามี filter category_id
	if categoryIDStr != "" {
		categoryID, err := strconv.Atoi(categoryIDStr)
		if err != nil {
			http.Error(w, "Invalid category_id", http.StatusBadRequest)
			return
		}

		courses, err := h.usecase.GetCoursesByCategory(categoryID)
		if err != nil {
			fmt.Println("ERROR:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(courses)
		return
	}

	// ✅ ไม่มี filter → ดึงทั้งหมด
	courses, err := h.usecase.GetAllCourses()
	if err != nil {
		fmt.Println("ERROR:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(courses)
}

//
// ---------------- GET BY ID ----------------
//

func (h *CourseHandler) GetCourseByID(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	course, err := h.usecase.GetCourseByID(id)
	if err != nil {
		fmt.Println("ERROR:", err)
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(course)
}

//
// ---------------- GET BY CATEGORY ----------------
//

func (h *CourseHandler) GetCoursesByCategory(w http.ResponseWriter, r *http.Request) {

	categoryIDStr := r.URL.Query().Get("category_id")
	if categoryIDStr == "" {
		http.Error(w, "Missing category_id", http.StatusBadRequest)
		return
	}

	categoryID, err := strconv.Atoi(categoryIDStr)
	if err != nil {
		http.Error(w, "Invalid category_id", http.StatusBadRequest)
		return
	}

	courses, err := h.usecase.GetCoursesByCategory(categoryID)
	if err != nil {
		fmt.Println("ERROR:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(courses)
}
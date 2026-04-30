package http

import (
	"backend/domain"
	"encoding/json"
	"net/http"
	"strconv"
)

type CourseHandler struct {
	Usecase domain.CourseUsecase
}

func NewCourseHandler(usecase domain.CourseUsecase) *CourseHandler {
	return &CourseHandler{
		Usecase: usecase,
	}
}

// ---------------- GET ALL ----------------
func (h *CourseHandler) GetAllCourses(w http.ResponseWriter, r *http.Request) {

	courses, err := h.Usecase.FetchAllCourses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

// ---------------- GET BY ID ----------------
func (h *CourseHandler) GetCourseByID(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	course, err := h.Usecase.FetchCourseDetails(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(course)
}

// ---------------- CREATE ----------------
func (h *CourseHandler) CreateCourse(w http.ResponseWriter, r *http.Request) {

	var course domain.Course

	err := json.NewDecoder(r.Body).Decode(&course)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Usecase.AddCourse(course)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// ---------------- UPDATE ----------------
func (h *CourseHandler) UpdateCourse(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var course domain.Course

	err = json.NewDecoder(r.Body).Decode(&course)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Usecase.EditCourse(id, course)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("updated"))
}

// ---------------- DELETE ----------------
func (h *CourseHandler) DeleteCourse(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = h.Usecase.RemoveCourse(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("deleted"))
}

// ---------------- CATEGORY ----------------
func (h *CourseHandler) GetCoursesByCategory(w http.ResponseWriter, r *http.Request) {

	idStr := r.URL.Query().Get("id")

	categoryID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid category id", http.StatusBadRequest)
		return
	}

	courses, err := h.Usecase.FetchCoursesByCategory(categoryID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(courses)
}
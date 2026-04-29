package http

import (
	"backend/domain"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
)

var planLimits = map[string]int{
	"basic":  1000,
	"silver": 10000,
	"gold":   999999,
}

type CourseHandler struct {
	Usecase domain.CourseUsecase
	DB      *sql.DB
}

func NewCourseHandler(usecase domain.CourseUsecase, db *sql.DB) *CourseHandler {
	return &CourseHandler{
		Usecase: usecase,
		DB:      db,
	}
}
func (h *CourseHandler) GetAllCourses(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")

	if email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	var status string
	var numrequest int

	err := h.DB.QueryRow(
		"SELECT status, numrequest FROM users WHERE email=$1",
		email,
	).Scan(&status, &numrequest)

	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	limit := planLimits[status]

	if numrequest >= limit {
		http.Error(w, "Request limit exceeded", http.StatusTooManyRequests)
		return
	}

	_, err = h.DB.Exec(
		"UPDATE users SET numrequest = numrequest + 1 WHERE email=$1",
		email,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	courses, err := h.Usecase.FetchAllCourses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(course)
}
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
	w.Write([]byte("Course created successfully"))
}

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

	w.Write([]byte("Course updated successfully"))
}

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

	w.Write([]byte("Course deleted successfully"))
}
func (h *CourseHandler) GetCoursesByCategory(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("name")
	if category == "" {
		http.Error(w, "Category name is required", http.StatusBadRequest)
		return
	}

	courses, err := h.Usecase.FetchCoursesByCategory(category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

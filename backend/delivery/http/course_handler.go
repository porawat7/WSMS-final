package http

import (
	"backend/usecase"
	"encoding/json"
	"net/http"
	"strconv"
)

type CourseHandler struct {
	usecase usecase.CourseUsecase
}

func NewCourseHandler(u usecase.CourseUsecase) *CourseHandler {
	return &CourseHandler{usecase: u}
}

func (h *CourseHandler) GetAllCourses(w http.ResponseWriter, r *http.Request) {

	apiKey := r.Header.Get("x-api-key")
	if apiKey == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	status, err := h.usecase.GetUserStatusByAPIKey(apiKey)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	categoryStr := r.URL.Query().Get("category_id")

	var data []map[string]interface{}

	if categoryStr != "" {
		categoryID, _ := strconv.Atoi(categoryStr)
		data, err = h.usecase.GetCoursesByCategory(categoryID)
	} else {
		data, err = h.usecase.GetAllCourses()
	}

	if err != nil {
		http.Error(w, "error fetching data", http.StatusInternalServerError)
		return
	}

	var result []map[string]interface{}

	for _, c := range data {

		item := map[string]interface{}{
			"id":    c["id"],
			"name":  c["name"],
			"price": c["price"],
			"category_id": c["category_id"],
		}

		// 🔥 silver
		if status == "silver" || status == "gold" {
			item["description"] = c["description"]
			item["start_date"] = c["start_date"]
		}

		// 🔥 gold
		if status == "gold" {
			item["platform"] = c["platform"]
			item["link"] = c["link"]
		}

		result = append(result, item)
	}

	json.NewEncoder(w).Encode(result)
}
package http

import (
	"backend/usecase"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type CourseHandler struct {
	usecase usecase.CourseUsecase
}

func NewCourseHandler(u usecase.CourseUsecase) *CourseHandler {
	return &CourseHandler{usecase: u}
}

func (h *CourseHandler) GetAllCourses(w http.ResponseWriter, r *http.Request) {

	// ===============================
	// 🔑 CHECK API KEY
	// ===============================
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
	search := r.URL.Query().Get("search")

	// ===============================
	// 🟥 BASIC BLOCK
	// ===============================
	if status == "basic" && (categoryStr != "" || search != "") {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "upgrade_required",
			"message": "Filter & search available for Silver plan and above",
		})
		return
	}

	// ===============================
	// 🩶 SILVER BLOCK
	// ===============================
	if status == "silver" && search != "" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{
			"error":   "upgrade_required",
			"message": "Search is available for Gold plan",
		})
		return
	}

	// ===============================
	// 📦 FETCH DATA
	// ===============================
	var data []map[string]interface{}

	if categoryStr != "" {
		categoryID, err := strconv.Atoi(categoryStr)
		if err != nil {
			http.Error(w, "invalid category_id", http.StatusBadRequest)
			return
		}

		data, err = h.usecase.GetCoursesByCategory(categoryID)
		if err != nil {
			http.Error(w, "error fetching data", http.StatusInternalServerError)
			return
		}
	} else {
		data, err = h.usecase.GetAllCourses()
		if err != nil {
			http.Error(w, "error fetching data", http.StatusInternalServerError)
			return
		}
	}

	// ===============================
	// 🔎 GOLD SEARCH
	// ===============================
	if status == "gold" && search != "" {
		data = filterBySearch(data, search)
	}

	// ===============================
	// 🎯 RESPONSE FILTER BY PLAN
	// ===============================
	var result []map[string]interface{}

	for _, c := range data {

		item := map[string]interface{}{
			"id":          c["id"],
			"name":        c["name"],
			"price":       c["price"],
			"category_id": c["category_id"],
		}

		// 🩶 silver
		if status == "silver" || status == "gold" {
			item["description"] = c["description"]
			item["start_date"] = c["start_date"]
		}

		// 🟨 gold
		if status == "gold" {
			item["platform"] = c["platform"]
			item["link"] = c["link"]
		}

		result = append(result, item)
	}

	json.NewEncoder(w).Encode(result)
}


func filterBySearch(data []map[string]interface{}, keyword string) []map[string]interface{} {

	keyword = strings.ToLower(keyword)
	var result []map[string]interface{}

	for _, c := range data {

		// search name
		if name, ok := c["name"].(string); ok {
			if strings.Contains(strings.ToLower(name), keyword) {
				result = append(result, c)
				continue
			}
		}

		// search description
		if desc, ok := c["description"].(string); ok {
			if strings.Contains(strings.ToLower(desc), keyword) {
				result = append(result, c)
				continue
			}
		}

		// 🔥 gold เท่ขึ้น → search platform
		if platform, ok := c["platform"].(string); ok {
			if strings.Contains(strings.ToLower(platform), keyword) {
				result = append(result, c)
			}
		}
	}

	return result
}
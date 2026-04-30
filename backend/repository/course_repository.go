package repository

import (
	"database/sql"
	"fmt"
)

type CourseRepository interface {
	GetAllCourses() ([]map[string]interface{}, error)
	GetCourseByID(id int) (map[string]interface{}, error)
	GetCoursesByCategory(categoryID int) ([]map[string]interface{}, error)
}

type courseRepository struct {
	db *sql.DB
}

func NewCourseRepository(db *sql.DB) CourseRepository {
	return &courseRepository{db: db}
}

//
// ---------------- GET ALL ----------------
//

func (r *courseRepository) GetAllCourses() ([]map[string]interface{}, error) {
	rows, err := r.db.Query(`
		SELECT 
			id,
			name,
			category_id,
			price,
			description,
			platform,
			link,
			start_date,
			time
		FROM courses
	`)
	if err != nil {
		fmt.Println("QUERY ERROR:", err)
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}

	for rows.Next() {
		var (
			id          int
			name        string
			categoryID  int
			price       int
			description string
			platform    string
			link        string
			startDate   string
			timeStr     string
		)

		err := rows.Scan(
			&id,
			&name,
			&categoryID,
			&price,
			&description,
			&platform,
			&link,
			&startDate,
			&timeStr,
		)
		if err != nil {
			return nil, err
		}

		results = append(results, map[string]interface{}{
			"id":          id,
			"name":        name,
			"category_id": categoryID,
			"price":       price,
			"description": description,
			"platform":    platform,
			"link":        link,
			"start_date":  startDate,
			"time":        timeStr,
		})
	}

	return results, nil
}

//
// ---------------- GET BY ID ----------------
//

func (r *courseRepository) GetCourseByID(id int) (map[string]interface{}, error) {

	var (
		name        string
		categoryID  int
		price       int
		description string
		platform    string
		link        string
		startDate   string
		timeStr     string
	)

	err := r.db.QueryRow(`
		SELECT 
			name,
			category_id,
			price,
			description,
			platform,
			link,
			start_date,
			time
		FROM courses
		WHERE id = $1
	`, id).Scan(
		&name,
		&categoryID,
		&price,
		&description,
		&platform,
		&link,
		&startDate,
		&timeStr,
	)

	if err != nil {
		fmt.Println("QUERY ERROR:", err)
		return nil, err
	}

	return map[string]interface{}{
		"id":          id,
		"name":        name,
		"category_id": categoryID,
		"price":       price,
		"description": description,
		"platform":    platform,
		"link":        link,
		"start_date":  startDate,
		"time":        timeStr,
	}, nil
}

//
// ---------------- GET BY CATEGORY ----------------
//

func (r *courseRepository) GetCoursesByCategory(categoryID int) ([]map[string]interface{}, error) {

	rows, err := r.db.Query(`
		SELECT 
			id,
			name,
			category_id,
			price,
			description,
			platform,
			link,
			start_date,
			time
		FROM courses
		WHERE category_id = $1
	`, categoryID)

	if err != nil {
		fmt.Println("QUERY ERROR:", err)
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}

	for rows.Next() {
		var (
			id          int
			name        string
			catID       int
			price       int
			description string
			platform    string
			link        string
			startDate   string
			timeStr     string
		)

		err := rows.Scan(
			&id,
			&name,
			&catID,
			&price,
			&description,
			&platform,
			&link,
			&startDate,
			&timeStr,
		)
		if err != nil {
			return nil, err
		}

		results = append(results, map[string]interface{}{
			"id":          id,
			"name":        name,
			"category_id": catID,
			"price":       price,
			"description": description,
			"platform":    platform,
			"link":        link,
			"start_date":  startDate,
			"time":        timeStr,
		})
	}

	return results, nil
}
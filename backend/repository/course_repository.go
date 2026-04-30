package repository

import "database/sql"

type CourseRepository interface {
	GetAllCourses() ([]map[string]interface{}, error)
	GetCoursesByCategory(categoryID int) ([]map[string]interface{}, error)
}

type courseRepository struct {
	db *sql.DB
}

func NewCourseRepository(db *sql.DB) CourseRepository {
	return &courseRepository{db: db}
}

func (r *courseRepository) GetAllCourses() ([]map[string]interface{}, error) {

	rows, err := r.db.Query(`
		SELECT id, name, category_id, price, description, platform, link, start_date, time
		FROM courses
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}

	for rows.Next() {
		var id, categoryID, price int
		var name, description, platform, link, startDate, timeStr string

		rows.Scan(&id, &name, &categoryID, &price, &description, &platform, &link, &startDate, &timeStr)

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

func (r *courseRepository) GetCoursesByCategory(categoryID int) ([]map[string]interface{}, error) {

	rows, err := r.db.Query(`
		SELECT id, name, category_id, price, description, platform, link, start_date, time
		FROM courses
		WHERE category_id = $1
	`, categoryID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}

	for rows.Next() {
		var id, catID, price int
		var name, description, platform, link, startDate, timeStr string

		rows.Scan(&id, &name, &catID, &price, &description, &platform, &link, &startDate, &timeStr)

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
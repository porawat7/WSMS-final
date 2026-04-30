package repository

import "database/sql"

type CourseRepository struct {
	db *sql.DB
}

func NewCourseRepository(db *sql.DB) *CourseRepository {
	return &CourseRepository{db: db}
}

func (r *CourseRepository) GetAllCourses() ([]map[string]interface{}, error) {
	rows, err := r.db.Query(`
		SELECT id, name, price, description, platform
		FROM courses
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []map[string]interface{}

	for rows.Next() {
		var id int
		var name, description, platform string
		var price int

		err := rows.Scan(&id, &name, &price, &description, &platform)
		if err != nil {
			return nil, err
		}

		courses = append(courses, map[string]interface{}{
			"id":          id,
			"name":        name,
			"price":       price,
			"description": description,
			"platform":    platform,
		})
	}

	return courses, nil
}
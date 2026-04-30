package repository

import (
	"backend/domain"
	"database/sql"
)

type CourseRepository struct {
	db *sql.DB
}

func NewCourseRepository(db *sql.DB) *CourseRepository {
	return &CourseRepository{db: db}
}

// ---------------- GET ALL ----------------

func (r *CourseRepository) GetAllCourses() ([]domain.Course, error) {
	rows, err := r.db.Query(`
		SELECT 
			c.id,
			c.name,
			c.category_id,
			c.price,
			c.description,
			c.platform,
			c.link,
			c.start_date,
			c.time,
			ct.name as category_name
		FROM courses c
		JOIN categories ct ON c.category_id = ct.id
		ORDER BY c.id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []domain.Course

	for rows.Next() {
		var c domain.Course

		err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.CategoryID,
			&c.Price,
			&c.Description,
			&c.Platform,
			&c.Link,
			&c.StartDate,
			&c.Time,
			&c.CategoryName,
		)
		if err != nil {
			return nil, err
		}

		courses = append(courses, c)
	}

	return courses, nil
}

// ---------------- GET BY CATEGORY ----------------

func (r *CourseRepository) GetByCategoryID(categoryID int) ([]domain.Course, error) {
	rows, err := r.db.Query(`
		SELECT 
			c.id,
			c.name,
			c.category_id,
			c.price,
			c.description,
			c.platform,
			c.link,
			c.start_date,
			c.time,
			ct.name as category_name
		FROM courses c
		JOIN categories ct ON c.category_id = ct.id
		WHERE c.category_id = $1
		ORDER BY c.id
	`, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.Course

	for rows.Next() {
		var c domain.Course

		err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.CategoryID,
			&c.Price,
			&c.Description,
			&c.Platform,
			&c.Link,
			&c.StartDate,
			&c.Time,
			&c.CategoryName,
		)
		if err != nil {
			return nil, err
		}

		list = append(list, c)
	}

	return list, nil
}
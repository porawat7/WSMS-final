package repository

import (
	"backend/domain"
	"database/sql"
)

type sqliteCourseRepository struct {
	db *sql.DB
}

// NewSQLiteCourseRepository creates a new instance of sqliteCourseRepository.
func NewSQLiteCourseRepository(db *sql.DB) domain.CourseRepository {
	return &sqliteCourseRepository{db: db}
}

func (r *sqliteCourseRepository) GetAllCourses() ([]domain.Course, error) {
	rows, err := r.db.Query("SELECT id, name, category, price, description, platform, link, startDate, time FROM courses")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []domain.Course
	for rows.Next() {
		var course domain.Course
		if err := rows.Scan(&course.ID, &course.Name, &course.Category, &course.Price, &course.Description, &course.Platform, &course.Link, &course.StartDate, &course.Time); err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}

func (r *sqliteCourseRepository) GetCourseByID(id int) (domain.Course, error) {
	var course domain.Course
	err := r.db.QueryRow("SELECT id, name, category, price, description, platform, link, startDate, time FROM courses WHERE id = $1", id).
		Scan(&course.ID, &course.Name, &course.Category, &course.Price, &course.Description, &course.Platform, &course.Link, &course.StartDate, &course.Time)
	if err != nil {
		return domain.Course{}, err
	}

	return course, nil
}
func (r *sqliteCourseRepository) CreateCourse(course domain.Course) error {
	_, err := r.db.Exec(
		"INSERT INTO courses (name, category, price, description, platform, link, startDate, time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
		course.Name, course.Category, course.Price, course.Description, course.Platform, course.Link, course.StartDate, course.Time,
	)
	return err
}

func (r *sqliteCourseRepository) UpdateCourse(id int, course domain.Course) error {
	_, err := r.db.Exec(
		"UPDATE courses SET name=$1, category=$2, price=$3, description=$4, platform=$5, link=$6, startDate=$7, time=$8 WHERE id=$9",
		course.Name, course.Category, course.Price, course.Description, course.Platform, course.Link, course.StartDate, course.Time, id,
	)
	return err
}

func (r *sqliteCourseRepository) DeleteCourse(id int) error {
	_, err := r.db.Exec("DELETE FROM courses WHERE id=$1", id)
	return err
}
func (r *sqliteCourseRepository) GetCoursesByCategory(category string) ([]domain.Course, error) {
	rows, err := r.db.Query(
		"SELECT id, name, category, price, description, platform, link, startDate, time FROM courses WHERE category = $1",
		category,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []domain.Course
	for rows.Next() {
		var course domain.Course
		if err := rows.Scan(
			&course.ID,
			&course.Name,
			&course.Category,
			&course.Price,
			&course.Description,
			&course.Platform,
			&course.Link,
			&course.StartDate,
			&course.Time,
		); err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}

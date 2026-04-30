package repository

import (
	"backend/domain"
	"database/sql"
)

type sqliteCourseRepository struct {
	db *sql.DB
}

func NewSQLiteCourseRepository(db *sql.DB) domain.CourseRepository {
	return &sqliteCourseRepository{db: db}
}

// ---------------- GET ALL ----------------
func (r *sqliteCourseRepository) GetAllCourses() ([]domain.Course, error) {
	rows, err := r.db.Query(`
		SELECT c.id, c.name, c.category_id, cat.name,
		       c.price, c.description, c.platform, c.link, c.start_date, c.time
		FROM courses c
		JOIN categories cat ON c.category_id = cat.id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []domain.Course
	for rows.Next() {
		var course domain.Course
		err := rows.Scan(
			&course.ID,
			&course.Name,
			&course.CategoryID,
			&course.CategoryName,
			&course.Price,
			&course.Description,
			&course.Platform,
			&course.Link,
			&course.StartDate,
			&course.Time,
		)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}

// ---------------- GET BY ID ----------------
func (r *sqliteCourseRepository) GetCourseByID(id int) (domain.Course, error) {
	var course domain.Course

	err := r.db.QueryRow(`
		SELECT c.id, c.name, c.category_id, cat.name,
		       c.price, c.description, c.platform, c.link, c.start_date, c.time
		FROM courses c
		JOIN categories cat ON c.category_id = cat.id
		WHERE c.id = $1
	`, id).Scan(
		&course.ID,
		&course.Name,
		&course.CategoryID,
		&course.CategoryName,
		&course.Price,
		&course.Description,
		&course.Platform,
		&course.Link,
		&course.StartDate,
		&course.Time,
	)

	if err != nil {
		return domain.Course{}, err
	}

	return course, nil
}

// ---------------- CREATE ----------------
func (r *sqliteCourseRepository) CreateCourse(course domain.Course) error {
	_, err := r.db.Exec(`
		INSERT INTO courses (name, category_id, price, description, platform, link, start_date, time)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
	`,
		course.Name,
		course.CategoryID,
		course.Price,
		course.Description,
		course.Platform,
		course.Link,
		course.StartDate,
		course.Time,
	)
	return err
}

// ---------------- UPDATE ----------------
func (r *sqliteCourseRepository) UpdateCourse(id int, course domain.Course) error {
	_, err := r.db.Exec(`
		UPDATE courses 
		SET name=$1, category_id=$2, price=$3, description=$4, platform=$5, link=$6, start_date=$7, time=$8
		WHERE id=$9
	`,
		course.Name,
		course.CategoryID,
		course.Price,
		course.Description,
		course.Platform,
		course.Link,
		course.StartDate,
		course.Time,
		id,
	)
	return err
}

// ---------------- DELETE ----------------
func (r *sqliteCourseRepository) DeleteCourse(id int) error {
	_, err := r.db.Exec("DELETE FROM courses WHERE id=$1", id)
	return err
}

// ---------------- GET BY CATEGORY ----------------
func (r *sqliteCourseRepository) GetCoursesByCategory(categoryID int) ([]domain.Course, error) {
	rows, err := r.db.Query(`
		SELECT c.id, c.name, c.category_id, cat.name,
		       c.price, c.description, c.platform, c.link, c.start_date, c.time
		FROM courses c
		JOIN categories cat ON c.category_id = cat.id
		WHERE c.category_id = $1
	`, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []domain.Course
	for rows.Next() {
		var course domain.Course
		err := rows.Scan(
			&course.ID,
			&course.Name,
			&course.CategoryID,
			&course.CategoryName,
			&course.Price,
			&course.Description,
			&course.Platform,
			&course.Link,
			&course.StartDate,
			&course.Time,
		)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}
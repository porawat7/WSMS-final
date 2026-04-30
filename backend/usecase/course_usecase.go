package usecase

import (
	"backend/repository"
	"database/sql"
)

type CourseUsecase interface {
	GetAllCourses() ([]map[string]interface{}, error)
	GetCoursesByCategory(categoryID int) ([]map[string]interface{}, error)
	GetUserStatusByAPIKey(apiKey string) (string, error)
}

type courseUsecase struct {
	repo repository.CourseRepository
	db   *sql.DB
}

func NewCourseUsecase(repo repository.CourseRepository, db *sql.DB) CourseUsecase {
	return &courseUsecase{
		repo: repo,
		db:   db,
	}
}

func (u *courseUsecase) GetAllCourses() ([]map[string]interface{}, error) {
	return u.repo.GetAllCourses()
}

func (u *courseUsecase) GetCoursesByCategory(categoryID int) ([]map[string]interface{}, error) {
	return u.repo.GetCoursesByCategory(categoryID)
}

func (u *courseUsecase) GetUserStatusByAPIKey(apiKey string) (string, error) {

	var status string

	err := u.db.QueryRow(`
		SELECT u.status
		FROM users u
		JOIN api_keys a ON a.user_id = u.id
		WHERE a.api_key = $1
	`, apiKey).Scan(&status)

	return status, err
}
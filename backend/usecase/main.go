package usecase

import (
	"backend/domain"
)

type courseUsecase struct {
	repo domain.CourseRepository
}

// NewCourseUsecase creates a new instance of courseUsecase.
func NewCourseUsecase(repo domain.CourseRepository) domain.CourseUsecase {
	return &courseUsecase{repo: repo}
}

func (u *courseUsecase) FetchAllCourses() ([]domain.Course, error) {
	return u.repo.GetAllCourses()
}

func (u *courseUsecase) FetchCourseDetails(id int) (domain.Course, error) {
	return u.repo.GetCourseByID(id)
}
func (u *courseUsecase) AddCourse(course domain.Course) error {
	return u.repo.CreateCourse(course)
}

func (u *courseUsecase) EditCourse(id int, course domain.Course) error {
	return u.repo.UpdateCourse(id, course)
}

func (u *courseUsecase) RemoveCourse(id int) error {
	return u.repo.DeleteCourse(id)
}
func (u *courseUsecase) FetchCoursesByCategory(category string) ([]domain.Course, error) {
	return u.repo.GetCoursesByCategory(category)
}

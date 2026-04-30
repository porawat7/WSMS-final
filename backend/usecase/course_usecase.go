package usecase

import "backend/domain"

type CourseRepository interface {
	GetAllCourses() ([]domain.Course, error)
	GetByCategoryID(categoryID int) ([]domain.Course, error)
}

type CourseUsecase struct {
	repo CourseRepository
}

func NewCourseUsecase(r CourseRepository) *CourseUsecase {
	return &CourseUsecase{repo: r}
}

func (u *CourseUsecase) GetAllCourses() ([]domain.Course, error) {
	return u.repo.GetAllCourses()
}

func (u *CourseUsecase) GetByCategoryID(id int) ([]domain.Course, error) {
	return u.repo.GetByCategoryID(id)
}
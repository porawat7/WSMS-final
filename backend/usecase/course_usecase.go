package usecase

import "backend/repository"

type CourseUsecase struct {
	repo *repository.CourseRepository
}

func NewCourseUsecase(r *repository.CourseRepository) *CourseUsecase {
	return &CourseUsecase{repo: r}
}

func (u *CourseUsecase) GetAllCourses() ([]map[string]interface{}, error) {
	return u.repo.GetAllCourses()
}
package usecase

import "backend/repository"

type CategoryRepository interface {
	GetAllCategories() ([]repository.Category, error)
}

type CategoryUsecase struct {
	repo CategoryRepository
}

func NewCategoryUsecase(r CategoryRepository) *CategoryUsecase {
	return &CategoryUsecase{repo: r}
}

func (u *CategoryUsecase) GetAllCategories() ([]repository.Category, error) {
	return u.repo.GetAllCategories()
}
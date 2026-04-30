package usecase

import "backend/repository"

type CategoryUsecase struct {
	repo repository.CategoryRepository
}

func NewCategoryUsecase(r repository.CategoryRepository) *CategoryUsecase {
	return &CategoryUsecase{repo: r}
}

func (u *CategoryUsecase) GetAllCategories() ([]map[string]interface{}, error) {
	return u.repo.GetAllCategories()
}
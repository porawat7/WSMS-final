package usecase

type APIKeyRepository interface {
	CreateAPIKey(userID int) (string, error)
	ValidateAPIKey(key string) (int, error)
}

type APIKeyUsecase struct {
	repo APIKeyRepository
}

func NewAPIKeyUsecase(r APIKeyRepository) *APIKeyUsecase {
	return &APIKeyUsecase{repo: r}
}

func (u *APIKeyUsecase) CreateAPIKey(userID int) (string, error) {
	return u.repo.CreateAPIKey(userID)
}

func (u *APIKeyUsecase) ValidateAPIKey(key string) (int, error) {
	return u.repo.ValidateAPIKey(key)
}
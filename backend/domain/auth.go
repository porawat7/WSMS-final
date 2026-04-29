package domain

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
	Role    string `json:"role"`
	Name    string `json:"name"`
}
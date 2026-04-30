package http

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

type AuthHandler struct {
	db *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID       int
	Name     string
	Email    string
	Status   string
	Password string
}

func generateAPIKey() string {
	return uuid.New().String()
}

// ================= LOGIN =================
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {

	var req LoginRequest
	json.NewDecoder(r.Body).Decode(&req)

	var user User

	err := h.db.QueryRow(`
		SELECT id, name, email, password, status
		FROM users
		WHERE email = $1
	`, req.Email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Status,
	)

	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if user.Password != req.Password {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// 🔥 ดึง api_key ถ้ามี
	var apiKey string
	err = h.db.QueryRow(`
		SELECT api_key FROM api_keys WHERE user_id = $1
	`, user.ID).Scan(&apiKey)

	// 🔥 ถ้าไม่มี → สร้างใหม่
	if err == sql.ErrNoRows {
		apiKey = generateAPIKey()

		_, err = h.db.Exec(`
			INSERT INTO api_keys (user_id, api_key)
			VALUES ($1, $2)
		`, user.ID, apiKey)

		if err != nil {
			http.Error(w, "Cannot create api key", http.StatusInternalServerError)
			return
		}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      user.ID,
		"name":    user.Name,
		"email":   user.Email,
		"status":  user.Status,
		"api_key": apiKey,
	})
}

// ================= REGISTER =================
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {

	var req RegisterRequest
	json.NewDecoder(r.Body).Decode(&req)

	var exists int
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE email=$1", req.Email).Scan(&exists)

	if exists > 0 {
		http.Error(w, "Email already exists", http.StatusBadRequest)
		return
	}

	var userID int
	err := h.db.QueryRow(`
		INSERT INTO users (name, email, password, status)
		VALUES ($1, $2, $3, 'basic')
		RETURNING id
	`, req.Name, req.Email, req.Password).Scan(&userID)

	if err != nil {
		http.Error(w, "Cannot create user", http.StatusInternalServerError)
		return
	}

	apiKey := generateAPIKey()

	_, err = h.db.Exec(`
		INSERT INTO api_keys (user_id, api_key)
		VALUES ($1, $2)
	`, userID, apiKey)

	if err != nil {
		http.Error(w, "Cannot create api key", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      userID,
		"name":    req.Name,
		"email":   req.Email,
		"status":  "basic",
		"api_key": apiKey,
	})
}
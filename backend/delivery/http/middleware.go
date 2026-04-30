package http

import (
	"context"
	"database/sql"
	"net/http"
	"sync"
	"time"

	"backend/usecase"

	"golang.org/x/time/rate"
)

type APIKeyMiddleware struct {
	usecase *usecase.APIKeyUsecase
}

func NewAPIKeyMiddleware(u *usecase.APIKeyUsecase) *APIKeyMiddleware {
	return &APIKeyMiddleware{usecase: u}
}

// ---------------- PLAN CONFIG ----------------

type RateConfig struct {
	RPS   rate.Limit
	Burst int
}

var quotaLimits = map[string]int{
	"basic":  1000,
	"silver": 5000,
	"gold":   10000,
}

var rateLimits = map[string]RateConfig{
	"basic": {
		RPS:   rate.Every(time.Minute / 15),
		Burst: 15,
	},
	"silver": {
		RPS:   rate.Every(time.Minute / 100),
		Burst: 100,
	},
	"gold": {
		RPS:   rate.Every(time.Minute / 1000),
		Burst: 1000,
	},
}

// ---------------- RATE LIMIT STORAGE ----------------

type visitor struct {
	limiter *rate.Limiter
}

var visitors = make(map[string]*visitor)
var mu sync.Mutex

func getLimiter(apiKey string, status string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	v, exists := visitors[apiKey]

	if !exists {
		cfg := rateLimits[status]
		limiter := rate.NewLimiter(cfg.RPS, cfg.Burst)

		visitors[apiKey] = &visitor{
			limiter: limiter,
		}
		return limiter
	}

	return v.limiter
}

// ---------------- API KEY ----------------

func (m *APIKeyMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// 🔥 FIX สำคัญ: ใช้ X-API-Key
		key := r.Header.Get("X-API-Key")

		// debug (ดูใน terminal)
		println("API KEY:", key)

		if key == "" {
			http.Error(w, "Missing API Key", http.StatusUnauthorized)
			return
		}

		userID, err := m.usecase.ValidateKey(key)
		if err != nil {
			http.Error(w, "Invalid API Key", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "userID", userID)
		ctx = context.WithValue(ctx, "apiKey", key)

		next(w, r.WithContext(ctx))
	}
}

// ---------------- RATE LIMIT ----------------

func RateLimitMiddleware(db *sql.DB) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {

			apiKey, ok := r.Context().Value("apiKey").(string)
			if !ok || apiKey == "" {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			var status string

			err := db.QueryRow(`
				SELECT u.status
				FROM users u
				JOIN api_keys a ON a.user_id = u.id
				WHERE a.api_key = $1
			`, apiKey).Scan(&status)

			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			limiter := getLimiter(apiKey, status)

			if !limiter.Allow() {
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}

			next(w, r)
		}
	}
}

// ---------------- QUOTA ----------------

func QuotaMiddleware(db *sql.DB) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {

			apiKey, ok := r.Context().Value("apiKey").(string)
			if !ok || apiKey == "" {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			var userID int
			var status string
			var numrequest int

			err := db.QueryRow(`
				SELECT u.id, u.status, COALESCE(u.numrequest,0)
				FROM users u
				JOIN api_keys a ON a.user_id = u.id
				WHERE a.api_key = $1
			`, apiKey).Scan(&userID, &status, &numrequest)

			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			limit := quotaLimits[status]

			if numrequest >= limit {
				http.Error(w, "Quota exceeded", http.StatusTooManyRequests)
				return
			}

			_, err = db.Exec(`
				UPDATE users
				SET numrequest = numrequest + 1
				WHERE id = $1
			`, userID)

			if err != nil {
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}

			next(w, r)
		}
	}
}

// ---------------- LOGGING ----------------

func LoggingMiddleware(db *sql.DB) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {

			apiKey, _ := r.Context().Value("apiKey").(string)

			next(w, r)

			_, _ = db.Exec(`
				INSERT INTO api_usage (
					api_key,
					endpoint,
					method,
					status_code,
					created_at
				)
				VALUES ($1, $2, $3, $4, $5)
			`,
				apiKey,
				r.URL.Path,
				r.Method,
				200,
				time.Now(),
			)
		}
	}
}

// ---------------- CHAIN ----------------

func Chain(
	h http.HandlerFunc,
	middlewares ...func(http.HandlerFunc) http.HandlerFunc,
) http.HandlerFunc {

	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}

	return h
}
package main

import (
	httpDelivery "backend/delivery/http"
	"backend/repository"
	"backend/usecase"
	"database/sql"
	"fmt"
	"log"
	nethttp "net/http"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "host=localhost port=5432 user=course_user password=123 dbname=course_db sslmode=disable"

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	fmt.Println("Connected to PostgreSQL successfully!")

	// ---------------- API KEY ----------------
	apiKeyRepo := repository.NewAPIKeyRepository(db)
	apiKeyUsecase := usecase.NewAPIKeyUsecase(apiKeyRepo)
	apiKeyMiddleware := httpDelivery.NewAPIKeyMiddleware(apiKeyUsecase)

	// ---------------- COURSE ----------------
	courseRepo := repository.NewCourseRepository(db)
	courseUsecase := usecase.NewCourseUsecase(courseRepo)
	courseHandler := httpDelivery.NewCourseHandler(courseUsecase)

	// ---------------- CATEGORY ----------------
	categoryRepo := repository.NewCategoryRepository(db)
	categoryUsecase := usecase.NewCategoryUsecase(categoryRepo)
	categoryHandler := httpDelivery.NewCategoryHandler(categoryUsecase)

	// ---------------- AUTH ----------------
	authHandler := httpDelivery.NewAuthHandler(db)

	// ---------------- USAGE ----------------
	usageHandler := httpDelivery.NewUsageHandler(db)

	// ---------------- LOGIN ----------------
	nethttp.HandleFunc(
		"/api/v1/login",
		httpDelivery.CORSMiddleware(authHandler.Login),
	)

	// ---------------- COURSES (GET ONLY) ----------------
	nethttp.HandleFunc(
		"/api/v1/courses",
		httpDelivery.CORSMiddleware(
			httpDelivery.Chain(
				courseHandler.GetAllCourses,
				apiKeyMiddleware.Handle,
				httpDelivery.LoggingMiddleware(db),
				httpDelivery.RateLimitMiddleware(db),
				httpDelivery.QuotaMiddleware(db),
			),
		),
	)

	// ---------------- CATEGORIES ----------------
	nethttp.HandleFunc(
		"/api/v1/categories",
		httpDelivery.CORSMiddleware(
			httpDelivery.Chain(
				categoryHandler.GetAllCategories,
				apiKeyMiddleware.Handle,
				httpDelivery.LoggingMiddleware(db),
				httpDelivery.RateLimitMiddleware(db),
				httpDelivery.QuotaMiddleware(db),
			),
		),
	)

	// ---------------- USAGE ----------------
	nethttp.HandleFunc(
		"/api/v1/usage",
		httpDelivery.CORSMiddleware(
			httpDelivery.Chain(
				usageHandler.GetUsage,
				apiKeyMiddleware.Handle,
				httpDelivery.LoggingMiddleware(db),
				httpDelivery.RateLimitMiddleware(db),
				httpDelivery.QuotaMiddleware(db),
			),
		),
	)

	fmt.Println("Server running on port 8081...")
	log.Fatal(nethttp.ListenAndServe(":8081", nil))
}
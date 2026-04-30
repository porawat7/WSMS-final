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

	err = db.Ping()
	if err != nil {
		log.Fatal("Database ping failed:", err)
	}

	fmt.Println("Connected to PostgreSQL successfully!")

	// ---------------- API KEY ----------------

	apiKeyRepo := repository.NewAPIKeyRepository(db)
	apiKeyUsecase := usecase.NewAPIKeyUsecase(apiKeyRepo)

	apiKeyMiddleware := httpDelivery.NewAPIKeyMiddleware(apiKeyUsecase)
	apiKeyHandler := httpDelivery.NewAPIKeyHandler(apiKeyUsecase)

	// ---------------- COURSE ----------------

	courseRepo := repository.NewCourseRepository(db)
	courseUsecase := usecase.NewCourseUsecase(courseRepo, db) // 🔥 แก้ตรงนี้
	courseHandler := httpDelivery.NewCourseHandler(courseUsecase)

	// ---------------- CATEGORY ----------------

	categoryRepo := repository.NewCategoryRepository(db)
	categoryUsecase := usecase.NewCategoryUsecase(categoryRepo)
	categoryHandler := httpDelivery.NewCategoryHandler(categoryUsecase)

	// ---------------- AUTH ----------------

	authHandler := httpDelivery.NewAuthHandler(db)

	// ---------------- USAGE ----------------

	usageHandler := httpDelivery.NewUsageHandler(db)

	// ---------------- USER ----------------

	userHandler := httpDelivery.NewUserHandler(db)

	// ---------------- REGISTER ----------------

	nethttp.HandleFunc(
		"/api/v1/register",
		httpDelivery.CORSMiddleware(authHandler.Register),
	)

	// ---------------- LOGIN ----------------

	nethttp.HandleFunc(
		"/api/v1/login",
		httpDelivery.CORSMiddleware(authHandler.Login),
	)

	// ---------------- API KEYS ----------------

	nethttp.HandleFunc(
		"/api/v1/api-keys",
		httpDelivery.CORSMiddleware(apiKeyHandler.CreateKey),
	)

	// ---------------- COURSES ----------------

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

	// ---------------- CATEGORY ----------------

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
			),
		),
	)

	// ---------------- UPGRADE PLAN ----------------

	nethttp.HandleFunc(
		"/api/v1/upgrade-plan",
		httpDelivery.CORSMiddleware(
			httpDelivery.Chain(
				userHandler.UpgradePlan,
				httpDelivery.LoggingMiddleware(db),
			),
		),
	)

	fmt.Println("Server running on port 8081...")
	log.Fatal(nethttp.ListenAndServe(":8081", nil))
}
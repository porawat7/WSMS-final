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

	// ---------------- API KEY SYSTEM ----------------

	apiKeyRepo := repository.NewAPIKeyRepository(db)
	apiKeyUsecase := usecase.NewAPIKeyUsecase(apiKeyRepo)
	apiKeyMiddleware := httpDelivery.NewAPIKeyMiddleware(apiKeyUsecase)
	apiKeyHandler := httpDelivery.NewAPIKeyHandler(apiKeyUsecase)

	// ---------------- COURSE ----------------

	courseRepo := repository.NewSQLiteCourseRepository(db)
	courseUsecase := usecase.NewCourseUsecase(courseRepo)

	// ✅ เปลี่ยนตรงนี้
	courseHandler := httpDelivery.NewCourseHandler(courseUsecase)

	// ---------------- AUTH ----------------

	authHandler := httpDelivery.NewAuthHandler(db)

	// ---------------- USAGE ----------------

	usageHandler := httpDelivery.NewUsageHandler(db)

	// ---------------- ROUTES ----------------

	// login
	nethttp.HandleFunc("/api/v1/login", authHandler.Login)

	// create API KEY
	nethttp.HandleFunc("/api/v1/api-keys", apiKeyHandler.CreateKey)

	// ---------------- COURSES ----------------

	nethttp.HandleFunc("/api/v1/courses",
		httpDelivery.Chain(
			func(w nethttp.ResponseWriter, r *nethttp.Request) {

				if r.Method == "GET" {
					courseHandler.GetAllCourses(w, r)

				} else if r.Method == "POST" {
					courseHandler.CreateCourse(w, r)

				} else {
					nethttp.Error(w, "Method not allowed", nethttp.StatusMethodNotAllowed)
				}
			},

			// middleware เรียงลำดับ
			httpDelivery.LoggingMiddleware(db),
			apiKeyMiddleware.Handle,
			httpDelivery.RateLimitMiddleware(db),
			httpDelivery.QuotaMiddleware(db),
		),
	)

	// ---------------- COURSE BY ID ----------------

	nethttp.HandleFunc("/api/v1/course",
		httpDelivery.Chain(
			func(w nethttp.ResponseWriter, r *nethttp.Request) {

				if r.Method == "GET" {
					courseHandler.GetCourseByID(w, r)

				} else if r.Method == "PUT" {
					courseHandler.UpdateCourse(w, r)

				} else if r.Method == "DELETE" {
					courseHandler.DeleteCourse(w, r)

				} else {
					nethttp.Error(w, "Method not allowed", nethttp.StatusMethodNotAllowed)
				}
			},

			httpDelivery.LoggingMiddleware(db),
			apiKeyMiddleware.Handle,
			httpDelivery.RateLimitMiddleware(db),
			httpDelivery.QuotaMiddleware(db),
		),
	)

	// ---------------- CATEGORY ----------------

	nethttp.HandleFunc("/api/v1/courses/category",
		httpDelivery.Chain(
			courseHandler.GetCoursesByCategory,

			httpDelivery.LoggingMiddleware(db),
			apiKeyMiddleware.Handle,
			httpDelivery.RateLimitMiddleware(db),
			httpDelivery.QuotaMiddleware(db),
		),
	)

	// ---------------- USAGE ----------------

	nethttp.HandleFunc("/api/v1/usage",
		httpDelivery.Chain(
			usageHandler.GetUsage,

			httpDelivery.LoggingMiddleware(db),
			apiKeyMiddleware.Handle,
			httpDelivery.RateLimitMiddleware(db),
			httpDelivery.QuotaMiddleware(db),
		),
	)

	fmt.Println("Server running on port 8080...")

	log.Fatal(nethttp.ListenAndServe(":8080", nil))
}
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

	// ---------------- COURSE ----------------

	courseRepo := repository.NewSQLiteCourseRepository(db)
	courseUsecase := usecase.NewCourseUsecase(courseRepo)
	courseHandler := httpDelivery.NewCourseHandler(courseUsecase)

	// ---------------- AUTH (🔥 แก้ตรงนี้) ----------------

	authHandler := httpDelivery.NewAuthHandler(db, apiKeyUsecase)

	// ---------------- USAGE ----------------

	usageHandler := httpDelivery.NewUsageHandler(db)

	// ---------------- LOGIN ----------------

	nethttp.HandleFunc(
		"/api/v1/login",
		httpDelivery.CORSMiddleware(authHandler.Login),
	)

	// ---------------- COURSES ----------------

	nethttp.HandleFunc(
		"/api/v1/courses",
		httpDelivery.CORSMiddleware(
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

				// 🔥 ลำดับต้องแบบนี้
				apiKeyMiddleware.Handle,
				httpDelivery.LoggingMiddleware(db),
				httpDelivery.RateLimitMiddleware(db),
				httpDelivery.QuotaMiddleware(db),
			),
		),
	)

	// ---------------- COURSE BY ID ----------------

	nethttp.HandleFunc(
		"/api/v1/course",
		httpDelivery.CORSMiddleware(
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

				apiKeyMiddleware.Handle,
				httpDelivery.LoggingMiddleware(db),
				httpDelivery.RateLimitMiddleware(db),
				httpDelivery.QuotaMiddleware(db),
			),
		),
	)

	// ---------------- CATEGORY ----------------

	nethttp.HandleFunc(
		"/api/v1/courses/category",
		httpDelivery.CORSMiddleware(
			httpDelivery.Chain(

				courseHandler.GetCoursesByCategory,

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
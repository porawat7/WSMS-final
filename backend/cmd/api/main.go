package main

import (
	"backend/delivery/http"
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

	courseRepo := repository.NewSQLiteCourseRepository(db)
	courseUsecase := usecase.NewCourseUsecase(courseRepo)
	courseHandler := http.NewCourseHandler(courseUsecase, db)
	authHandler := http.NewAuthHandler(db)

	nethttp.HandleFunc("/api/v1/login", authHandler.Login)

	nethttp.HandleFunc("/api/v1/courses", func(w nethttp.ResponseWriter, r *nethttp.Request) {
		if r.Method == "GET" {
			courseHandler.GetAllCourses(w, r)
		} else if r.Method == "POST" {
			courseHandler.CreateCourse(w, r)
		}
	})

	nethttp.HandleFunc("/api/v1/course", func(w nethttp.ResponseWriter, r *nethttp.Request) {
		if r.Method == "GET" {
			courseHandler.GetCourseByID(w, r)
		} else if r.Method == "PUT" {
			courseHandler.UpdateCourse(w, r)
		} else if r.Method == "DELETE" {
			courseHandler.DeleteCourse(w, r)
		}
	})

	nethttp.HandleFunc("/api/v1/courses/category", courseHandler.GetCoursesByCategory)

	fmt.Println("Server running on port 8080...")
	log.Fatal(nethttp.ListenAndServe(":8080", nil))
}

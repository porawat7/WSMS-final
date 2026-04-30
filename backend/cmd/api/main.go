package main

import (
	httpDelivery "backend/delivery/http"
	"backend/repository"
	"backend/usecase"
	"database/sql"
	"log"
	nethttp "net/http"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "host=localhost port=5432 user=course_user password=123 dbname=course_db sslmode=disable"

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// ---------- API KEY ----------
	apiKeyRepo := repository.NewAPIKeyRepository(db)
	apiKeyUsecase := usecase.NewAPIKeyUsecase(apiKeyRepo)
	apiKeyMiddleware := httpDelivery.NewAPIKeyMiddleware(apiKeyUsecase)

	// ---------- USER HANDLER ----------
	userHandler := httpDelivery.NewUserHandler(db)
	usageHandler := httpDelivery.NewUsageHandler(db)

    authHandler := httpDelivery.NewAuthHandler(db)

	nethttp.HandleFunc(
	"/api/v1/login",
	httpDelivery.CORSMiddleware(authHandler.Login),
)


nethttp.HandleFunc(
	"/api/v1/users/me",
	httpDelivery.CORSMiddleware(
		httpDelivery.Chain(
			userHandler.GetMe,
			apiKeyMiddleware.Handle, // ✅ ใช้ middleware ด้วย
		),
	),
)

nethttp.HandleFunc(
	"/api/v1/users/package",
	httpDelivery.CORSMiddleware(
		httpDelivery.Chain(
			userHandler.UpdateUserPackage,
			apiKeyMiddleware.Handle, // ✅ ใช้ middleware ด้วย
		),
	),
)

nethttp.HandleFunc(
    "/api/v1/usage",
    httpDelivery.CORSMiddleware(
        httpDelivery.Chain(
            usageHandler.GetUsage,
            apiKeyMiddleware.Handle,
        ),
    ),
)

	log.Println("Server running :8081")
	log.Fatal(nethttp.ListenAndServe(":8081", nil))
}
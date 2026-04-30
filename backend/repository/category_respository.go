package repository

import (
	"database/sql"
	"fmt"
)

type CategoryRepository interface {
	GetAllCategories() ([]map[string]interface{}, error)
}

type categoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) GetAllCategories() ([]map[string]interface{}, error) {
	rows, err := r.db.Query(`SELECT id, name FROM categories`)
	if err != nil {
		fmt.Println("QUERY ERROR:", err)
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}

	for rows.Next() {
		var id int
		var name string

		if err := rows.Scan(&id, &name); err != nil {
			return nil, err
		}

		results = append(results, map[string]interface{}{
			"id":   id,
			"name": name,
		})
	}

	return results, nil
}
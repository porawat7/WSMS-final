package domain

// Course represents the structure of a course in the system.
type Course struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Category    string `json:"category"`
	Price       int    `json:"price"`
	Description string `json:"description"`
	Platform    string `json:"platform"`
	Link        string `json:"link"`
	StartDate   string `json:"start_date"`
	Time        string `json:"time"`
}

// CourseRepository defines the interface for course data operations.
type CourseRepository interface {
	GetAllCourses() ([]Course, error)
	GetCourseByID(id int) (Course, error)
	CreateCourse(course Course) error
	UpdateCourse(id int, course Course) error
	DeleteCourse(id int) error
	GetCoursesByCategory(category string) ([]Course, error)
}

// CourseUsecase defines the interface for course business logic.
type CourseUsecase interface {
	FetchAllCourses() ([]Course, error)
	FetchCourseDetails(id int) (Course, error)
	FetchCoursesByCategory(category string) ([]Course, error)

	AddCourse(course Course) error
	EditCourse(id int, course Course) error
	RemoveCourse(id int) error
}

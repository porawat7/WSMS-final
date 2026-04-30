package domain

// Course represents the structure of a course in the system.
type Course struct {
	ID           int
	Name         string
	CategoryID   int
	CategoryName string
	Price        int
	Description  string
	Platform     string
	Link         string
	StartDate    string
	Time         string
}

// CourseRepository defines the interface for course data operations.
type CourseRepository interface {
	GetAllCourses() ([]Course, error)
	GetCourseByID(id int) (Course, error)
	CreateCourse(course Course) error
	UpdateCourse(id int, course Course) error
	DeleteCourse(id int) error
	GetCoursesByCategory(categoryID int) ([]Course, error) // ✅ แก้ตรงนี้
}

// CourseUsecase defines the interface for course business logic.
type CourseUsecase interface {
	FetchAllCourses() ([]Course, error)
	FetchCourseDetails(id int) (Course, error)
	FetchCoursesByCategory(categoryID int) ([]Course, error) // ✅ แก้ตรงนี้

	AddCourse(course Course) error
	EditCourse(id int, course Course) error
	RemoveCourse(id int) error
}
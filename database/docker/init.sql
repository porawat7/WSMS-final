CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  status VARCHAR(50),
  numrequest INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  api_key TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_usage (
  id SERIAL PRIMARY KEY,
  api_key TEXT,
  endpoint TEXT,
  method TEXT,
  status_code INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  category_id INT REFERENCES categories(id),
  price INT,
  description TEXT,
  platform VARCHAR(100),
  link TEXT,
  start_date DATE,
  time VARCHAR(50)
);

INSERT INTO categories (name) VALUES
('Coding'),
('Design'),
('Business');


INSERT INTO users (name, email, password,status) VALUES
('User One', 'user1@example.com', '123456', 'basic'),



-- Insert sample courses
INSERT INTO courses (name, category_id, price, description, platform, link, start_date, time) VALUES
('Fullstack JavaScript', 1, 3000, 'เรียน Node.js + React ครบ', 'Zoom', 'https://zoom.us/2', '2026-06-01', '18:00-21:00'),
('Python for Beginners', 1, 500, 'เรียนรู้ Python ตั้งแต่พื้นฐาน.', 'Udemy', 'https://udemy.com/python-for-beginners', '2026-05-01', '10:00-11:00'),
('Advanced JavaScript', 1, 700, 'เจาะลึก JavaScript.', 'Coursera', 'https://coursera.org/advanced-javascript', '2026-05-02', '14:00-15:00'),
('UI/UX Design Basics', 2, 400, 'แนะนำการออกแบบ UI/UX.', 'Skillshare', 'https://skillshare.com/uiux-basics', '2026-05-03', '09:00-10:00'),
('Digital Marketing 101', 3, 600, 'เรียนรู้พื้นฐานการตลาดดิจิทัล.', 'Udemy', 'https://udemy.com/digital-marketing-101', '2026-05-04', '11:00-12:00'),
('React for Beginners', 1, 550, 'เรียนรู้ React ทีละขั้นตอน.', 'Udemy', 'https://udemy.com/react-for-beginners', '2026-05-05', '13:00-14:00'),
('Graphic Design Masterclass', 2, 800, 'เรียนรู้เครื่องมือออกแบบกราฟิก.', 'Coursera', 'https://coursera.org/graphic-design-masterclass', '2026-05-06', '15:00-16:00'),
('Entrepreneurship Essentials', 3, 750, 'เริ่มต้นธุรกิจของคุณเอง.', 'Skillshare', 'https://skillshare.com/entrepreneurship-essentials', '2026-05-07', '10:00-11:00'),
('Data Science Bootcamp', 1, 1000, 'กลายเป็นนักวิทยาศาสตร์ข้อมูล.', 'Udemy', 'https://udemy.com/data-science-bootcamp', '2026-05-08', '16:00-17:00'),
('Illustrator for Beginners', 2, 450, 'เรียนรู้ Adobe Illustrator.', 'Skillshare', 'https://skillshare.com/illustrator-for-beginners', '2026-05-09', '11:00-12:00'),
('Financial Analysis', 3, 650, 'วิเคราะห์ข้อมูลทางการเงิน.', 'Coursera', 'https://coursera.org/financial-analysis', '2026-05-10', '14:00-15:00'),
('Machine Learning Basics', 1, 900, 'แนะนำการเรียนรู้ของเครื่อง.', 'Udemy', 'https://udemy.com/machine-learning-basics', '2026-05-11', '10:00-11:00'),
('Photoshop Essentials', 2, 500, 'เรียนรู้ Adobe Photoshop.', 'Skillshare', 'https://skillshare.com/photoshop-essentials', '2026-05-12', '13:00-14:00'),
('Leadership Skills', 3, 700, 'พัฒนาคุณสมบัติความเป็นผู้นำ.', 'Coursera', 'https://coursera.org/leadership-skills', '2026-05-13', '15:00-16:00'),
('Full-Stack Development', 1, 1200, 'กลายเป็นนักพัฒนา Full-Stack.', 'Udemy', 'https://udemy.com/full-stack-development', '2026-05-14', '09:00-10:00'),
('Typography Design', 2, 550, 'เรียนรู้การออกแบบตัวอักษร.', 'Skillshare', 'https://skillshare.com/typography-design', '2026-05-15', '11:00-12:00'),
('Project Management', 3, 800, 'จัดการโครงการอย่างมีประสิทธิภาพ.', 'Coursera', 'https://coursera.org/project-management', '2026-05-16', '14:00-15:00'),
('Angular for Beginners', 1, 600, 'เรียนรู้ Angular ทีละขั้นตอน.', 'Udemy', 'https://udemy.com/angular-for-beginners', '2026-05-17', '10:00-11:00'),
('3D Modeling Basics', 2, 700, 'แนะนำการสร้างโมเดล 3D.', 'Skillshare', 'https://skillshare.com/3d-modeling-basics', '2026-05-18', '13:00-14:00'),
('Startup Funding', 3, 900, 'หาทุนสำหรับสตาร์ทอัพ.', 'Coursera', 'https://coursera.org/startup-funding', '2026-05-19', '15:00-16:00'),
('Cloud Computing', 1, 950, 'เรียนรู้พื้นฐาน Cloud Computing.', 'Udemy', 'https://udemy.com/cloud-computing', '2026-05-20', '16:00-17:00');
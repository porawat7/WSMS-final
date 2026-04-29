-- สร้างตาราง users
CREATE TABLE users (
   id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  status VARCHAR(255),
  numrequest int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง admins
CREATE TABLE admins (
   id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE courses (
   id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  price INT,
  description TEXT,
  platform VARCHAR(100),
  link TEXT,
  startDate DATE,
  time VARCHAR(50)
);


-- เพิ่มข้อมูล courses
INSERT INTO courses (name, category, price, description, platform, link, startDate, time)
VALUES
('Fullstack JavaScript', 'Coding', 3000, 'เรียน Node.js + React ครบ', 'Zoom', 'https://zoom.us/2', '2026-06-01', '18:00-21:00'),
('Graphic Design Basics', 'Design', 1500, 'พื้นฐาน Photoshop และ Illustrator', 'Meet', 'https://meet.google.com/2', '2026-06-05', '19:00-21:00'),
('Digital Marketing', 'Business', 2800, 'การตลาดออนไลน์ครบทุกช่องทาง', 'Website', 'https://example.com/marketing', '2026-06-10', '20:00-22:00'),
('Python for Data Science', 'Coding', 3500, 'Python + วิเคราะห์ข้อมูล', 'Zoom', 'https://zoom.us/3', '2026-06-15', '18:00-21:00'),
('UI Design Masterclass', 'Design', 4000, 'ออกแบบ UI ระดับมืออาชีพ', 'Meet', 'https://meet.google.com/3', '2026-06-20', '19:00-22:00');

-- USERS
INSERT INTO users (name, email, password,status,numrequest) VALUES
('User One', 'user1@example.com', '123456', 'basic',0),
('User Two', 'user2@example.com', '123456', 'basic',0);

-- ADMINS
INSERT INTO admins (name, email, password) VALUES
('Admin One', 'admin1@example.com', '123456'),
('Admin Two', 'admin2@example.com', '123456');
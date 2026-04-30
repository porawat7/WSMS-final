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
('User One', 'user1@example.com', '123456', 'basic');



-- Insert sample courses
INSERT INTO courses (name, category_id, price, description, platform, link, start_date, time) VALUES
('Go Programming Bootcamp', 1, 1200, 'เรียนภาษา Go ตั้งแต่พื้นฐานจนใช้งานจริง', 'Udemy', 'https://www.udemy.com/course/go-programming-language/', '2026-05-21', '18:00-20:00'),
('React Advanced Patterns', 1, 850, 'เรียน React ขั้นสูง เช่น hooks และ performance', 'Udemy', 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', '2026-05-22', '19:00-21:00'),
('Figma UI Design Masterclass', 2, 600, 'ออกแบบ UI ด้วย Figma แบบมืออาชีพ', 'Skillshare', 'https://www.skillshare.com/en/classes/UI-UX-Design-with-Figma', '2026-05-23', '10:00-11:30'),
('UX Research Fundamentals', 2, 700, 'เรียนรู้การทำ UX Research จริง', 'Coursera', 'https://www.coursera.org/learn/user-experience-research', '2026-05-24', '13:00-15:00'),
('Startup Business Strategy', 3, 950, 'วางแผนธุรกิจ Startup อย่างมืออาชีพ', 'Coursera', 'https://www.coursera.org/specializations/wharton-entrepreneurship', '2026-05-25', '14:00-16:00'),
('Excel for Business Analysis', 3, 500, 'ใช้ Excel วิเคราะห์ข้อมูลธุรกิจ', 'Udemy', 'https://www.udemy.com/course/microsoft-excel-data-analysis/', '2026-05-26', '09:00-10:30'),
('Docker & Kubernetes Basics', 1, 1100, 'เรียน container และ deployment', 'Udemy', 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', '2026-05-27', '18:00-20:00'),
('Node.js API Development', 1, 750, 'สร้าง REST API ด้วย Node.js', 'Udemy', 'https://www.udemy.com/course/nodejs-the-complete-guide/', '2026-05-28', '17:00-19:00'),
('Adobe XD Design Course', 2, 550, 'ออกแบบ UI ด้วย Adobe XD', 'Skillshare', 'https://www.skillshare.com/en/classes/Adobe-XD-UI-UX-Design', '2026-05-29', '11:00-12:00'),
('SEO Marketing Basics', 3, 650, 'เรียน SEO เพิ่มยอดธุรกิจออนไลน์', 'Coursera', 'https://www.coursera.org/learn/seo-fundamentals', '2026-05-30', '15:00-16:30'),
('Python Data Analysis', 1, 900, 'ใช้ Python วิเคราะห์ข้อมูลจริง', 'Coursera', 'https://www.coursera.org/learn/python-data-analysis', '2026-05-31', '16:00-18:00'),
('Cybersecurity Basics', 1, 800, 'พื้นฐานความปลอดภัยไซเบอร์', 'edX', 'https://www.edx.org/course/introduction-to-cybersecurity', '2026-06-01', '10:00-12:00'),
('Branding Design Course', 2, 700, 'ออกแบบแบรนด์ให้โดดเด่น', 'Skillshare', 'https://www.skillshare.com/en/classes/Brand-Identity-Design', '2026-06-02', '13:00-14:30'),
('Financial Planning', 3, 750, 'วางแผนการเงินส่วนบุคคล', 'Coursera', 'https://www.coursera.org/learn/financial-planning', '2026-06-03', '09:00-11:00'),
('Vue.js for Beginners', 1, 650, 'เริ่มต้น Vue.js แบบเข้าใจง่าย', 'Udemy', 'https://www.udemy.com/course/vuejs-2-the-complete-guide/', '2026-06-04', '18:00-19:30'),
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
('Cloud Computing', 1, 950, 'เรียนรู้พื้นฐาน Cloud Computing.', 'Udemy', 'https://udemy.com/cloud-computing', '2026-05-20', '16:00-17:00'),
('Go Programming Bootcamp', 1, 1200, 'เรียนภาษา Go ตั้งแต่พื้นฐานจนใช้งานจริง', 'Udemy', 'https://www.udemy.com/course/go-programming-language/', '2026-05-21', '18:00-20:00'),
('React Advanced Patterns', 1, 850, 'เรียน React ขั้นสูง เช่น hooks และ performance', 'Udemy', 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', '2026-05-22', '19:00-21:00'),
('Figma UI Design Masterclass', 2, 600, 'ออกแบบ UI ด้วย Figma แบบมืออาชีพ', 'Skillshare', 'https://www.skillshare.com/en/classes/UI-UX-Design-with-Figma', '2026-05-23', '10:00-11:30'),
('UX Research Fundamentals', 2, 700, 'เรียนรู้การทำ UX Research จริง', 'Coursera', 'https://www.coursera.org/learn/user-experience-research', '2026-05-24', '13:00-15:00'),
('Startup Business Strategy', 3, 950, 'วางแผนธุรกิจ Startup อย่างมืออาชีพ', 'Coursera', 'https://www.coursera.org/specializations/wharton-entrepreneurship', '2026-05-25', '14:00-16:00'),
('Excel for Business Analysis', 3, 500, 'ใช้ Excel วิเคราะห์ข้อมูลธุรกิจ', 'Udemy', 'https://www.udemy.com/course/microsoft-excel-data-analysis/', '2026-05-26', '09:00-10:30'),
('Docker & Kubernetes Basics', 1, 1100, 'เรียน container และ deployment', 'Udemy', 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', '2026-05-27', '18:00-20:00'),
('Node.js API Development', 1, 750, 'สร้าง REST API ด้วย Node.js', 'Udemy', 'https://www.udemy.com/course/nodejs-the-complete-guide/', '2026-05-28', '17:00-19:00'),
('Adobe XD Design Course', 2, 550, 'ออกแบบ UI ด้วย Adobe XD', 'Skillshare', 'https://www.skillshare.com/en/classes/Adobe-XD-UI-UX-Design', '2026-05-29', '11:00-12:00'),
('SEO Marketing Basics', 3, 650, 'เรียน SEO เพิ่มยอดธุรกิจออนไลน์', 'Coursera', 'https://www.coursera.org/learn/seo-fundamentals', '2026-05-30', '15:00-16:30'),
('Python Data Analysis', 1, 900, 'ใช้ Python วิเคราะห์ข้อมูลจริง', 'Coursera', 'https://www.coursera.org/learn/python-data-analysis', '2026-05-31', '16:00-18:00'),
('Cybersecurity Basics', 1, 800, 'พื้นฐานความปลอดภัยไซเบอร์', 'edX', 'https://www.edx.org/course/introduction-to-cybersecurity', '2026-06-01', '10:00-12:00'),
('Branding Design Course', 2, 700, 'ออกแบบแบรนด์ให้โดดเด่น', 'Skillshare', 'https://www.skillshare.com/en/classes/Brand-Identity-Design', '2026-06-02', '13:00-14:30'),
('Financial Planning', 3, 750, 'วางแผนการเงินส่วนบุคคล', 'Coursera', 'https://www.coursera.org/learn/financial-planning', '2026-06-03', '09:00-11:00'),
('Vue.js for Beginners', 1, 650, 'เริ่มต้น Vue.js แบบเข้าใจง่าย', 'Udemy', 'https://www.udemy.com/course/vuejs-2-the-complete-guide/', '2026-06-04', '18:00-19:30');

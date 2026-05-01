import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={page}>
      
      {/* LEFT - HERO */}
      <div style={leftBox}>
        <h1 style={title}>
          Course API Service
        </h1>

        <p style={subtitle}>
          รวมข้อมูลคอร์สเรียนออนไลน์ในที่เดียว
        </p>

        <p style={desc}>
          สำหรับนักพัฒนาและผู้ใช้งานที่ต้องการเข้าถึงข้อมูลคอร์สได้อย่างรวดเร็ว 
          เชื่อมต่อข้อมูลคุณภาพสูงเพื่อสร้างแอปพลิเคชันของคุณ
        </p>

        <button
          onClick={() => navigate('/api-products')}
          style={startBtnStyle}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Get Started
        </button>
      </div>

      {/* RIGHT - JSON BOX */}
      <div style={rightBox}>
        <div style={jsonHeader}>
          // Example API Response
        </div>

        <pre style={jsonContent}>
{`{
  "status": "success",
  "data": {
    "course_id": "CS101",
    "name": "React for Beginners",
    "category": "Coding",
    "price": 390
  }
}`}
        </pre>
      </div>
    </div>
  );
};

/* ---------------- styles ---------------- */

const page = {
  padding: '80px 100px',
  backgroundColor: '#818d99',
  minHeight: '85vh',
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
};

const leftBox = {
  flex: 1,
  padding: '60px',
  borderRadius: '35px',
  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
  color: 'white',
  boxShadow: '0 25px 60px rgba(37,99,235,0.4)',
  minHeight: '320px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const title = {
  fontSize: '48px',
  fontWeight: 'bold',
  margin: 0,
};

const subtitle = {
  fontSize: '24px',
  margin: '25px 0 10px 0',
  opacity: 0.9,
};

const desc = {
  fontSize: '18px',
  marginBottom: '45px',
  lineHeight: '1.6',
  opacity: 0.85,
};

const startBtnStyle = {
  backgroundColor: 'white',
  color: '#2563eb',
  border: 'none',
  padding: '16px 65px',
  borderRadius: '50px',
  fontSize: '20px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  transition: '0.3s',
};

const rightBox = {
  flex: 1,
  backgroundColor: '#0f172a',
  padding: '60px',
  borderRadius: '35px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  fontFamily: 'monospace',
  color: '#38bdf8',
  minHeight: '320px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const jsonHeader = {
  color: '#94a3b8',
  marginBottom: '25px',
  fontSize: '14px',
  letterSpacing: '1px',
};

const jsonContent = {
  margin: 0,
  fontSize: '18px',
  lineHeight: '1.8',
};

export default Home;
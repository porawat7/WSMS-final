import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ 
      padding: '80px 100px', 
      backgroundColor: '#fff', 
      minHeight: '85vh',
      display: 'flex', 
      alignItems: 'center',
      gap: '40px',          // ระยะห่างที่พอดีระหว่างสองกล่อง
      justifyContent: 'center'
    }}>
      
      {/* ฝั่งซ้าย: กรอบข้อความ */}
      <div style={{ 
        flex: 1,            // เท่ากับฝั่งขวา
        padding: '60px',    // เท่ากับฝั่งขวา
        borderRadius: '35px', 
        backgroundColor: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        minHeight: '320px', // กำหนดความสูงตายตัวให้เท่ากันทั้งสองฝั่ง
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center' 
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1e293b', margin: 0, lineHeight: '1.1' }}>
          Course <span style={{ color: '#1e293b' }}>API</span> Service
        </h1>
        <p style={{ fontSize: '24px', margin: '25px 0 10px 0', color: '#475569', fontWeight: '500' }}>
          รวมข้อมูลคอร์สเรียนออนไลน์ในที่เดียว
        </p>
        <p style={{ fontSize: '18px', marginBottom: '45px', color: '#64748b', lineHeight: '1.6' }}>
          สำหรับนักพัฒนาและผู้ใช้งานที่ต้องการเข้าถึงข้อมูลคอร์สได้อย่างรวดเร็ว 
          เชื่อมต่อข้อมูลคุณภาพสูงเพื่อสร้างแอปพลิเคชันของคุณ
        </p>
        <div>
          <button onClick={() => navigate('/api-products')} style={startBtnStyle}>start</button>
        </div>
      </div>

      {/* ฝั่งขวา: กล่องโชว์ JSON */}
      <div style={{ 
        flex: 1,            // เท่ากับฝั่งซ้าย
        backgroundColor: '#0f172a', 
        padding: '60px',    // เท่ากับฝั่งซ้าย
        borderRadius: '35px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        fontFamily: 'monospace',
        color: '#38bdf8',
        minHeight: '320px', // เท่ากับฝั่งซ้าย
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '14px', letterSpacing: '1px' }}>
          // Example API Response
        </div>
        <pre style={{ margin: 0, fontSize: '18px', lineHeight: '1.8' }}>
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

const startBtnStyle = { 
  backgroundColor: '#0047AB', 
  color: 'white', 
  border: 'none', 
  padding: '16px 65px', 
  borderRadius: '50px', 
  fontSize: '20px', 
  fontWeight: 'bold', 
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0, 71, 171, 0.3)',
  transition: '0.3s'
};

export default Home;
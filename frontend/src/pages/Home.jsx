import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '80px 100px', backgroundColor: '#fff', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Course API Service</h1>
      <p style={{ fontSize: '24px', margin: '20px 0 0 0' }}>รวมข้อมูลคอร์สเรียนออนไลน์ในที่เดียว</p>
      <p style={{ fontSize: '24px', marginBottom: '40px' }}>สำหรับนักพัฒนาและผู้ใช้งานที่ต้องการเข้าถึงข้อมูลคอร์สได้อย่างรวดเร็ว</p>
      <button onClick={() => navigate('/api-products')} style={startBtnStyle}>start</button>
    </div>
  );
};

const startBtnStyle = { backgroundColor: '#0047AB', color: 'white', border: 'none', padding: '12px 50px', borderRadius: '50px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };

export default Home;
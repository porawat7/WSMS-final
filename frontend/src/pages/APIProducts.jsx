import React from 'react';
import { useNavigate } from 'react-router-dom';

const ApiProducts = () => {
  const navigate = useNavigate();

  const apiList = [
    {
      id: 'catalog',
      title: 'Course Catalog API',
      description: 'ดึงรายชื่อคอร์สเรียนทั้งหมดที่มีในระบบ พร้อมหมวดหมู่ ราคา',
      bestFor: 'แอปเปรียบเทียบคอร์สเรียน หรือหน้า Landing Page ของสถาบัน',
      endpoint: 'GET /api/v1/courses/all'
    },
    {
      id: 'search',
      title: 'Search by Category',
      description: 'ดึงรายชื่อคอร์สเรียนแยกตามประเภทที่ต้องการ พร้อมรายละเอียดแพลตฟอร์มการเรียน',
      bestFor: 'หน้าแสดงผลเฉพาะหมวดหมู่ที่สนใจ',
      endpoint: 'GET /api/v1/courses?category=Coding'
    },
    {
      id: 'names',
      title: 'Course Names List',
      description: 'ดึงเฉพาะรายชื่อวิชาทั้งหมดที่มีในระบบ',
      bestFor: 'ระบบค้นหาอัตโนมัติ (Autocomplete)',
      endpoint: 'GET /api/v1/courses/names'
    }
  ];

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '80px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '60px', textAlign: 'left' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
            รวม API สำหรับระบบคอร์สเรียน
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: '1.6', maxWidth: '850px' }}>
            Course API เป็นบริการที่รวบรวมข้อมูลคอร์สเรียนออนไลน์ และเปิดให้ผู้พัฒนาสามารถเข้าถึงข้อมูลผ่าน REST API 
            เพื่อใช้ในการพัฒนาเว็บไซต์หรือแอปพลิเคชันต่าง ๆ
          </p>
        </div>

        {/* API Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '30px',
        }}>
          {apiList.map((api) => (
            <div key={api.id} style={cardStyle}>
              {/* ส่วนเนื้อหาด้านบน */}
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '25px' }}>
                  {api.title}
                </h3>
                
                <p style={{ fontSize: '15px', color: '#475569', marginBottom: '20px', fontWeight: '600', lineHeight: '1.5' }}>
                  {api.description}
                </p>

                <p style={{ fontSize: '14px', color: '#1e293b', marginBottom: '20px' }}>
                  <strong style={{ color: '#64748b' }}>Best for :</strong> {api.bestFor}
                </p>

                <div style={endpointBoxStyle}>
                  <code style={{ fontSize: '13px', color: '#0047AB', fontWeight: 'bold' }}>
                    Endpoint : {api.endpoint}
                  </code>
                </div>
              </div>

              {/* ส่วนปุ่มด้านล่าง - จะถูกดันลงมาล่างสุดเสมอด้วย flexbox */}
              <div style={{ textAlign: 'right', marginTop: '30px' }}>
                <button 
                  onClick={() => navigate('/playground', { state: api })}
                  style={viewDetailBtnStyle}
                >
                  view detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const cardStyle = {
  backgroundColor: 'white',
  padding: '45px 40px',
  borderRadius: '35px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  border: '1px solid #f1f5f9',
  display: 'flex',           // ใช้ Flexbox เพื่อให้จัดการความสูงภายในได้
  flexDirection: 'column',   // แนวตั้ง
  justifyContent: 'space-between', // กระจายเนื้อหาให้ปุ่มอยู่ล่างสุด
  transition: 'transform 0.3s ease',
};

const endpointBoxStyle = {
  marginTop: '10px',
  padding: '12px 18px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  display: 'inline-block',
  width: '100%',
  boxSizing: 'border-box'
};

const viewDetailBtnStyle = {
  backgroundColor: '#0047AB',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background 0.2s',
  boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)',
};

export default ApiProducts;
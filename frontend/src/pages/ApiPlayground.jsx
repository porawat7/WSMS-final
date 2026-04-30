import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ApiPlayground = () => {
  const location = useLocation();
  const initialApi = location.state || { title: 'Course Catalog', endpoint: 'http://localhost:8080/courses' };

  const [response, setResponse] = useState(null);

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '50px', fontFamily: 'sans-serif' }}>
      
      {/* ส่วนหัว Playground (อิงตามรูป) */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px 20px 20px' }}>
        <p style={{ color: '#38bdf8', letterSpacing: '1px', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          INTERACTIVE TESTING
        </p>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
          API Playground
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', maxWidth: '800px' }}>
          ทดลองเรียก API คอร์สเรียนได้ที่หน้านี้ เลือก endpoint, แก้ request body แล้วดูผล response ได้ทันที หากเรียกไม่ได้ให้ตรวจสอบว่า backend ของคุณกำลังรันอยู่ที่ localhost:8080
        </p>
      </div>

      {/* Main Container สำหรับ Request และ Response */}
      <div style={{ 
        maxWidth: '1100px', 
        margin: '20px auto', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px', 
        padding: '0 20px' 
      }}>
        
        {/* ฝั่ง REQUEST (Card ซ้าย) */}
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>REQUEST</p>
          
          <div style={inputGroup}>
            <label style={labelStyle}>API Product</label>
            <select style={inputStyle} defaultValue={initialApi.id || 'catalog'}>
              <option value="catalog">Course Catalog</option>
              <option value="search">Search by Category</option>
              <option value="names">Course Names List</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Method</label>
            <input style={inputStyle} value="GET" readOnly />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Endpoint</label>
            <input 
                style={inputStyle} 
                defaultValue={initialApi.endpoint ? `http://localhost:8080${initialApi.endpoint.split(' ')[1] || '/courses'}` : 'http://localhost:8080/courses'} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Request Body</label>
            <textarea 
                style={{ ...inputStyle, height: '180px', resize: 'none' }} 
                placeholder=""
            ></textarea>
          </div>

          <button 
            style={runBtnStyle} 
            onClick={() => setResponse('Ready to test API')}
          >
            Run API
          </button>
          
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '15px', lineHeight: '1.4' }}>
            หมายเหตุ: จุดนี้ช่วยให้คุณลองเรียก API คอร์สเรียนได้ ถ้า backend ยังไม่รัน หรือไม่มี endpoint จะเห็น error ใน response
          </p>
        </div>

        {/* ฝั่ง RESPONSE (Card ขวา) */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={sectionTitleStyle}>RESPONSE</p>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Idle</span>
          </div>
          
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>
            ผลลัพธ์ที่ได้จากการเรียก API
          </p>

          <div style={darkResponseBox}>
            <pre style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>
              {response || 'Ready to test API'}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Styles อิงตามรูปภาพที่ Fern ส่งมา ---
const cardStyle = {
  backgroundColor: 'white',
  padding: '35px',
  borderRadius: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  display: 'flex',
  flexDirection: 'column'
};

const sectionTitleStyle = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#94a3b8',
  letterSpacing: '1px',
  marginBottom: '15px'
};

const inputGroup = {
  marginBottom: '18px'
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  color: '#475569',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box'
};

const runBtnStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#2563eb', // สีน้ำเงินตามรูป
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const darkResponseBox = {
  backgroundColor: '#0f172a', // พื้นหลังดำตามรูป
  borderRadius: '15px',
  padding: '25px',
  minHeight: '400px',
  flexGrow: 1,
  overflowY: 'auto'
};

export default ApiPlayground;
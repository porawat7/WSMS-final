import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 1. จำลองข้อมูล User (ในอนาคตจะดึงจาก Backend ของเพื่อน)
    const userData = { 
      email: email, 
      tier: 'basic', 
      api_key: 'bkk_course_662_live_key' 
    };

    // 2. บันทึกลง localStorage เพื่อให้ Navbar และ Dashboard เอาไปใช้ต่อ
    localStorage.setItem('user', JSON.stringify(userData));

    // 3. ใช้ window.location.href แทน navigate เพื่อให้หน้าเว็บรีเฟรช 
    // และ Navbar จะได้โหลดค่าจาก localStorage มาเปลี่ยนปุ่มเป็น Logout ทันที
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh', 
      backgroundColor: '#f8fafc' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#0047AB', marginBottom: '10px', fontWeight: 'bold' }}>Welcome Back</h2>
        <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>เข้าสู่ระบบเพื่อจัดการ Course API ของคุณ</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="example@silpakorn.edu" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#00CED1', // สีฟ้า Cyan ตามปุ่ม Navbar
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            Log-in
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          ยังไม่มีบัญชี? <span style={{ color: '#0047AB', cursor: 'pointer', fontWeight: 'bold' }}>สมัครสมาชิก</span>
        </p>
      </div>
    </div>
  );
};

// สไตล์ของช่องกรอกข้อมูล
const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  outline: 'none',
  fontSize: '16px',
  boxSizing: 'border-box'
};

export default Login;
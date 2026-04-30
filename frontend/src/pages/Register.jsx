import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // รับค่า pkg ที่ส่งมาจากหน้า Pricing
  const selectedPlan = location.state;

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = { name: name, email: email, status: 'none', numrequest: 0 };
    localStorage.setItem('user', JSON.stringify(userData));

    // ส่งค่า pkg ต่อไปหน้า Payment ทันที
    navigate('/payment', { state: selectedPlan });
    
    setTimeout(() => {
        const event = new Event('storage');
        window.dispatchEvent(event);
    }, 100);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ color: '#0047AB', marginBottom: '10px' }}>สมัครสมาชิก</h2>
        <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>
            กำลังดำเนินการสำหรับแพ็กเกจ: <strong>{selectedPlan?.name || 'Silver'}</strong>
        </p>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="ชื่อ-นามสกุล" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <input type="email" placeholder="อีเมล" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="รหัสผ่าน" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#00CED1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>ยืนยันการสมัครสมาชิก</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' };

export default Register;
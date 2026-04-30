import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // สร้าง state เพื่อเก็บข้อมูล user
  const [user, setUser] = useState(null);

  // ใช้ useEffect เพื่อเช็กข้อมูล user ทุกครั้งที่หน้าเว็บโหลดหรือมีการเปลี่ยนแปลง
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // ลบข้อมูล user ออกจากเครื่อง
    setUser(null); // เคลียร์ state
    navigate('/'); // กลับไปหน้าหลัก
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 60px', 
      backgroundColor: '#0047AB', 
      color: 'white',
      fontFamily: 'serif' 
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          course online
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" style={menuStyle}>หน้าหลัก</Link>
        <Link to="/api-products" style={menuStyle}>API Products</Link>
        <Link to="/pricing" style={menuStyle}>Package</Link>
        <Link to="/dashboard" style={menuStyle}>Dashboard</Link>
        
        {/* Logic สลับปุ่ม Log-in / Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>{user.email}</span>
            <button 
              onClick={handleLogout}
              style={{ ...btnStyle, backgroundColor: '#ff4d4d' }} // สีแดงสำหรับ Logout
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{ ...btnStyle, backgroundColor: '#00CED1' }} // สีฟ้าสำหรับ Log-in
          >
            Log-in
          </button>
        )}
      </div>
    </nav>
  );
};

const menuStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 'bold'
};

const btnStyle = {
  color: 'white', 
  border: 'none', 
  padding: '10px 30px', 
  borderRadius: '30px', 
  fontSize: '18px', 
  fontWeight: 'bold', 
  cursor: 'pointer'
};

export default Navbar;
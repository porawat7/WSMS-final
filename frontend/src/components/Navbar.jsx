import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const loggedInUser = localStorage.getItem('user');
      setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
    };

    // โหลดตอน mount
    loadUser();

    // 🔥 ฟัง event ข้าม tab
    window.addEventListener('storage', loadUser);

    // 🔥 ฟัง event ใน tab เดียวกัน
    window.addEventListener('userChanged', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userChanged', loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');

    // 🔥 update navbar
    window.dispatchEvent(new Event('userChanged'));

    setUser(null);
    navigate('/');
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
      
      {/* Logo */}
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          course online
        </Link>
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" style={menuStyle}>หน้าหลัก</Link>
        <Link to="/api-products" style={menuStyle}>API Products</Link>
        <Link to="/pricing" style={menuStyle}>Package</Link>
        <Link to="/dashboard" style={menuStyle}>Dashboard</Link>

        {/* 🔥 Auth Section */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              {user.email}
            </span>
            <button 
              onClick={handleLogout}
              style={{ ...btnStyle, backgroundColor: '#ff4d4d' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            
            {/* 🔥 Login */}
            <button 
              onClick={() => navigate('/login')}
              style={{ ...btnStyle, backgroundColor: '#00CED1' }}
            >
              Log-in
            </button>

            {/* 🔥 Register (เพิ่มตรงนี้) */}
            <button 
              onClick={() => navigate('/register')}
              style={{ ...btnStyle, backgroundColor: '#22c55e' }}
            >
              Register
            </button>

          </div>
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
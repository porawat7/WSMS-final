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

    // 🔥 ฟัง event ตอน login/logout (tab อื่น)
    window.addEventListener('storage', loadUser);

    // 🔥 ฟัง event custom (tab เดียวกัน)
    window.addEventListener('userChanged', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userChanged', loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');

    // 🔥 trigger update navbar
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
          <button 
            onClick={() => navigate('/login')}
            style={{ ...btnStyle, backgroundColor: '#00CED1' }}
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
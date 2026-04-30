import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        'http://localhost:8081/api/v1/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // ✅ FIX
      const userData = {
        email: data.email,
        name: data.name,
        status: data.status,     // 🔥 เพิ่ม
        api_key: data.api_key,   // 🔥 เพิ่ม
      };

      localStorage.setItem('user', JSON.stringify(userData));

      window.dispatchEvent(new Event('userChanged'));

      alert('Login success');

      navigate('/dashboard');

    } catch (error) {

      console.error(error);
      alert('Server error');
    }
  };

  return (

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#f8fafc',
    }}>

      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'center',
      }}>

        <h2 style={{
          color: '#0047AB',
          marginBottom: '10px',
          fontWeight: 'bold',
        }}>
          Welcome Back
        </h2>

        <p style={{
          color: '#64748b',
          marginBottom: '30px',
          fontSize: '14px',
        }}>
          เข้าสู่ระบบเพื่อจัดการ Course API ของคุณ
        </p>

        <form onSubmit={handleLogin}>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={btnStyle}>
            Log-in
          </button>

        </form>

      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#1e293b',
};

const btnStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#00CED1',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
};

export default Login;
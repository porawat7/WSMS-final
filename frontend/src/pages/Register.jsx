import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8081/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Register failed');
        return;
      }

      // 🔥 save user
      localStorage.setItem('user', JSON.stringify(data));

      window.dispatchEvent(new Event('userChanged'));

      alert('Register success');

      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#0047AB', marginBottom: '20px' }}>Register</h2>

        <form onSubmit={handleRegister}>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />

          <button type="submit" style={btnStyle}>Register</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0'
};

const btnStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#00CED1',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold'
};

export default Register;
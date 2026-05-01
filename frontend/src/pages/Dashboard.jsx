import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // 🔥 user state
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {
      email: '-',
      status: 'basic',
      name: 'User'
    }
  );

  const [usage, setUsage] = useState(0);
  const [limit, setLimit] = useState(1000);

  const displayStatus = user.status
    ? user.status.toUpperCase()
    : 'BASIC';

  // 🔥 listen user change
  useEffect(() => {
    const updateUser = () => {
      const u = JSON.parse(localStorage.getItem('user'));
      if (u) setUser(u);
    };

    window.addEventListener('userChanged', updateUser);
    return () => window.removeEventListener('userChanged', updateUser);
  }, []);

  // 🔥 fetch usage
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        if (!user?.api_key) return;

        const res = await fetch('http://localhost:8081/api/v1/usage', {
          headers: {
            'x-api-key': user.api_key
          }
        });

        const data = await res.json();

        setUsage(data.used || 0);
        setLimit(data.limit || 1000);

      } catch (err) {
        console.error('fetch usage error:', err);
      }
    };

    fetchUsage();
  }, [user]);

  // 🔥 คำนวณ
  const remaining = limit - usage;
  const percent = Math.min((usage / limit) * 100, 100);

  return (
    <div style={{ backgroundColor: '#c3c5ca', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', margin: '10px 0 5px 0', color: '#1e293b', fontWeight: 'bold' }}>
            Course API Dashboard
          </h1>
          <p style={{ color: '#0b0c0c', fontSize: '14px' }}>
            ยินดีต้อนรับคุณ {user.name} | ติดตามสถานะการใช้งานและจัดการแพ็กเกจของคุณ
          </p>
        </div>

        {/* Top Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard title="Current Plan" value={displayStatus} />
          <StatCard title="Requests Used" value={usage} />
          <StatCard title="Remaining Quota" value={remaining} />
          <StatCard title="Account Owner" value={user.name}  />
        </div>

        {/* Main */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '20px' }}>
        

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={whiteCardStyle}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
                Quick Actions
              </h3>

              <button
                onClick={() => navigate('/pricing')}
                style={primaryBtn}
              >
                Upgrade Package
              </button>

              <button
                onClick={() => navigate('/api-products')}
                style={secondaryBtn}
              >
                View API Catalog
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Components ---
const StatCard = ({ title, value, isEmail }) => (
  <div style={{
    background: 'white',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  }}>
    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
      {title}
    </p>
    <h2 style={{
      fontSize: isEmail ? '14px' : '28px',
      fontWeight: 'bold',
      marginTop: '10px'
    }}>
      {value}
    </h2>
  </div>
);

const SmallInfoBox = ({ label, value, color }) => (
  <div style={{
    background: '#f8fafc',
    padding: '15px',
    borderRadius: '12px'
  }}>
    <p style={{
      fontSize: '10px',
      color: '#94a3b8',
      fontWeight: 'bold'
    }}>
      {label.toUpperCase()}
    </p>
    <p style={{
      fontSize: '16px',
      fontWeight: 'bold',
      color: color || '#1e293b'
    }}>
      {value}
    </p>
  </div>
);

const whiteCardStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
};

const primaryBtn = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#0047AB',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '12px'
};

const secondaryBtn = {
  width: '100%',
  padding: '14px',
  backgroundColor: 'transparent',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  cursor: 'pointer'
};

export default Dashboard;
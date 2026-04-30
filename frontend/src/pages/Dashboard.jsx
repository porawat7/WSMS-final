import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || {
    email: '-',
    status: 'basic',
    name: 'User'
  };

  const apiKey = localStorage.getItem('apiKey') || '';

  const [usage, setUsage] = useState(0);
  const [limit, setLimit] = useState(1000);

  const displayStatus = user.status ? user.status.toUpperCase() : 'BASIC';

  // 🔥 fetch usage จาก backend
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/v1/usage', {
          headers: {
            'x-api-key': apiKey
          }
        });

        const data = await res.json();

        setUsage(data.used || 0);
        setLimit(data.limit || 1000);

      } catch (err) {
        console.error('Failed to fetch usage:', err);
      }
    };

    if (apiKey) fetchUsage();
  }, [apiKey]);

  const remaining = displayStatus === 'GOLD' ? 'Unlimited' : (limit - usage);
  const percent = displayStatus === 'GOLD' ? 100 : Math.min((usage / limit) * 100, 100);

  return (
    <div style={{ backgroundColor: '#f8faff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Overview</span>
          <h1 style={{ fontSize: '32px', margin: '10px 0 5px 0', color: '#1e293b', fontWeight: 'bold' }}>Course API Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            ยินดีต้อนรับคุณ {user.name} | ติดตามสถานะการใช้งานและจัดการแพ็กเกจของคุณ
          </p>
        </div>

        {/* Top Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <StatCard title="Current Plan" value={displayStatus} />
          <StatCard title="Requests Used" value={usage} />
          <StatCard title="Remaining Quota" value={remaining} />
          <StatCard title="Account Owner" value={user.email} isEmail />
        </div>

        {/* Main */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '20px' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={whiteCardStyle}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>API Usage Overview</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>โควตารายเดือนของคุณ</p>

              {/* Progress */}
              <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '10px', margin: '15px 0' }}>
                <div style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: '#0047AB',
                  borderRadius: '10px'
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <SmallInfoBox label="Used" value={usage} />
                <SmallInfoBox label="Limit" value={displayStatus === 'GOLD' ? '∞' : limit} />
                <SmallInfoBox label="Status" value="Active" color="#10b981" />
              </div>
            </div>

            <div style={whiteCardStyle}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Billing Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <SmallInfoBox label="Billing Cycle" value="Monthly" />
                <SmallInfoBox label="Next Update" value="30 May 2026" />
              </div>
            </div>

          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={whiteCardStyle}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Quick Actions</h3>
              <button onClick={() => navigate('/pricing')} style={primaryBtn}>
                Upgrade Package
              </button>
              <button onClick={() => navigate('/api-products')} style={secondaryBtn}>
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
  <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{title}</p>
    <h2 style={{ fontSize: isEmail ? '14px' : '28px', fontWeight: 'bold', marginTop: '10px' }}>{value}</h2>
  </div>
);

const SmallInfoBox = ({ label, value, color }) => (
  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
    <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>{label.toUpperCase()}</p>
    <p style={{ fontSize: '16px', fontWeight: 'bold', color: color || '#1e293b' }}>{value}</p>
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
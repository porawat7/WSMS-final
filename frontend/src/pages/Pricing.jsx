import React, { useState, useEffect } from 'react';

const Pricing = () => {

  const [currentStatus, setCurrentStatus] = useState('basic');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.status) setCurrentStatus(user.status.toLowerCase());

    const update = () => {
      const u = JSON.parse(localStorage.getItem('user'));
      if (u?.status) setCurrentStatus(u.status.toLowerCase());
    };

    window.addEventListener('userChanged', update);
    return () => window.removeEventListener('userChanged', update);
  }, []);

  const handleSelect = async (pkg) => {

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.api_key) {
      alert('กรุณา login ก่อน');
      return;
    }

    try {

      const res = await fetch('http://localhost:8081/api/v1/upgrade-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': user.api_key
        },
        body: JSON.stringify({
          status: pkg.id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'upgrade failed');
        return;
      }

      user.status = pkg.id;
      localStorage.setItem('user', JSON.stringify(user));

      setCurrentStatus(pkg.id);
      window.dispatchEvent(new Event('userChanged'));

    } catch (err) {
      console.error(err);
      alert('error');
    }
  };

  const packages = [
    { 
      id: 'basic', 
      name: 'Basic', 
      price: '0', 
      color: '#3b82f6', 
      glow: 'rgba(59,130,246,0.15)',
      isBasic: true,
      features: [
        '1000 Requests / เดือน', 
        'Rate limit 20 ครั้ง/นาที', 
        'ดูข้อมูลคอร์สพื้นฐาน (name, price, category)'
      ] 
    },
    { 
      id: 'silver', 
      name: 'Silver', 
      price: '49', 
      color: '#94a3b8', 
      glow: 'rgba(148,163,184,0.3)', 
      features: [
        '5,000 Requests / เดือน', 
        'Rate limit 100 ครั้ง/นาที',
        'ดูรายละเอียดคอร์ส + วันที่เริ่มเรียน',
        'Filter ตาม category ได้'
      ] 
    },
    { 
      id: 'gold', 
      name: 'Gold', 
      price: '99', 
      color: '#f59e0b', 
      glow: 'rgba(245,158,11,0.4)', 
      features: [
        '10,000 Requests', 
        'Rate limit 500 ครั้ง/นาที',
        'ดู platform + link คอร์ส',
        'Advanced Search'
      ] 
    }
  ];

  return (
    <div style={page}>
      <h2 style={title}>Subscription Packages</h2>

      <div style={cardRow}>
        {packages.map((pkg) => {
          const isActive = currentStatus === pkg.id;

          return (
            <div
              key={pkg.id}
              style={{
                ...card,
                border: isActive
                  ? `2px solid ${pkg.color}`
                  : pkg.isBasic
                  ? '1px dashed #fcfdfd'
                  : '1px solid #e2e8f0',

                background: pkg.isBasic
                  ? 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
                  : 'white',

                boxShadow: isActive
                  ? `0 20px 60px ${pkg.glow}`
                  : pkg.isBasic
                  ? '0 5px 15px rgba(255, 254, 254, 0.91)'
                  : '0 10px 30px rgba(255, 254, 254, 0.89)',

                transform: isActive ? 'scale(1.05)' : 'scale(1)'
              }}
            >

              <div style={{ flexGrow: 1 }}>

                {/* 🔥 FREE PLAN BADGE */}
                {pkg.isBasic && (
                  <div style={badge}>
                    FREE PLAN
                  </div>
                )}

                <h3 style={{
                  ...cardTitle,
                  color: pkg.isBasic ? '#b8bfc9' : pkg.color
                }}>
                  {pkg.name}
                </h3>

                <div style={priceBox}>
                  <span style={price}>฿{pkg.price}</span>
                  <span style={perMonth}> /เดือน</span>
                </div>

                <ul style={featureList}>
                  {pkg.features.map((f, i) => (
                    <li key={i} style={featureItem}>
                      <span style={{ marginRight: '10px', color: pkg.color }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelect(pkg)}
                disabled={isActive}
                style={{
                  ...btn,
                  background: isActive 
                    ? '#94a3b8' 
                    : `linear-gradient(135deg, ${pkg.color}, #1e293b)`,
                  cursor: isActive ? 'default' : 'pointer'
                }}
              >
                {isActive ? 'กำลังใช้งาน' : 'เลือกแพ็กเกจ'}
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- styles ---------------- */

const page = {
  padding: '80px 20px',
  textAlign: 'center',
  backgroundColor: '#737f8a',
  minHeight: '100vh',
  fontFamily: 'sans-serif'
};

const title = {
  fontSize: '42px',
  fontWeight: 'bold',
  color: '#fbfcff'
};

const cardRow = {
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  flexWrap: 'wrap',
  marginTop: '60px'
};

const card = {
  width: '320px',
  borderRadius: '30px',
  padding: '50px 40px',
  transition: '0.3s',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  height: '550px'
};

const badge = {
  textAlign: 'center',
  marginBottom: '10px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#64748b',
  letterSpacing: '1px'
};

const cardTitle = {
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center'
};

const priceBox = {
  textAlign: 'center',
  margin: '20px 0'
};

const price = {
  fontSize: '48px',
  fontWeight: 'bold'
};

const perMonth = {
  color: '#64748b'
};

const featureList = {
  listStyle: 'none',
  padding: 0,
  margin: '30px 0'
};

const featureItem = {
  marginBottom: '15px',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center'
};

const btn = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  color: 'white',
  fontWeight: 'bold'
};

export default Pricing;
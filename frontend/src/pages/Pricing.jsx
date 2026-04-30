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
    { id: 'basic', name: 'Basic', price: '0', color: '#0047AB', features: ['100 Requests / เดือน', 'เข้าถึง API ทั่วไป', 'Shared API Key'] },
    { id: 'silver', name: 'Silver', price: '49', color: '#94a3b8', features: ['5,000 Requests / เดือน', 'คอร์ส + โปรโมชั่น', 'Private API Key'] },
    { id: 'gold', name: 'Gold', price: '99', color: '#f59e0b', features: ['10,000 Requests', 'สถิติ VIP', 'Priority Support'] }
  ];

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b' }}>Subscription Packages</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '50px' }}>
        {packages.map((pkg) => {
          const isActive = currentStatus === pkg.id;

          return (
            <div key={pkg.id} style={{
              backgroundColor: 'white',
              width: '320px',
              borderRadius: '35px',
              padding: '50px 40px',
              border: isActive ? '3px solid #0047AB' : '1px solid #e2e8f0',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: '0.3s',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              height: '550px'
            }}>

              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: isActive ? '#0047AB' : pkg.color, fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }}>
                  {pkg.name}
                </h3>

                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <span style={{ fontSize: '48px', fontWeight: 'bold' }}>฿{pkg.price}</span>
                  <span> /เดือน</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0' }}>
                  {pkg.features.map((f, i) => (
                    <li key={i} style={{ marginBottom: '15px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '10px', color: '#0047AB' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelect(pkg)}
                disabled={isActive}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isActive ? '#bdc3c7' : '#1e293b',
                  color: 'white',
                  fontWeight: 'bold',
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

export default Pricing;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState('basic');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.status) {
      setCurrentStatus(user.status.toLowerCase());
    }
  }, []);

  const handleSelect = (pkg) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (pkg.id === 'basic') {
      const userData = user || { name: 'Guest', email: '-', status: 'basic', numrequest: 0 };
      userData.status = 'basic';
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentStatus('basic');
      window.location.reload();
      return;
    }

    // --- จุดที่แก้ไข: เช็กว่า Login หรือยัง ---
    if (user && user.email !== '-') {
      // ถ้า Login อยู่แล้ว (มีอีเมลที่ไม่ใช่ Guest) -> ไปหน้าจ่ายเงินเลย
      navigate('/payment', { state: pkg });
    } else {
      // ถ้ายังไม่ได้ Login -> ไปหน้าสมัครสมาชิกก่อน
      navigate('/register', { state: pkg });
    }
  };

  const packages = [
    { id: 'basic', name: 'Basic', price: '0', color: '#0047AB', features: ['100 Requests / เดือน', 'เข้าถึง API ทั่วไป', 'Shared API Key'] },
    { id: 'silver', name: 'Silver', price: '390', color: '#94a3b8', features: ['5,000 Requests / เดือน', 'คอร์ส + โปรโมชั่น', 'Private API Key'] },
    { id: 'gold', name: 'Gold', price: '990', color: '#f59e0b', features: ['Unlimited Requests', 'สถิติ VIP', 'Priority Support'] }
  ];

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b' }}>Subscription Packages</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '50px' }}>
        {packages.map((pkg) => {
          const isActive = currentStatus === pkg.id;
          return (
            <div key={pkg.id} style={{
              backgroundColor: 'white', width: '320px', borderRadius: '35px', padding: '50px 40px',
              border: isActive ? '3px solid #0047AB' : '1px solid #e2e8f0',
              transform: isActive ? 'scale(1.05)' : 'scale(1)', transition: '0.3s', textAlign: 'left',
              display: 'flex', flexDirection: 'column', height: '550px'
            }}>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ color: isActive ? '#0047AB' : pkg.color, fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }}>{pkg.name}</h3>
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <span style={{ fontSize: '48px', fontWeight: 'bold' }}>฿{pkg.price}</span><span> /เดือน</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0' }}>
                  {pkg.features.map((f, i) => <li key={i} style={{ marginBottom: '15px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#0047AB' }}>✓</span> {f}
                  </li>)}
                </ul>
              </div>
              <button onClick={() => handleSelect(pkg)} disabled={isActive}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: isActive ? '#bdc3c7' : '#1e293b', color: 'white', fontWeight: 'bold', cursor: isActive ? 'default' : 'pointer' }}>
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
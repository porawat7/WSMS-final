import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [method, setMethod] = useState('mobile');

  // ข้อมูลแพ็กเกจที่รับมาจากหน้าก่อนๆ
  const planName = state?.name || 'Silver';
  const price = state?.price || '390';
  const planId = state?.id || 'silver';

  const handleOpenModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleFinish = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      user.status = planId; // อัปเดตสถานะแพ็กเกจ
      localStorage.setItem('user', JSON.stringify(user));
    }
    navigate('/dashboard');
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* --- ส่วนหน้าจ่ายเงิน (รูปที่ 1) --- */}
      <div style={{ width: '100%', maxWidth: '500px', padding: '40px', backgroundColor: 'white', borderRadius: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' }}>{planName} Package</h2>

        <div style={{ textAlign: 'left', marginBottom: '25px' }}>
          <p style={{ fontWeight: 'bold', margin: '0' }}>Payment Method</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>เลือกวิธีชำระเงิน</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div onClick={() => setMethod('mobile')} style={methodStyle(method === 'mobile')}>
                <div style={radioStyle(method === 'mobile')}></div>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Mobile Banking</span>
            </div>
            <div onClick={() => setMethod('card')} style={methodStyle(method === 'card')}>
                <div style={radioStyle(method === 'card')}></div>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Credit Debit Card</span>
            </div>
            <div onClick={() => setMethod('qr')} style={methodStyle(method === 'qr')}>
                <div style={radioStyle(method === 'qr')}></div>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>QR Code</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '35px' }}>
          <p style={{ fontWeight: 'bold', margin: '0' }}>Billing Information</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>ช่องกรอกอีเมลสำหรับการส่ง API Key และใบเสร็จ</p>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #1e293b', boxSizing: 'border-box' }} 
          />
        </div>

        <button 
          onClick={handleOpenModal}
          style={{ width: '100%', padding: '18px', backgroundColor: '#0047AB', color: 'white', border: 'none', borderRadius: '40px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
        >
          ชำระเงิน {price} ฿
        </button>
      </div>

      {/* --- ส่วนป๊อปอัปสำเร็จ (รูปที่ 2) --- */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalCardStyle}>
             <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>{planName} Package</h2>
             
             {/* ไอคอนติ๊กถูกสีเขียว */}
             <div style={successCircleStyle}>
                <span style={{ color: 'white', fontSize: '60px' }}>✔</span>
             </div>

             <h2 style={{ margin: '20px 0 10px 0', fontWeight: 'bold' }}>ชำระเงินเรียบร้อย</h2>
             <p style={{ color: '#64748b', marginBottom: '30px' }}>
                ระบบได้รับการอัปเกรดโควต้า API ของคุณเป็น <strong>{planName}</strong> เรียบร้อยแล้ว
             </p>

             <button 
                onClick={handleFinish}
                style={modalBtnStyle}
             >
                เริ่มใช้งานเลย
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles สำหรับหน้า Payment ---
const methodStyle = (active) => ({
  padding: '15px 5px', borderRadius: '12px', border: active ? '2px solid #0047AB' : '1px solid #e2e8f0',
  textAlign: 'center', cursor: 'pointer', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
});

const radioStyle = (active) => ({
  width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #0047AB', backgroundColor: active ? '#0047AB' : 'transparent'
});

const overlayStyle = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
  backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalCardStyle = {
  width: '450px', padding: '40px', backgroundColor: 'white', borderRadius: '30px', 
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center'
};

const successCircleStyle = {
  width: '120px', height: '120px', backgroundColor: '#2ecc71', borderRadius: '50%', 
  display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto'
};

const modalBtnStyle = {
  width: '100%', padding: '14px', backgroundColor: '#0047AB', color: 'white', 
  border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
};

export default Payment;
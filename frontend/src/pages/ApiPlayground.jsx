import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = "http://localhost:8081";

const ApiPlayground = () => {
  const location = useLocation();

  const initialApi = location.state || {
    title: 'Course Catalog',
    endpoint: 'GET /api/v1/courses'
  };

  const [method, setMethod] = useState(initialApi.endpoint.split(' ')[0] || 'GET');
  const [endpoint, setEndpoint] = useState(initialApi.endpoint.split(' ')[1] || '/api/v1/courses');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('Ready to test API');
  const [status, setStatus] = useState('Idle');

  const runAPI = async () => {
    try {
      setStatus('Loading...');

      const fullUrl = endpoint.startsWith('http')
        ? endpoint
        : BASE_URL + endpoint;

      const apiKey = localStorage.getItem('apiKey');

      console.log("API KEY:", apiKey); // debug

      const res = await fetch(fullUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || ''
        },
        body: method !== 'GET' ? body : undefined
      });

      const text = await res.text();

      let formatted;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        formatted = text;
      }

      setResponse(formatted);
      setStatus(`Status: ${res.status}`);
    } catch (err) {
      setResponse(err.message);
      setStatus('Error');
    }
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '50px', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px 20px 20px' }}>
        <p style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 'bold' }}>
          INTERACTIVE TESTING
        </p>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e293b' }}>
          API Playground
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px' }}>
          ทดลองเรียก API ได้ที่นี่
        </p>
      </div>

      <div style={{ 
        maxWidth: '1100px',
        margin: '20px auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        padding: '0 20px'
      }}>

        {/* REQUEST */}
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>REQUEST</p>

          <div style={inputGroup}>
            <label style={labelStyle}>Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} style={inputStyle}>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Endpoint</label>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              style={inputStyle}
              placeholder="/api/v1/courses"
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Request Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ ...inputStyle, height: '150px' }}
              placeholder='{"title":"React Course"}'
            />
          </div>

          <button style={runBtnStyle} onClick={runAPI}>
            Run API
          </button>

          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
            * ต้องมี API Key ใน localStorage
          </p>
        </div>

        {/* RESPONSE */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={sectionTitleStyle}>RESPONSE</p>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{status}</span>
          </div>

          <div style={darkResponseBox}>
            <pre style={{ color: '#cbd5e1', margin: 0 }}>
              {response}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};

// styles
const cardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
};

const sectionTitleStyle = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#94a3b8',
  marginBottom: '15px'
};

const inputGroup = { marginBottom: '15px' };

const labelStyle = {
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '5px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0'
};

const runBtnStyle = {
  marginTop: '10px',
  padding: '12px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer'
};

const darkResponseBox = {
  backgroundColor: '#0f172a',
  borderRadius: '15px',
  padding: '20px',
  minHeight: '400px'
};

export default ApiPlayground;
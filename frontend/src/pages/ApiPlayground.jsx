import React, { useState } from 'react';

const BASE_URL = "http://localhost:8081";

const ApiPlayground = () => {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/v1/courses");
  const [query, setQuery] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [body, setBody] = useState("{\n  \n}");
  const [response, setResponse] = useState("Ready...");
  const [status, setStatus] = useState("Idle");

  const buildUrl = () => {
    const q = query.trim();
    if (!q) return BASE_URL + endpoint;
    return `${BASE_URL}${endpoint}?${q}`;
  };

  const runAPI = async () => {
    try {
      setStatus("Loading...");

      const res = await fetch(buildUrl(), {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: method !== "GET" ? body : undefined,
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
      setStatus("Error");
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>API Console</h1>

      {/* API KEY DISPLAY */}
      <div style={apiKeyBox}>
        <div>
          <strong>Current API Key:</strong>
          <div style={{ fontFamily: "monospace", marginTop: "4px" }}>
            {apiKey || "No API Key in localStorage"}
          </div>
        </div>

        {apiKey && (
          <button
            style={copyBtn}
            onClick={() => navigator.clipboard.writeText(apiKey)}
          >
            Copy
          </button>
        )}
      </div>

      <div style={gridStyle}>
        {/* REQUEST */}
        <div style={cardStyle}>
          <h3>Request</h3>

          <label>API Key</label>
          <input
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem("apiKey", e.target.value);
            }}
            style={inputStyle}
            placeholder="ใส่ API Key ตรงนี้"
          />

          <label>Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} style={inputStyle}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>

          <label>Endpoint</label>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            style={inputStyle}
            placeholder="/api/v1/courses"
          />

          <label>Query Params (key=value&key2=value2)</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={inputStyle}
            placeholder="category=programming"
          />

          {method !== "GET" && (
            <>
              <label>Request Body (JSON)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={textareaStyle}
              />
            </>
          )}

          <button style={runBtnStyle} onClick={runAPI}>
            ▶ Run Request
          </button>
        </div>

        {/* RESPONSE */}
        <div style={cardStyle}>
          <h3>Response</h3>
          <div style={statusStyle}>{status}</div>
          <pre style={responseBox}>{response}</pre>
        </div>
      </div>
    </div>
  );
};

/* ---------------- styles ---------------- */

const pageStyle = {
  fontFamily: "sans-serif",
  padding: "40px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const textareaStyle = {
  ...inputStyle,
  height: "140px",
  fontFamily: "monospace",
};

const runBtnStyle = {
  marginTop: "10px",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const responseBox = {
  background: "#0f172a",
  color: "#e2e8f0",
  padding: "15px",
  borderRadius: "10px",
  height: "420px",
  overflow: "auto",
};

const statusStyle = {
  marginBottom: "10px",
  fontSize: "12px",
  color: "#64748b",
};

const apiKeyBox = {
  background: "#e0f2fe",
  padding: "12px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const copyBtn = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  background: "#0284c7",
  color: "white",
  cursor: "pointer",
};

export default ApiPlayground;
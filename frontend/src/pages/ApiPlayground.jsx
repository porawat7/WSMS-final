import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:8081";

const ApiPlayground = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const endpointFromURL = params.get("endpoint");

  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("/api/v1/courses");
  const [method, setMethod] = useState("GET");
  const [query, setQuery] = useState("");
  const [body, setBody] = useState("{\n  \n}");
  const [response, setResponse] = useState("Ready...");
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    const key = localStorage.getItem("apiKey") || "";
    setApiKey(key);

    if (endpointFromURL) {
      setEndpoint(endpointFromURL);
    }
  }, [endpointFromURL]);

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
    <div style={page}>
      <h1 style={title}>API Playground</h1>

      <div style={grid}>
        {/* REQUEST */}
        <div style={card}>
          <h3>Request</h3>

          {/* ✅ ช่องกรอก API KEY */}
          <label>API Key</label>
          <input
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem("apiKey", e.target.value);
            }}
            placeholder="Paste API Key here"
            style={input}
          />

          <label>Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} style={input}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>

          <label>Endpoint</label>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            style={input}
          />


          {method !== "GET" && (
            <>
              <label>Body (JSON)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={textarea}
              />
            </>
          )}

          <button style={runBtn} onClick={runAPI}>
            ▶ Run Request
          </button>
        </div>

        {/* RESPONSE */}
        <div style={card}>
          <h3>Response</h3>
          <div style={statusText}>{status}</div>
          <pre style={responseBox}>{response}</pre>
        </div>
      </div>
    </div>
  );
};

/* ---------------- styles ---------------- */

const page = {
  fontFamily: "sans-serif",
  padding: "50px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const title = {
  fontSize: "32px",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const textarea = {
  ...input,
  height: "120px",
  fontFamily: "monospace",
};

const runBtn = {
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

const statusText = {
  marginBottom: "10px",
  fontSize: "12px",
  color: "#64748b",
};

export default ApiPlayground;
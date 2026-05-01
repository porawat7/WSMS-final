import React from "react";
import { useNavigate } from "react-router-dom";

const APIProducts = () => {
  const navigate = useNavigate();

  const goPlayground = (endpoint) => {
    navigate(`/api-playground?endpoint=${encodeURIComponent(endpoint)}`);
  };

  const apiList = [
    {
      title: "Course Catalog API",
      description: "ดึงข้อมูลคอร์สทั้งหมดในระบบ",
      endpoint: "/api/v1/courses",
      plan: "basic",
    },
    {
      title: "All Categories API",
      description: "ดึงประเภทคอร์สทั้งหมด",
      endpoint: "/api/v1/categories",
      plan: "basic",
    },
    {
      title: "Courses By Category",
      description: "Filter ตามหมวดหมู่ (Silver ขึ้นไป)",
      endpoint: "/api/v1/courses?category_id=1",
      plan: "silver",
    },
    {
      title: "Advanced Search + Filter",
      description: "ค้นหา + filter พร้อมกัน (Gold เท่านั้น)",
      endpoint: "/api/v1/courses?category_id=1&search=react",
      plan: "gold",
    },
  ];

  return (
    <div style={page}>
      <h1 style={title}> 📚 API Products</h1>

      <div style={cardRow}>
        {apiList.map((api, index) => (
          <div
            key={index}
            style={{
              ...card,
              ...(api.plan === "silver" && silverCard),
              ...(api.plan === "gold" && goldCard),
            }}
            className="card-hover"
          >
            {/* Glow layer */}
            <div
              style={{
                ...glow,
                ...(api.plan === "silver" && silverGlow),
                ...(api.plan === "gold" && goldGlow),
              }}
            />

            {/* Badge */}
            {api.plan !== "basic" && (
              <div
                style={{
                  ...badge,
                  ...(api.plan === "silver" && silverBadge),
                  ...(api.plan === "gold" && goldBadge),
                }}
              >
                {api.plan.toUpperCase()}
              </div>
            )}

            <h3 style={cardTitle}>{api.title}</h3>
            <p style={cardDesc}>{api.description}</p>

            <div style={bottomBox}>
              <code style={endpoint}>{api.endpoint}</code>

              <button
                style={{
                  ...btn,
                  ...(api.plan === "silver" && silverBtn),
                  ...(api.plan === "gold" && goldBtn),
                }}
                onClick={() => goPlayground(api.endpoint)}
              >
                View API →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- styles ---------------- */

const page = {
  fontFamily: "sans-serif",
  padding: "100px 40px",
  background: "linear-gradient(135deg, #7d7f85, #1e293b)",
  minHeight: "100vh",
  color: "white",
};

const title = {
  fontSize: "42px",
  marginBottom: "60px",
  textAlign: "center",
};

const cardRow = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const card = {
  position: "relative",
  width: "320px",
  padding: "30px",
  borderRadius: "20px",
  backdropFilter: "blur(10px)",
  background: "rgba(65, 62, 62, 0.97)",
  border: "1px solid rgba(151, 146, 146, 0.1)",
  transition: "all 0.3s ease",
  overflow: "hidden",
};

/* 🔥 hover effect */
card[':hover'] = {
  transform: "translateY(-10px) scale(1.03)",
};

/* 🌟 glow layer */
const glow = {
  position: "absolute",
  inset: 0,
  opacity: 0.3,
  filter: "blur(40px)",
  zIndex: 0,
};

const silverGlow = {
  background: "#94a3b8",
};

const goldGlow = {
  background: "#f59e0b",
};

/* 🩶 silver */
const silverCard = {
  border: "1px solid #94a3b8",
};

/* 🟨 gold (เด่นกว่า) */
const goldCard = {
  border: "1px solid #f59e0b",
  transform: "scale(1.08)",
};

/* 🏷 badge */
const badge = {
  position: "absolute",
  top: "15px",
  right: "15px",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "bold",
};

const silverBadge = {
  background: "#94a3b8",
  color: "#0f172a",
};

const goldBadge = {
  background: "#f59e0b",
  color: "#000",
};

const cardTitle = {
  fontSize: "22px",
  marginBottom: "15px",
  position: "relative",
  zIndex: 1,
};

const cardDesc = {
  color: "#e0e3ec",
  marginBottom: "25px",
  position: "relative",
  zIndex: 1,
};

const bottomBox = {
  position: "relative",
  zIndex: 1,
};

const endpoint = {
  display: "block",
  background: "#020617",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "12px",
  color: "#38bdf8",
};

const btn = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  background: "#2563eb",
  color: "white",
};

const silverBtn = {
  background: "#64748b",
};

const goldBtn = {
  background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
};

export default APIProducts;
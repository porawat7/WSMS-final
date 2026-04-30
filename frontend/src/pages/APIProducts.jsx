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
      description: "ดึงข้อมูลคอร์สทั้งหมดในระบบ พร้อมรายละเอียด ราคา และหมวดหมู่",
      endpoint: "/api/v1/courses",
    },
    {
      title: "All Categories API",
      description: "ดึงประเภทคอร์สทั้งหมดในระบบ เพื่อนำไปใช้จัดหมวดหมู่การแสดงผล",
      endpoint: "/api/v1/categories",
    },
    {
      title: "Courses By Category",
      description: "ดึงคอร์สตามประเภทที่ต้องการ ด้วย query category_id",
      endpoint: "/api/v1/courses?category_id=1",
    },
  ];

  return (
    <div style={page}>
      <h1 style={title}>API Products</h1>

      {/* การ์ดเรียงแนวนอน */}
      <div style={cardRow}>
        {apiList.map((api, index) => (
          <div key={index} style={card}>
            {/* บน: ชื่อ */}
            <h3 style={cardTitle}>{api.title}</h3>

            {/* กลาง: คำอธิบาย */}
            <p style={cardDesc}>{api.description}</p>

            {/* ล่าง: endpoint + ปุ่ม */}
            <div style={bottomBox}>
              <code style={endpoint}>{api.endpoint}</code>
              <button
                style={btn}
                onClick={() => goPlayground(api.endpoint)}
              >
                View in Playground
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
  padding: "80px 40px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const title = {
  fontSize: "36px",
  marginBottom: "40px",
};

const cardRow = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap",
};

const card = {
  flex: "1",
  minWidth: "320px",
  background: "white",
  padding: "30px",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardTitle = {
  fontSize: "22px",
  marginBottom: "15px",
};

const cardDesc = {
  color: "#475569",
  lineHeight: "1.6",
  marginBottom: "30px",
};

const bottomBox = {
  marginTop: "auto",
};

const endpoint = {
  display: "block",
  background: "#f1f5f9",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "13px",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default APIProducts;
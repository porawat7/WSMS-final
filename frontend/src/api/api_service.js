// src/api/api_service.js

const BASE_URL = "http://localhost:8081/api/v1";

// ---------------- LOGIN ----------------

export const login = async (email, password) => {

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await res.json();
};

// ---------------- CREATE API KEY ----------------

export const createApiKey = async (user_id, name) => {

  const res = await fetch(`${BASE_URL}/api-keys`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      user_id,
      name,
    }),
  });

  return await res.json();
};

// ---------------- GET COURSES ----------------

export const getCourses = async () => {

  const apiKey = localStorage.getItem("apiKey");

  const res = await fetch(`${BASE_URL}/courses`, {

    headers: {
      "x-api-key": apiKey,
    },
  });

  return await res.json();
};
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Intercept all fetch requests globally to append the Firebase ID Token
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = sessionStorage.getItem("firebase_id_token");
  if (token) {
    const newInit = { ...init };
    const headers = new Headers(newInit.headers || {});
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    newInit.headers = headers;
    return originalFetch(input, newInit);
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

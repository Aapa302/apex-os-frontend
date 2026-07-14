import React, { useState } from "react";

// Design Tokens matching App.jsx and ResearchLab.jsx
const T = {
  bg:       "#05050f",
  surf:     "#0b0b18",
  surf2:    "#0f0f1e",
  border:   "#161628",
  border2:  "#1e1e35",
  text1:    "#f0f2ff",
  text2:    "#8890b0",
  text3:    "#444868",
  accent:   "#5b5ef4",
  accent2:  "#7c5cf6",
  green:    "#22d3a5",
  red:      "#f04060",
  yellow:   "#f5a623",
  pink:     "#e040fb",
  cyan:     "#00d4ff",
  glass:    "rgba(11,11,24,0.85)",
};

export default function ExperimentManager() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div style={{
      background: T.bg,
      color: T.text1,
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
      boxSizing: "border-box",
      padding: "24px",
      position: "relative"
    }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: T.surf2,
          border: `1px solid ${T.accent}`,
          color: T.text1,
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: "600",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "slideIn 0.2s ease"
        }}>
          <span style={{ color: T.accent }}>🔔</span>
          {toastMessage}
        </div>
      )}

      {/* Header section with responsive layout */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px",
        borderBottom: `1px solid ${T.border}`,
        paddingBottom: "20px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "1.4rem" }}>🧪</span>
            <h1 style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: T.text1
            }}>
              Experiment Manager
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Initialize, monitor, and analyze custom wet-lab and computational simulations.
          </p>
        </div>

        {/* Create Experiment Button */}
        <button
          onClick={() => triggerToast("Create Experiment action triggered.")}
          style={{
            padding: "10px 18px",
            background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            boxShadow: `0 4px 14px ${T.accent}30`,
            transition: "transform 0.1s, opacity 0.15s",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          <span>➕</span>
          <span>Create Experiment</span>
        </button>
      </div>

      {/* Main Empty State Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0"
      }}>
        <div style={{
          background: T.surf,
          border: `1px solid ${T.border2}`,
          borderRadius: 16,
          padding: "40px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box"
        }}>
          {/* Visual Indicator Icon */}
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: `${T.accent}15`,
            border: `1px solid ${T.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            marginBottom: "20px"
          }}>
            🧪
          </div>

          <h3 style={{
            margin: "0 0 8px 0",
            fontSize: "1.05rem",
            fontWeight: 800,
            color: T.text1
          }}>
            No experiments created yet.
          </h3>

          <p style={{
            margin: "0 0 24px 0",
            fontSize: "0.8rem",
            color: T.text2,
            lineHeight: 1.5
          }}>
            To get started, create a new simulation run, select an algorithm pipeline, and connect raw sequence parameters.
          </p>

          {/* Placeholder Button "New Experiment" */}
          <button
            onClick={() => triggerToast("New Experiment placeholder triggered.")}
            style={{
              padding: "10px 20px",
              background: T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 8,
              color: T.accent,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.15s",
              width: "100%",
              maxWidth: "200px"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${T.accent}12`;
              e.currentTarget.style.borderColor = T.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = T.surf2;
              e.currentTarget.style.borderColor = T.border2;
            }}
          >
            New Experiment
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

import React from "react";

export default function Sidebar({
  algorithms,
  selectedId,
  onSelectAlgorithm,
  onCreateNewAlgorithm,
  onToggleFavorite,
  onDeleteAlgorithm,
  T
}) {
  return (
    <aside style={{
      width: "280px",
      background: T.surf,
      borderRight: `1px solid ${T.border}`,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      boxSizing: "border-box",
      flexShrink: 0
    }}>
      <button
        onClick={onCreateNewAlgorithm}
        style={{
          width: "100%",
          padding: "11px",
          background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
          border: "none",
          borderRadius: 8,
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.82rem",
          cursor: "pointer",
          transition: "transform 0.1s, opacity 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
        onMouseLeave={e => e.currentTarget.style.opacity = 1}
      >
        + Create New Draft
      </button>

      {/* Section: My Algorithms */}
      <div>
        <h4 style={{ fontSize: "0.74rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>
          My Algorithms ({algorithms.length})
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {algorithms.map(alg => (
            <div
              key={alg.id}
              onClick={() => onSelectAlgorithm(alg)}
              style={{
                background: selectedId === alg.id ? `${T.accent}15` : T.surf2,
                border: `1px solid ${selectedId === alg.id ? T.accent : T.border2}`,
                borderRadius: 8,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.15s"
              }}
            >
              <div style={{ minWidth: 0, flex: 1, marginRight: 8 }}>
                <div style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: selectedId === alg.id ? T.accent : T.text1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>{alg.name || "Untitled Draft"}</div>
                <div style={{ fontSize: "0.66rem", color: T.text3 }}>{alg.category}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={(e) => onToggleFavorite(alg.id, e)}
                  style={{ background: "none", border: "none", color: alg.favorite ? T.yellow : T.text3, cursor: "pointer", fontSize: "1rem", padding: 0 }}
                >
                  ★
                </button>
                {onDeleteAlgorithm && (
                  <button
                    onClick={(e) => onDeleteAlgorithm(alg.id, e)}
                    style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.9rem", padding: 0 }}
                    title="Delete Algorithm"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Recent */}
      <div>
        <h4 style={{ fontSize: "0.74rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>Recent</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {algorithms.filter(a => a.recent).map(alg => (
            <div
              key={alg.id}
              onClick={() => onSelectAlgorithm(alg)}
              style={{
                background: T.surf2,
                border: `1px solid ${selectedId === alg.id ? T.accent : T.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 500, color: T.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{alg.name || "Untitled Draft"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Favorites */}
      <div>
        <h4 style={{ fontSize: "0.74rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>Favorites</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {algorithms.filter(a => a.favorite).map(alg => (
            <div
              key={alg.id}
              onClick={() => onSelectAlgorithm(alg)}
              style={{
                background: T.surf2,
                border: `1px solid ${selectedId === alg.id ? T.accent : T.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: "0.78rem", color: T.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8, flex: 1 }}>{alg.name || "Untitled Draft"}</span>
              <span style={{ color: T.yellow, fontSize: "0.85rem" }}>★</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

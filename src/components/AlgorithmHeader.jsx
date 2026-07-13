import React from "react";

export default function AlgorithmHeader({ selectedId, T }) {
  return (
    <div style={{
      background: T.surf,
      border: `1px solid ${T.border2}`,
      borderRadius: 12,
      padding: "20px"
    }}>
      <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: T.text1 }}>
        {selectedId ? "Edit DNA Algorithm Design" : "New DNA Algorithm Design"}
      </h2>
      <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: T.text2 }}>
        Workspace for mapping dynamic alignment constraints, logic sequences, and optimization objectives.
      </p>
    </div>
  );
}

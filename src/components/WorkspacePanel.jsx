import React from "react";

export default function WorkspacePanel({
  algName,
  setAlgName,
  objective,
  setObjective,
  problemStatement,
  setProblemStatement,
  researchNotes,
  setResearchNotes,
  onSave,
  onCancel,
  T
}) {
  return (
    <div style={{
      background: T.surf,
      border: `1px solid ${T.border2}`,
      borderRadius: 12,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Algorithm Name *</label>
        <input
          type="text"
          value={algName}
          onChange={e => setAlgName(e.target.value)}
          placeholder="e.g. Nucleobase Sequence Aligner v2.1"
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Objective</label>
        <input
          type="text"
          value={objective}
          onChange={e => setObjective(e.target.value)}
          placeholder="e.g. Reduce sequence matching alignment latency to < 10ms"
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Problem Statement</label>
        <textarea
          rows={4}
          value={problemStatement}
          onChange={e => setProblemStatement(e.target.value)}
          placeholder="Describe the scientific/biological challenge this algorithm addresses..."
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Research Notes</label>
        <textarea
          rows={6}
          value={researchNotes}
          onChange={e => setResearchNotes(e.target.value)}
          placeholder="Enter literature citations, heuristic constraints, or molecular parameters..."
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <button
          onClick={onSave}
          style={{
            padding: "11px 24px",
            background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "opacity 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          Save Draft
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "11px 24px",
            background: T.surf2,
            border: `1px solid ${T.border2}`,
            borderRadius: 8,
            color: T.text2,
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#1e1e35";
            e.currentTarget.style.color = T.text1;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = T.surf2;
            e.currentTarget.style.color = T.text2;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

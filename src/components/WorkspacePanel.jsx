import React from "react";

export default function WorkspacePanel({
  algName,
  setAlgName,
  objective,
  setObjective,
  description,
  setDescription,
  binaryMapping,
  setBinaryMapping,
  dnaMapping,
  setDnaMapping,
  gcRules,
  setGcRules,
  homopolymerRules,
  setHomopolymerRules,
  errorDetection,
  setErrorDetection,
  errorCorrection,
  setErrorCorrection,
  version,
  setVersion,
  createdDate,
  setCreatedDate,
  problemStatement,
  setProblemStatement,
  researchNotes,
  setResearchNotes,
  onSave,
  onCancel,
  onValidate,
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
      {/* 2-column grid for basic info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Objective / Objective Statement</label>
          <input
            type="text"
            value={objective}
            onChange={e => setObjective(e.target.value)}
            placeholder="e.g. Reduce sequence matching alignment latency to < 10ms"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Detailed description of the algorithm and its parameters..."
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      {/* 2-column grid for mapping configs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Binary Mapping (Bits to Base)</label>
          <input
            type="text"
            value={binaryMapping}
            onChange={e => setBinaryMapping(e.target.value)}
            placeholder="e.g. 00=A, 01=C, 10=G, 11=T"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>DNA Mapping (Base to Bits)</label>
          <input
            type="text"
            value={dnaMapping}
            onChange={e => setDnaMapping(e.target.value)}
            placeholder="e.g. A=00, C=01, G=10, T=11"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* 2-column grid for rules */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>GC Content Rules (Min-Max range %)</label>
          <input
            type="text"
            value={gcRules}
            onChange={e => setGcRules(e.target.value)}
            placeholder="e.g. 40-60"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Homopolymer Rules (Max run length)</label>
          <input
            type="text"
            value={homopolymerRules}
            onChange={e => setHomopolymerRules(e.target.value)}
            placeholder="e.g. Max run length 3"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* 2-column grid for error detection/correction */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Error Detection</label>
          <input
            type="text"
            value={errorDetection}
            onChange={e => setErrorDetection(e.target.value)}
            placeholder="e.g. CRC-32 Checksum"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Error Correction</label>
          <input
            type="text"
            value={errorCorrection}
            onChange={e => setErrorCorrection(e.target.value)}
            placeholder="e.g. Reed-Solomon (255, 223)"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* 2-column grid for version & date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Version</label>
          <input
            type="text"
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder="e.g. v1.0.0"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Created Date</label>
          <input
            type="text"
            value={createdDate}
            onChange={e => setCreatedDate(e.target.value)}
            placeholder="e.g. 2026-07-24"
            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Problem Statement</label>
        <textarea
          rows={3}
          value={problemStatement}
          onChange={e => setProblemStatement(e.target.value)}
          placeholder="Describe the scientific/biological challenge this algorithm addresses..."
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      <div>
        <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Research Notes</label>
        <textarea
          rows={4}
          value={researchNotes}
          onChange={e => setResearchNotes(e.target.value)}
          placeholder="Enter literature citations, heuristic constraints, or molecular parameters..."
          style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
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
          onClick={onValidate}
          style={{
            padding: "11px 24px",
            background: `${T.cyan}20`,
            border: `1px solid ${T.cyan}`,
            borderRadius: 8,
            color: T.cyan,
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "opacity 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          Validate Algorithm
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

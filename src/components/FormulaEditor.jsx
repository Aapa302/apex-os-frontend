import React from "react";

export default function FormulaEditor({
  activeAlgorithm,
  selectedFormulaId,
  setSelectedFormulaId,
  formulaName,
  setFormulaName,
  formulaExpression,
  setFormulaExpression,
  formulaDescription,
  setFormulaDescription,
  formulaVariables,
  setFormulaVariables,
  formulaUnits,
  setFormulaUnits,
  onNewFormula,
  onSaveFormula,
  onDuplicateFormula,
  onDeleteFormula,
  onLoadFormula,
  onClearFormulaFields,
  T
}) {
  const activeFormulas = activeAlgorithm?.formulas || [];

  return (
    <main style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", boxSizing: "border-box" }}>
      {/* Grid stacking style override */}
      <style>{`
        @media (max-width: 900px) {
          .formula-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="formula-grid-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", width: "100%", gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: T.text1 }}>🧬 Mathematical Formula Editor</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem", color: T.text2 }}>Design analytical modeling expressions.</p>
              </div>
              {activeAlgorithm && (
                <select
                  value={selectedFormulaId}
                  onChange={e => {
                    const f = activeFormulas.find(fo => fo.id === e.target.value);
                    if (f) onLoadFormula(f);
                    else onClearFormulaFields();
                  }}
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, padding: "6px 12px", color: T.text1, fontSize: "0.78rem", outline: "none", cursor: "pointer" }}
                >
                  <option value="">-- Select Formula --</option>
                  {activeFormulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              )}
            </div>
          </div>

          <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 12, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", borderBottom: `1px solid ${T.border2}`, paddingBottom: "14px" }}>
              <button onClick={onNewFormula} style={{ padding: "7px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.cyan, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}>+ New Formula</button>
              <button onClick={onSaveFormula} style={{ padding: "7px 12px", background: `${T.green}18`, border: `1px solid ${T.green}40`, borderRadius: 6, color: T.green, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}>✓ Save Formula</button>
              <button onClick={onDuplicateFormula} style={{ padding: "7px 12px", background: `${T.accent}18`, border: `1px solid ${T.accent}40`, borderRadius: 6, color: T.text1, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}>📋 Duplicate</button>
              <button onClick={onDeleteFormula} style={{ padding: "7px 12px", background: `${T.red}18`, border: `1px solid ${T.red}40`, borderRadius: 6, color: T.red, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer", marginLeft: "auto" }}>🗑 Delete</button>
            </div>

            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Formula Name *</label>
              <input type="text" value={formulaName} onChange={e => setFormulaName(e.target.value)} placeholder="e.g. Affinity Score" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none" }} />
            </div>

            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Mathematical Expression *</label>
              <input type="text" value={formulaExpression} onChange={e => setFormulaExpression(e.target.value)} placeholder="e.g. S = Matches / Length" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.cyan, fontSize: "0.95rem", fontFamily: "monospace", outline: "none" }} />
            </div>

            <div>
              <label style={{ color: T.text3, fontSize: "0.68rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Formula Expression Live Preview</label>
              <div style={{ background: "#02020a", border: `1px solid ${T.border2}`, borderRadius: 8, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "56px", fontFamily: "monospace", fontSize: "1.1rem", color: formulaExpression ? T.cyan : T.text3, boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)" }}>
                {formulaExpression || "Awaiting mathematical expression input..."}
              </div>
            </div>

            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Description</label>
              <textarea rows={2} value={formulaDescription} onChange={e => setFormulaDescription(e.target.value)} placeholder="Description of biological mechanism..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none", resize: "none", fontFamily: "inherit" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Variables</label>
                <textarea rows={3} value={formulaVariables} onChange={e => setFormulaVariables(e.target.value)} placeholder="M = match count..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none", resize: "vertical", fontFamily: "monospace" }} />
              </div>
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Units</label>
                <input type="text" value={formulaUnits} onChange={e => setFormulaUnits(e.target.value)} placeholder="e.g. score ratio" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

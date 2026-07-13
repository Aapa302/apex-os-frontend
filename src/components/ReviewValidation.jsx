import React from "react";

export default function ReviewValidation({
  algName,
  objective,
  activeFormulas,
  blocks,
  researchNotes,
  problemStatement,
  reviewNotes,
  setReviewNotes,
  reviewRecommendation,
  setReviewRecommendation,
  approvalStatus,
  setApprovalStatus,
  selectedId,
  onSaveReview,
  onShowToast,
  reviewMeta,
  T
}) {
  const isAlgNamePresent = !!algName.trim();
  const isObjectiveCompleted = !!objective.trim();
  const isFormulaAdded = activeFormulas.length > 0;
  const isPipelineCreated = blocks.length > 0;
  const isFlowchartAvailable = true; // placeholder blocks always active
  const isDocumentationComplete = !!researchNotes.trim() && !!problemStatement.trim();

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      boxSizing: "border-box",
      overflowY: "auto"
    }}>
      {/* Header card */}
      <div style={{
        background: T.surf,
        border: `1px solid ${T.border2}`,
        borderRadius: 12,
        padding: "20px",
        marginBottom: "20px"
      }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: T.text1 }}>
          🔍 Review & Validation Workspace
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: T.text2 }}>
          Evaluate, audit, and export the current sequence alignment model configurations.
        </p>
      </div>

      {/* Grid content split: 1fr 1fr */}
      <div className="review-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        alignItems: "start"
      }}>
        {/* Style override for layout wrapping */}
        <style>{`
          @media (max-width: 900px) {
            .review-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* COLUMN 1: CHECKLIST & QUALITY METRICS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Validation Checklist Card */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: 12,
            padding: "24px"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "0.9rem", fontWeight: 800, color: T.text1, display: "flex", alignItems: "center", gap: 8 }}>
              📋 Validation Checklist
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Algorithm Name Present", checked: isAlgNamePresent },
                { label: "Objective Completed", checked: isObjectiveCompleted },
                { label: "Formula Added", checked: isFormulaAdded },
                { label: "Pipeline Created", checked: isPipelineCreated },
                { label: "Flowchart Available", checked: isFlowchartAvailable },
                { label: "Documentation Complete", checked: isDocumentationComplete }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: T.surf2,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${T.border}`
                  }}
                >
                  <span style={{ fontSize: "0.82rem", color: T.text1, fontWeight: 500 }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: "0.84rem",
                    fontWeight: 800,
                    color: item.checked ? T.green : T.red,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    {item.checked ? "✓ Complete" : "✗ Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Metrics Card */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: 12,
            padding: "24px"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "0.9rem", fontWeight: 800, color: T.text1 }}>
              📊 Quality Metrics
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {/* Completeness */}
              <div style={{ background: T.surf2, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "0.66rem", color: T.text3, textTransform: "uppercase" }}>Completeness</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: T.cyan, marginTop: 4 }}>
                  {reviewMeta.completeness}%
                </div>
                <div style={{ marginTop: 6, height: "4px", background: T.border2, borderRadius: "2px" }}>
                  <div style={{ width: `${reviewMeta.completeness}%`, height: "100%", background: T.cyan, borderRadius: "2px" }} />
                </div>
              </div>

              {/* Readability */}
              <div style={{ background: T.surf2, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "0.66rem", color: T.text3, textTransform: "uppercase" }}>Readability</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: T.green, marginTop: 4 }}>
                  {reviewMeta.readability}
                </div>
                <div style={{ fontSize: "0.6rem", color: T.text3, marginTop: 4 }}>Syntactic Structure Normal</div>
              </div>

              {/* Innovation Score */}
              <div style={{ background: T.surf2, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "0.66rem", color: T.text3, textTransform: "uppercase" }}>Innovation Score</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: T.pink, marginTop: 4 }}>
                  {reviewMeta.innovationScore}/100
                </div>
                <div style={{ fontSize: "0.6rem", color: T.text3, marginTop: 4 }}>Novel heuristic alignments</div>
              </div>

              {/* Validation Status */}
              <div style={{ background: T.surf2, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "0.66rem", color: T.text3, textTransform: "uppercase" }}>Validation Status</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: reviewMeta.validationStatus === "Verified" ? T.green : T.yellow, marginTop: 6 }}>
                  ● {reviewMeta.validationStatus}
                </div>
                <div style={{ fontSize: "0.6rem", color: T.text3, marginTop: 4 }}>System telemetry signature ok</div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: REVIEWER NOTES & EXPORTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Reviewer Notes Card */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: 12,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <h3 style={{ margin: "0", fontSize: "0.9rem", fontWeight: 800, color: T.text1 }}>
              ✍️ Reviewer Notes & Recommendations
            </h3>

            {/* Notes panel */}
            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Notes Panel</label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter literature annotations or peer audit notes here..."
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            {/* Recommendation panel */}
            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Recommendation Panel</label>
              <textarea
                rows={3}
                value={reviewRecommendation}
                onChange={(e) => setReviewRecommendation(e.target.value)}
                placeholder="Enter operational suggestions or next alignment action items..."
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            {/* Approval Status and save */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" }}>
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Approval Status</label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none", cursor: "pointer" }}
                >
                  <option value="Approved">Approved</option>
                  <option value="Needs Work">Needs Work</option>
                </select>
              </div>

              {/* Mockup save review status */}
              <button
                type="button"
                onClick={onSaveReview}
                style={{
                  width: "100%",
                  padding: "11px",
                  marginTop: "20px",
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                ✓ Save Notes
              </button>
            </div>
          </div>

          {/* Export Section Card */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: 12,
            padding: "24px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800, color: T.text1 }}>
              📦 Export Section
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.76rem", color: T.text2 }}>
              Compile and download the complete sequence configuration model.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => onShowToast("Exporting PDF report... (MOCKUP ONLY)", "info")}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  color: T.text1,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer"
                }}
              >
                Export PDF
              </button>
              <button
                onClick={() => onShowToast("Exporting JSON configuration model... (MOCKUP ONLY)", "info")}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  color: T.cyan,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer"
                }}
              >
                Export JSON
              </button>
              <button
                onClick={() => onShowToast("Exporting Markdown documentation... (MOCKUP ONLY)", "info")}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  color: T.yellow,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer"
                }}
              >
                Export Markdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

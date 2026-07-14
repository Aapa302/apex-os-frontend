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

const MOCK_EXPERIMENTS = [
  {
    id: "exp_1",
    name: "CRISPR off-target frequency simulation",
    researchArea: "Gene Editing",
    objective: "Map the off-target frequency of guide-RNA bindings under affine gap models.",
    description: "This experiment tests mismatch tolerance values across standard FASTA sequence reads to identify PAM guide alignment coordinates.",
    assignedAlgorithm: "CRISPR PAM Searcher v2.0",
    status: "Completed",
    createdDate: "2026-07-10 14:30",
    lastUpdated: "2026-07-12 09:15"
  },
  {
    id: "exp_2",
    name: "High-throughput Smith-Waterman optimization",
    researchArea: "DNA Sequencing",
    objective: "Optimize local tracebacks for extremely large FASTA structures.",
    description: "Iterating dynamic programming matches over low-quality reads (Phred < Q30) to evaluate gap penalties.",
    assignedAlgorithm: "Base Aligner v1.1.0",
    status: "In Progress",
    createdDate: "2026-07-13 08:00",
    lastUpdated: "2026-07-14 11:45"
  },
  {
    id: "exp_3",
    name: "Enzymatic torsional shear stress validation",
    researchArea: "Structural Biology",
    objective: "Measure spatial force vector tolerances of double-stranded DNA under high-friction enzyme dynamics.",
    description: "Modeling Outer Helix cylinder mechanical torque from active Cas9 translation coordinates.",
    assignedAlgorithm: "Double Helix 3D Simulator v1.0",
    status: "Pending",
    createdDate: "2026-07-14 10:20",
    lastUpdated: "2026-07-14 10:20"
  }
];

export default function ExperimentManager() {
  const [experiments, setExperiments] = useState(MOCK_EXPERIMENTS);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleClearAll = () => {
    setExperiments([]);
    setSelectedExperiment(null);
    triggerToast("Cleared all experiments. Empty state loaded.");
  };

  const handleResetList = () => {
    setExperiments(MOCK_EXPERIMENTS);
    setSelectedExperiment(null);
    triggerToast("Mock experiments list reloaded.");
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

        {/* Action button bar */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {experiments.length > 0 ? (
            <button
              onClick={handleClearAll}
              style={{
                padding: "10px 14px",
                background: T.surf2,
                border: `1px solid ${T.border2}`,
                borderRadius: 8,
                color: T.red,
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${T.red}15`}
              onMouseLeave={e => e.currentTarget.style.background = T.surf2}
            >
              Clear All
            </button>
          ) : (
            <button
              onClick={handleResetList}
              style={{
                padding: "10px 14px",
                background: T.surf2,
                border: `1px solid ${T.border2}`,
                borderRadius: 8,
                color: T.green,
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${T.green}15`}
              onMouseLeave={e => e.currentTarget.style.background = T.surf2}
            >
              Reload Sample Experiments
            </button>
          )}

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
      </div>

      {/* Main split dashboard view */}
      <div style={{
        flex: 1,
        display: "flex",
        gap: "24px",
        flexWrap: "wrap"
      }}>
        {/* LEFT COLUMN: Experiments List */}
        <div style={{
          flex: "2 1 500px",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {experiments.length === 0 ? (
            /* Empty State Card */
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
          ) : (
            /* Active list of experiments */
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: T.text3, textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}>
                Active Experiments ({experiments.length})
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "14px"
              }}>
                {experiments.map(exp => {
                  const isSelected = selectedExperiment?.id === exp.id;
                  let statusColor = T.yellow;
                  if (exp.status === "Completed") statusColor = T.green;
                  if (exp.status === "Pending") statusColor = T.text3;

                  return (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setSelectedExperiment(exp);
                        triggerToast(`Loaded details for: ${exp.name}`);
                      }}
                      style={{
                        background: isSelected ? `${T.accent}15` : T.surf,
                        border: `1px solid ${isSelected ? T.accent : T.border2}`,
                        borderRadius: "12px",
                        padding: "18px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "140px"
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = T.border2;
                          e.currentTarget.style.background = T.surf2;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = T.border2;
                          e.currentTarget.style.background = T.surf;
                        }
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                          <span style={{
                            fontSize: "0.68rem",
                            color: T.accent,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}>
                            {exp.researchArea}
                          </span>
                          <span style={{
                            fontSize: "0.64rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: `${statusColor}15`,
                            border: `1px solid ${statusColor}40`,
                            color: statusColor
                          }}>
                            {exp.status}
                          </span>
                        </div>

                        <h3 style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: isSelected ? T.accent : T.text1,
                          lineHeight: 1.4,
                          marginBottom: "8px"
                        }}>
                          {exp.name}
                        </h3>
                      </div>

                      <div style={{ fontSize: "0.72rem", color: T.text3 }}>
                        Updated {exp.lastUpdated.split(" ")[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Experiment Details Side Panel */}
        {selectedExperiment && (
          <aside style={{
            flex: "1 1 350px",
            minWidth: "300px",
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
            height: "fit-content",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "slideIn 0.25s ease"
          }}>
            {/* Details Panel Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: `1px solid ${T.border2}`,
              paddingBottom: "16px"
            }}>
              <div>
                <div style={{ fontSize: "0.68rem", color: T.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                  Selected Experiment Details
                </div>
                <h2 style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: T.text1,
                  lineHeight: 1.3
                }}>
                  {selectedExperiment.name}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedExperiment(null);
                  triggerToast("Details panel closed.");
                }}
                style={{
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: "50%",
                  color: T.text3,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = T.text1;
                  e.currentTarget.style.borderColor = T.text2;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = T.text3;
                  e.currentTarget.style.borderColor = T.border2;
                }}
              >
                ✕
              </button>
            </div>

            {/* Experiment Parameters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Research Area & Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: T.surf2, padding: "10px 14px", borderRadius: "8px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: 600 }}>Research Area</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text1, marginTop: "4px" }}>{selectedExperiment.researchArea}</div>
                </div>
                <div style={{
                  background: T.surf2,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${T.border}`
                }}>
                  <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: 600 }}>Status</div>
                  <div style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: selectedExperiment.status === "Completed" ? T.green : selectedExperiment.status === "In Progress" ? T.yellow : T.text3,
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: selectedExperiment.status === "Completed" ? T.green : selectedExperiment.status === "In Progress" ? T.yellow : T.text3
                    }} />
                    {selectedExperiment.status}
                  </div>
                </div>
              </div>

              {/* Assigned Algorithm */}
              <div style={{ background: T.surf2, padding: "12px 14px", borderRadius: "8px", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: 600 }}>Assigned Algorithm</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.cyan, marginTop: "4px", fontFamily: "monospace" }}>
                  🧬 {selectedExperiment.assignedAlgorithm}
                </div>
              </div>

              {/* Objective */}
              <div>
                <div style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>Objective</div>
                <div style={{ fontSize: "0.8rem", color: T.text1, lineHeight: 1.5, background: T.surf2, padding: "12px", borderRadius: "8px", border: `1px solid ${T.border}` }}>
                  {selectedExperiment.objective}
                </div>
              </div>

              {/* Description */}
              <div>
                <div style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>Description</div>
                <div style={{ fontSize: "0.8rem", color: T.text2, lineHeight: 1.5, background: T.surf2, padding: "12px", borderRadius: "8px", border: `1px solid ${T.border}` }}>
                  {selectedExperiment.description}
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Created Date</div>
                  <div style={{ fontSize: "0.76rem", color: T.text2, fontWeight: 500, marginTop: "2px" }}>{selectedExperiment.createdDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Last Updated</div>
                  <div style={{ fontSize: "0.76rem", color: T.text2, fontWeight: 500, marginTop: "2px" }}>{selectedExperiment.lastUpdated}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "10px",
              borderTop: `1px solid ${T.border2}`,
              paddingTop: "20px"
            }}>
              <button
                onClick={() => triggerToast("Edit operation triggered.")}
                style={{
                  padding: "10px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  color: T.text1,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.border2}
                onMouseLeave={e => e.currentTarget.style.background = T.surf2}
              >
                Edit
              </button>
              <button
                onClick={() => triggerToast("Duplicate operation triggered.")}
                style={{
                  padding: "10px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  color: T.cyan,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${T.cyan}12`}
                onMouseLeave={e => e.currentTarget.style.background = T.surf2}
              >
                Duplicate
              </button>
              <button
                onClick={() => triggerToast("Archive operation triggered.")}
                style={{
                  padding: "10px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  color: T.yellow,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  gridColumn: "1 / -1"
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${T.yellow}12`}
                onMouseLeave={e => e.currentTarget.style.background = T.surf2}
              >
                Archive
              </button>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

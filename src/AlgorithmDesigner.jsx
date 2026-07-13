import React, { useState, useEffect } from "react";

// Design tokens matching App.jsx and ResearchLab.jsx
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

const DEFAULT_ALGORITHMS = [
  {
    id: "alg_1",
    name: "Base Aligner v1.0",
    objective: "Perform high-fidelity nucleobase alignment for biological structures.",
    problemStatement: "Current alignments are too slow and fail to identify complex structural transitions in sequence reads.",
    researchNotes: "Integrated basic dynamic programming alignments with Smith-Waterman heuristics. Memory footprint optimized.",
    favorite: true,
    recent: true,
    category: "DNA Sequencing",
    formulas: [
      {
        id: "f_1_1",
        name: "Alignment Match Score Ratio",
        expression: "S_r = (M * c_m - G * c_g) / L",
        description: "Normalizes matches and gap penalty coefficients over the total read length.",
        variables: "M = number of matches\nc_m = match reward constant (e.g. 2.0)\nG = number of gaps\nc_g = gap open penalty constant (e.g. 3.0)\nL = total alignment length",
        units: "Dimensionless ratio (Score/Length)"
      },
      {
        id: "f_1_2",
        name: "Gap Extension Scaling",
        expression: "P_gap = o + e * (k - 1)",
        description: "Calculates the affine gap penalty for continuous sequence read gaps of length k.",
        variables: "o = gap open cost\ne = gap extension cost\nk = length of the gap",
        units: "Heuristic score units"
      }
    ]
  },
  {
    id: "alg_2",
    name: "CRISPR PAM Searcher",
    objective: "Locate and evaluate optimal PAM guide-RNA match coordinates in target genomes.",
    problemStatement: "High occurrence of off-target edits when mismatch parameters are set manually.",
    researchNotes: "Mapped off-target alignment frequencies against standard genome databases. Working on guides compatibility index.",
    favorite: false,
    recent: true,
    category: "Gene Editing",
    formulas: [
      {
        id: "f_2_1",
        name: "PAM Binding Probability",
        expression: "P_bind = \u03c0 * \u03b7 * e^(- \u0394G / (R * T))",
        description: "Thermodynamic model estimating guide-RNA guide coordination with targeted PAM sequences.",
        variables: "\u03c0 = guide access factor\n\u03b7 = nuclear concentration factor\n\u0394G = structural free energy binding state\nR = universal gas constant\nT = temperature in Kelvin",
        units: "Probability coefficient (0 - 1)"
      }
    ]
  },
  {
    id: "alg_3",
    name: "Double Helix 3D Simulator",
    objective: "Simulate and visualize structural conformation variations under enzymatic friction.",
    problemStatement: "Molecular simulation software lacks realistic force-vector feedback for complex DNA-enzyme complexes.",
    researchNotes: "Calibrated dynamic constraints to use spatial force vectors. Need to test with bigger enzyme samples.",
    favorite: true,
    recent: false,
    category: "Structural Biology",
    formulas: [
      {
        id: "f_3_1",
        name: "Torsional Shear Stress",
        expression: "\u03c4 = (16 * T_m) / (\u03c0 * d^3)",
        description: "Determines torsional shear limits of double-stranded DNA undergoing enzyme-driven unwinding.",
        variables: "T_m = mechanical torque from enzyme translation\nd = outer helix cylinder diameter (e.g. 2.0 nm)",
        units: "Pascals (Pa) or Newtons/m\u00b2"
      }
    ]
  }
];

export default function AlgorithmDesigner() {
  const [algorithms, setAlgorithms] = useState(DEFAULT_ALGORITHMS);
  const [selectedId, setSelectedId] = useState("alg_1");
  const [toastMessage, setToastMessage] = useState(null);

  // Algorithm Editor state
  const [algName, setAlgName] = useState("");
  const [objective, setObjective] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [researchNotes, setResearchNotes] = useState("");

  // Formula Editor state
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [formulaName, setFormulaName] = useState("");
  const [formulaExpression, setFormulaExpression] = useState("");
  const [formulaDescription, setFormulaDescription] = useState("");
  const [formulaVariables, setFormulaVariables] = useState("");
  const [formulaUnits, setFormulaUnits] = useState("");

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state when active algorithm changes
  useEffect(() => {
    const active = algorithms.find(a => a.id === selectedId);
    if (active) {
      setAlgName(active.name || "");
      setObjective(active.objective || "");
      setProblemStatement(active.problemStatement || "");
      setResearchNotes(active.researchNotes || "");

      // Sync active formula to the first formula of the algorithm if present, or clear it
      const activeFormulas = active.formulas || [];
      if (activeFormulas.length > 0) {
        handleLoadFormula(activeFormulas[0]);
      } else {
        handleClearFormulaFields();
      }
    } else {
      setAlgName("");
      setObjective("");
      setProblemStatement("");
      setResearchNotes("");
      handleClearFormulaFields();
    }
  }, [selectedId, algorithms]);

  const handleSelectAlgorithm = (alg) => {
    setSelectedId(alg.id);
    showToast(`Loaded ${alg.name}`, "info");
  };

  const handleCreateNewAlgorithm = () => {
    setSelectedId(null);
    setAlgName("");
    setObjective("");
    setProblemStatement("");
    setResearchNotes("");
    handleClearFormulaFields();
    showToast("Cleared fields for new algorithm", "info");
  };

  // Algorithm draft operations
  const handleSaveAlgorithmDraft = (e) => {
    if (e) e.preventDefault();
    if (!algName.trim()) {
      showToast("Algorithm Name is required", "error");
      return;
    }

    if (selectedId) {
      setAlgorithms(prev => prev.map(alg => {
        if (alg.id === selectedId) {
          return {
            ...alg,
            name: algName,
            objective,
            problemStatement,
            researchNotes,
            recent: true
          };
        }
        return alg;
      }));
      showToast("Algorithm draft updated successfully!", "success");
    } else {
      const newAlg = {
        id: `alg_${Date.now()}`,
        name: algName,
        objective,
        problemStatement,
        researchNotes,
        favorite: false,
        recent: true,
        category: "Custom DNA",
        formulas: []
      };
      setAlgorithms(prev => [newAlg, ...prev]);
      setSelectedId(newAlg.id);
      showToast("New algorithm draft created!", "success");
    }
  };

  const handleCancelAlgorithm = () => {
    if (selectedId) {
      const current = algorithms.find(a => a.id === selectedId);
      if (current) {
        setAlgName(current.name || "");
        setObjective(current.objective || "");
        setProblemStatement(current.problemStatement || "");
        setResearchNotes(current.researchNotes || "");
        showToast("Reverted algorithm changes", "info");
      }
    } else {
      setAlgName("");
      setObjective("");
      setProblemStatement("");
      setResearchNotes("");
      showToast("Cleared unsaved draft", "info");
    }
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === id) {
        const nextFav = !alg.favorite;
        showToast(nextFav ? "Added to Favorites" : "Removed from Favorites", "info");
        return { ...alg, favorite: nextFav };
      }
      return alg;
    }));
  };

  // Formula Editor operations
  const handleLoadFormula = (formula) => {
    setSelectedFormulaId(formula.id);
    setFormulaName(formula.name || "");
    setFormulaExpression(formula.expression || "");
    setFormulaDescription(formula.description || "");
    setFormulaVariables(formula.variables || "");
    setFormulaUnits(formula.units || "");
  };

  const handleClearFormulaFields = () => {
    setSelectedFormulaId("");
    setFormulaName("");
    setFormulaExpression("");
    setFormulaDescription("");
    setFormulaVariables("");
    setFormulaUnits("");
  };

  const handleNewFormula = () => {
    if (!selectedId) {
      showToast("Please select or save an algorithm before adding formulas.", "error");
      return;
    }
    handleClearFormulaFields();
    showToast("Editor cleared. Create your new formula below.", "info");
  };

  const handleSaveFormula = () => {
    if (!selectedId) {
      showToast("Please select an active algorithm first.", "error");
      return;
    }
    if (!formulaName.trim()) {
      showToast("Formula Name is required", "error");
      return;
    }
    if (!formulaExpression.trim()) {
      showToast("Mathematical Expression is required", "error");
      return;
    }

    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === selectedId) {
        const formulas = alg.formulas || [];
        if (selectedFormulaId) {
          // Update existing formula
          return {
            ...alg,
            formulas: formulas.map(f => {
              if (f.id === selectedFormulaId) {
                return {
                  ...f,
                  name: formulaName,
                  expression: formulaExpression,
                  description: formulaDescription,
                  variables: formulaVariables,
                  units: formulaUnits
                };
              }
              return f;
            })
          };
        } else {
          // Create new formula
          const newFormula = {
            id: `f_${Date.now()}`,
            name: formulaName,
            expression: formulaExpression,
            description: formulaDescription,
            variables: formulaVariables,
            units: formulaUnits
          };
          setSelectedFormulaId(newFormula.id);
          return {
            ...alg,
            formulas: [...formulas, newFormula]
          };
        }
      }
      return alg;
    }));
    showToast("Formula saved successfully!", "success");
  };

  const handleDuplicateFormula = () => {
    if (!selectedFormulaId) {
      showToast("No active formula selected to duplicate.", "error");
      return;
    }

    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === selectedId) {
        const formulas = alg.formulas || [];
        const active = formulas.find(f => f.id === selectedFormulaId);
        if (active) {
          const duplicated = {
            ...active,
            id: `f_${Date.now()}`,
            name: `${active.name} (Copy)`
          };
          setSelectedFormulaId(duplicated.id);
          setFormulaName(duplicated.name);
          showToast(`Duplicated "${active.name}"`, "success");
          return {
            ...alg,
            formulas: [...formulas, duplicated]
          };
        }
      }
      return alg;
    }));
  };

  const handleDeleteFormula = () => {
    if (!selectedFormulaId) {
      showToast("No active formula selected to delete.", "error");
      return;
    }

    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === selectedId) {
        const formulas = alg.formulas || [];
        const nextFormulas = formulas.filter(f => f.id !== selectedFormulaId);

        // Pick the next available formula if any, otherwise clear fields
        if (nextFormulas.length > 0) {
          handleLoadFormula(nextFormulas[0]);
        } else {
          handleClearFormulaFields();
        }
        showToast("Formula removed successfully.", "success");
        return {
          ...alg,
          formulas: nextFormulas
        };
      }
      return alg;
    }));
  };

  // Derived variables
  const activeAlgorithm = algorithms.find(a => a.id === selectedId) || null;
  const activeFormulas = activeAlgorithm?.formulas || [];

  return (
    <div style={{
      background: T.bg,
      color: T.text1,
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          background: toastMessage.type === "error" ? "#2a0a10" : toastMessage.type === "info" ? "#0a1530" : "#002a1a",
          border: `1px solid ${toastMessage.type === "error" ? T.red : toastMessage.type === "info" ? T.accent : T.green}`,
          borderRadius: 8,
          padding: "12px 20px",
          color: T.text1,
          fontSize: "0.84rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "slideIn 0.2s ease"
        }}>
          <span>{toastMessage.type === "error" ? "⚠️" : toastMessage.type === "info" ? "ℹ️" : "✅"}</span>
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Responsive Workspace Wrapper */}
      <div style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: "calc(100vh - 60px)"
      }}>
        {/* ── SIDEBAR PANEL ── */}
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
            onClick={handleCreateNewAlgorithm}
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
            <h4 style={{
              fontSize: "0.74rem",
              color: T.text3,
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 10px 0"
            }}>My Algorithms ({algorithms.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {algorithms.map(alg => (
                <div
                  key={alg.id}
                  onClick={() => handleSelectAlgorithm(alg)}
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
                  <button
                    onClick={(e) => toggleFavorite(alg.id, e)}
                    style={{
                      background: "none",
                      border: "none",
                      color: alg.favorite ? T.yellow : T.text3,
                      cursor: "pointer",
                      fontSize: "1rem",
                      padding: 0
                    }}
                  >
                    ★
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recent */}
          <div>
            <h4 style={{
              fontSize: "0.74rem",
              color: T.text3,
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 10px 0"
            }}>Recent</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {algorithms.filter(a => a.recent).map(alg => (
                <div
                  key={alg.id}
                  onClick={() => handleSelectAlgorithm(alg)}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${selectedId === alg.id ? T.accent : T.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: T.text2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>{alg.name || "Untitled Draft"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Favorites */}
          <div>
            <h4 style={{
              fontSize: "0.74rem",
              color: T.text3,
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 10px 0"
            }}>Favorites</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {algorithms.filter(a => a.favorite).map(alg => (
                <div
                  key={alg.id}
                  onClick={() => handleSelectAlgorithm(alg)}
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
                  <span style={{
                    fontSize: "0.78rem",
                    color: T.text2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginRight: 8,
                    flex: 1
                  }}>{alg.name || "Untitled Draft"}</span>
                  <span style={{ color: T.yellow, fontSize: "0.85rem" }}>★</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN WORKSPACE ── */}
        <div className="designer-grid" style={{
          flex: 1,
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          minWidth: 0,
          boxSizing: "border-box"
        }}>
          {/* Style for stacking on small screens */}
          <style>{`
            @media (max-width: 1024px) {
              .designer-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* COLUMN 1: ALGORITHM DESIGNS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Header Title */}
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

            {/* Editor fields */}
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
                  onClick={handleSaveAlgorithmDraft}
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
                  onClick={handleCancelAlgorithm}
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
          </div>

          {/* COLUMN 2: FORMULA EDITOR PANEL */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Panel Card */}
            <div style={{
              background: T.surf,
              border: `1px solid ${T.accent}35`,
              borderRadius: 12,
              padding: "20px",
              boxShadow: `0 0 20px ${T.accent}0a`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: T.text1 }}>
                    🧬 Formula Editor
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem", color: T.text2 }}>
                    Manage model expressions and scientific variable notations for the current design.
                  </p>
                </div>
                {/* Active algorithm formula selector dropdown */}
                {activeAlgorithm && (
                  <select
                    value={selectedFormulaId}
                    onChange={e => {
                      const f = activeFormulas.find(fo => fo.id === e.target.value);
                      if (f) handleLoadFormula(f);
                      else handleClearFormulaFields();
                    }}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: 6,
                      padding: "6px 12px",
                      color: T.text1,
                      fontSize: "0.78rem",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">-- Select Formula --</option>
                    {activeFormulas.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Formula Fields Form */}
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: 12,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              {/* Formula Editor Actions Row */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", borderBottom: `1px solid ${T.border2}`, paddingBottom: "14px", marginBottom: "4px" }}>
                <button
                  onClick={handleNewFormula}
                  style={{
                    padding: "7px 12px",
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: 6,
                    color: T.cyan,
                    fontWeight: 700,
                    fontSize: "0.74rem",
                    cursor: "pointer"
                  }}
                >
                  + New Formula
                </button>
                <button
                  onClick={handleSaveFormula}
                  style={{
                    padding: "7px 12px",
                    background: `${T.green}18`,
                    border: `1px solid ${T.green}40`,
                    borderRadius: 6,
                    color: T.green,
                    fontWeight: 700,
                    fontSize: "0.74rem",
                    cursor: "pointer"
                  }}
                >
                  ✓ Save Formula
                </button>
                <button
                  onClick={handleDuplicateFormula}
                  style={{
                    padding: "7px 12px",
                    background: `${T.accent}18`,
                    border: `1px solid ${T.accent}40`,
                    borderRadius: 6,
                    color: T.text1,
                    fontWeight: 700,
                    fontSize: "0.74rem",
                    cursor: "pointer"
                  }}
                >
                  📋 Duplicate
                </button>
                <button
                  onClick={handleDeleteFormula}
                  style={{
                    padding: "7px 12px",
                    background: `${T.red}18`,
                    border: `1px solid ${T.red}40`,
                    borderRadius: 6,
                    color: T.red,
                    fontWeight: 700,
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    marginLeft: "auto"
                  }}
                >
                  🗑 Delete
                </button>
              </div>

              {/* Formula Name */}
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Formula Name *</label>
                <input
                  type="text"
                  value={formulaName}
                  onChange={e => setFormulaName(e.target.value)}
                  placeholder="e.g. Affinity Constant Index"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Mathematical Expression */}
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Mathematical Expression *</label>
                <input
                  type="text"
                  value={formulaExpression}
                  onChange={e => setFormulaExpression(e.target.value)}
                  placeholder="e.g. K_d = [A][B] / [AB]"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.cyan, fontSize: "0.95rem", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* LIVE PREVIEW AREA */}
              <div>
                <label style={{ color: T.text3, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Formula Expression Live Preview</label>
                <div style={{
                  background: "#02020a",
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "56px",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  color: formulaExpression ? T.cyan : T.text3,
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)",
                  textAlign: "center"
                }}>
                  {formulaExpression || "Awaiting mathematical expression input..."}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Description</label>
                <textarea
                  rows={2}
                  value={formulaDescription}
                  onChange={e => setFormulaDescription(e.target.value)}
                  placeholder="Summarize the chemical or biological mechanics represented by this expression..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none", boxSizing: "border-box", resize: "none", fontFamily: "inherit" }}
                />
              </div>

              {/* Variables and Units Split Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Variables</label>
                  <textarea
                    rows={3}
                    value={formulaVariables}
                    onChange={e => setFormulaVariables(e.target.value)}
                    placeholder="e.g. [A] = solute concentration"
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "monospace" }}
                  />
                </div>
                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6, fontWeight: 600 }}>Units</label>
                  <input
                    type="text"
                    value={formulaUnits}
                    onChange={e => setFormulaUnits(e.target.value)}
                    placeholder="e.g. mol/L"
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

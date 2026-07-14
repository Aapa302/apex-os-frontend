import React, { useState, useMemo, useEffect } from "react";

// Design Tokens matching App.jsx and ResearchLab.jsx (Default Dark Theme)
const DEFAULT_T = {
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
    lastUpdated: "2026-07-12 09:15",
    accuracy: 94.5,
    throughput: "2.8 Gbps",
    timeline: [
      { id: "e1_1", type: "success", title: "Experiment Created", timestamp: "2026-07-10 14:30", desc: "Simulation initialization sequence completed under project authorization guidelines.", icon: "✅" },
      { id: "e1_2", type: "info", title: "Algorithm Selected", timestamp: "2026-07-10 14:45", desc: "Assigned CRISPR PAM Searcher v2.0 as primary sequence matching engine.", icon: "ℹ️" },
      { id: "e1_3", type: "info", title: "Parameters Configured", timestamp: "2026-07-10 15:00", desc: "Set match threshold to Q30, off-target mismatch allowance to 2 base pairs.", icon: "⚙️" },
      { id: "e1_4", type: "success", title: "Validation Started", timestamp: "2026-07-11 09:00", desc: "Secure computation pipeline compilation verified successfully with 4 active node modules.", icon: "⚡" },
      { id: "e1_5", type: "warning", title: "Review Pending", timestamp: "2026-07-11 17:30", desc: "Mismatch thermodynamic free-energy state values required literature citation audits.", icon: "⚠️" },
      { id: "e1_6", type: "success", title: "Completed", timestamp: "2026-07-12 09:15", desc: "Off-target frequency simulated and verified with high-precision metrics.", icon: "🏆" }
    ],
    attachments: [
      { id: "att_1_1", name: "crispr_off_target_bounds.fasta", type: "FASTA", size: "4.8 MB", date: "2026-07-10", uploader: "Dr. Mei Lin" },
      { id: "att_1_2", name: "thermodynamics_states_audit.pdf", type: "PDF", size: "1.2 MB", date: "2026-07-11", uploader: "Sarah Kim" },
      { id: "att_1_3", name: "alignment_matrix_coordinates.csv", type: "CSV", size: "640 KB", date: "2026-07-12", uploader: "Alex Chen" }
    ]
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
    lastUpdated: "2026-07-14 11:45",
    accuracy: 89.2,
    throughput: "3.5 Gbps",
    timeline: [
      { id: "e2_1", type: "success", title: "Experiment Created", timestamp: "2026-07-13 08:00", desc: "Sequence read trace model launched.", icon: "✅" },
      { id: "e2_2", type: "info", title: "Algorithm Selected", timestamp: "2026-07-13 08:15", desc: "Selected Base Aligner v1.1.0 heuristics engine.", icon: "ℹ️" },
      { id: "e2_3", type: "info", title: "Parameters Configured", timestamp: "2026-07-13 09:30", desc: "Gap open penalty set to 3.0, extension penalty coefficient set to 1.0.", icon: "⚙️" },
      { id: "e2_4", type: "warning", title: "Validation Started", timestamp: "2026-07-14 09:00", desc: "Memory overflow alert triggered on >10 GB sequence reads bounds.", icon: "⚠️" },
      { id: "e2_5", type: "info", title: "Review Pending", timestamp: "2026-07-14 11:45", desc: "Sarah Kim initiated local traceback pointer indexing audits.", icon: "🔬" }
    ],
    attachments: [
      { id: "att_2_1", name: "smith_waterman_traceback.fasta", type: "FASTA", size: "2.4 MB", date: "2026-07-13", uploader: "Sarah Kim" },
      { id: "att_2_2", name: "memory_limit_analysis.csv", type: "CSV", size: "120 KB", date: "2026-07-14", uploader: "Alex Chen" }
    ]
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
    lastUpdated: "2026-07-14 10:20",
    accuracy: 0,
    throughput: "0 Gbps",
    timeline: [
      { id: "e3_1", type: "success", title: "Experiment Created", timestamp: "2026-07-14 10:20", desc: "Crystalline lattices model structural confirmation profile loaded.", icon: "✅" },
      { id: "e3_2", type: "info", title: "Algorithm Selected", timestamp: "2026-07-14 10:25", desc: "Torsional Shear Stress formula matrices verified.", icon: "ℹ️" }
    ],
    attachments: [
      { id: "att_3_1", name: "stress_tensor_matrices.pdf", type: "PDF", size: "850 KB", date: "2026-07-14", uploader: "Dr. Mei Lin" }
    ]
  }
];

export default function ExperimentManager({ T = DEFAULT_T }) {
  // Load/Save from localStorage
  const [experiments, setExperiments] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_experiments");
      return saved ? JSON.parse(saved) : MOCK_EXPERIMENTS;
    } catch {
      return MOCK_EXPERIMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("apex_os_experiments", JSON.stringify(experiments));
    } catch (e) {
      console.error(e);
    }
  }, [experiments]);

  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Details Panel view mode state: "parameters" vs "timeline" vs "attachments"
  const [detailsTab, setDetailsTab] = useState("parameters");

  // Timeline Filtering states
  const [timelineFilter, setTimelineFilter] = useState("All");
  const [timelineSearch, setTimelineSearch] = useState("");

  // Attachments Filtering states
  const [attachmentFilter, setAttachmentFilter] = useState("All");
  const [attachmentSearch, setAttachmentSearch] = useState("");

  // CRUD modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formResearchArea, setFormResearchArea] = useState("Gene Editing");
  const [formObjective, setFormObjective] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAssignedAlgorithm, setFormAssignedAlgorithm] = useState("");
  const [formStatus, setFormStatus] = useState("Pending");
  const [formAccuracy, setFormAccuracy] = useState(0);
  const [formThroughput, setFormThroughput] = useState("1.0 Gbps");
  const [editingId, setEditingId] = useState(null);

  // Results Comparison View states
  const [showComparison, setShowComparison] = useState(false);
  const [compareIds, setCompareIds] = useState([]);

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

  // Create or Update Form handler
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormName("");
    setFormResearchArea("Gene Editing");
    setFormObjective("");
    setFormDescription("");
    setFormAssignedAlgorithm("");
    setFormStatus("Pending");
    setFormAccuracy(0);
    setFormThroughput("1.0 Gbps");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingId(exp.id);
    setFormName(exp.name);
    setFormResearchArea(exp.researchArea);
    setFormObjective(exp.objective);
    setFormDescription(exp.description);
    setFormAssignedAlgorithm(exp.assignedAlgorithm);
    setFormStatus(exp.status);
    setFormAccuracy(exp.accuracy || 0);
    setFormThroughput(exp.throughput || "1.0 Gbps");
    setShowFormModal(true);
  };

  const handleSaveExperiment = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      triggerToast("Name is required");
      return;
    }

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (editingId) {
      setExperiments(prev => prev.map(exp => {
        if (exp.id === editingId) {
          const updated = {
            ...exp,
            name: formName,
            researchArea: formResearchArea,
            objective: formObjective,
            description: formDescription,
            assignedAlgorithm: formAssignedAlgorithm,
            status: formStatus,
            accuracy: Number(formAccuracy),
            throughput: formThroughput,
            lastUpdated: timestamp
          };
          if (selectedExperiment?.id === exp.id) {
            setSelectedExperiment(updated);
          }
          return updated;
        }
        return exp;
      }));
      triggerToast("Experiment updated successfully.");
    } else {
      const newExp = {
        id: `exp_${Date.now()}`,
        name: formName,
        researchArea: formResearchArea,
        objective: formObjective,
        description: formDescription,
        assignedAlgorithm: formAssignedAlgorithm,
        status: formStatus,
        accuracy: Number(formAccuracy),
        throughput: formThroughput,
        createdDate: timestamp,
        lastUpdated: timestamp,
        timeline: [
          { id: `e_${Date.now()}`, type: "success", title: "Experiment Created", timestamp, desc: "Initialization sequence completed.", icon: "✅" }
        ],
        attachments: []
      };
      setExperiments(prev => [newExp, ...prev]);
      triggerToast("New experiment created successfully.");
    }

    setShowFormModal(false);
  };

  const handleDeleteExperiment = (id) => {
    setExperiments(prev => prev.filter(e => e.id !== id));
    if (selectedExperiment?.id === id) {
      setSelectedExperiment(null);
    }
    triggerToast("Experiment deleted.");
  };

  const handleDuplicateExperiment = (exp) => {
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const duplicated = {
      ...exp,
      id: `exp_${Date.now()}`,
      name: `${exp.name} (Copy)`,
      createdDate: timestamp,
      lastUpdated: timestamp,
      timeline: [
        { id: `e_${Date.now()}`, type: "success", title: "Duplicated Experiment", timestamp, desc: `Copied from ${exp.name}`, icon: "✅" },
        ...(exp.timeline || [])
      ]
    };
    setExperiments(prev => [duplicated, ...prev]);
    triggerToast(`Duplicated "${exp.name}"`);
  };

  const handleToggleArchiveExperiment = (exp) => {
    const updatedStatus = exp.status === "Archived" ? "Pending" : "Archived";
    setExperiments(prev => prev.map(e => {
      if (e.id === exp.id) {
        const updated = { ...e, status: updatedStatus };
        if (selectedExperiment?.id === exp.id) {
          setSelectedExperiment(updated);
        }
        return updated;
      }
      return e;
    }));
    triggerToast(`Experiment marked as ${updatedStatus}`);
  };

  // Timeline filtering helper
  const getFilteredTimeline = (exp) => {
    if (!exp || !exp.timeline) return [];
    return exp.timeline.filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(timelineSearch.toLowerCase()) ||
                            evt.desc.toLowerCase().includes(timelineSearch.toLowerCase());
      const matchesFilter = timelineFilter === "All" || evt.type.toLowerCase() === timelineFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  };

  // Attachments filtering helper
  const getFilteredAttachments = (exp) => {
    if (!exp || !exp.attachments) return [];
    return exp.attachments.filter(att => {
      const matchesSearch = att.name.toLowerCase().includes(attachmentSearch.toLowerCase());
      const matchesFilter = attachmentFilter === "All" || att.type.toUpperCase() === attachmentFilter.toUpperCase();
      return matchesSearch && matchesFilter;
    });
  };

  // Handle attachment removal
  const handleRemoveAttachment = (expId, attId) => {
    setExperiments(prev => prev.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          attachments: exp.attachments.filter(a => a.id !== attId)
        };
      }
      return exp;
    }));
    // Update local selectedExperiment tracking
    if (selectedExperiment && selectedExperiment.id === expId) {
      setSelectedExperiment(prev => ({
        ...prev,
        attachments: prev.attachments.filter(a => a.id !== attId)
      }));
    }
    triggerToast("Attachment removed.");
  };

  const filteredTimelineEvents = selectedExperiment ? getFilteredTimeline(selectedExperiment) : [];
  const filteredAttachments = selectedExperiment ? getFilteredAttachments(selectedExperiment) : [];

  const handleToggleCompare = (id) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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

      {/* ── CREATE / EDIT MODAL ── */}
      {showFormModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: 16,
            padding: 24,
            width: 480,
            maxWidth: "90vw",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 800 }}>
              {editingId ? "✏️ Edit Experiment" : "➕ Create New Experiment"}
            </h3>
            <form onSubmit={handleSaveExperiment} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Experiment Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. CRISPR Off-Target Calibration"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Research Area</label>
                <select
                  value={formResearchArea}
                  onChange={e => setFormResearchArea(e.target.value)}
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1 }}
                >
                  <option value="Gene Editing">Gene Editing</option>
                  <option value="DNA Sequencing">DNA Sequencing</option>
                  <option value="Structural Biology">Structural Biology</option>
                  <option value="Biochemistry">Biochemistry</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Assigned Algorithm</label>
                <input
                  type="text"
                  value={formAssignedAlgorithm}
                  onChange={e => setFormAssignedAlgorithm(e.target.value)}
                  placeholder="e.g. Smith-Waterman Heuristics v1.0"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Accuracy (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formAccuracy}
                    onChange={e => setFormAccuracy(e.target.value)}
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Objective</label>
                <textarea
                  rows={2}
                  value={formObjective}
                  onChange={e => setFormObjective(e.target.value)}
                  placeholder="Map optimization coordinates..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "4px", fontWeight: 600 }}>Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Enter literary citations or constraints..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                  Save
                </button>
                <button type="button" onClick={() => setShowFormModal(false)} style={{ padding: "10px 16px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.text2, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
          <button
            onClick={() => setShowComparison(prev => !prev)}
            style={{
              padding: "10px 14px",
              background: showComparison ? T.accent : T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 8,
              color: showComparison ? "#fff" : T.cyan,
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            📊 Compare Results ({compareIds.length})
          </button>

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
            onClick={handleOpenCreateModal}
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

      {/* ── RESULTS COMPARISON DASHBOARD PANEL ── */}
      {showComparison && (
        <div style={{
          background: T.surf,
          border: `1px solid ${T.accent}40`,
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: `0 10px 30px ${T.accent}15`
        }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 800, color: T.text1 }}>
            📊 Quantitative Results Comparison
          </h2>
          <p style={{ margin: "0 0 16px 0", fontSize: "0.8rem", color: T.text2 }}>
            Select completed experiments from the checkbox lists to contrast accuracy levels, throughput coefficients, and algorithm metrics.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
            {experiments.map(exp => (
              <label key={exp.id} style={{ display: "flex", alignItems: "center", gap: "6px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", fontSize: "0.78rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={compareIds.includes(exp.id)}
                  onChange={() => handleToggleCompare(exp.id)}
                  style={{ accentColor: T.accent }}
                />
                <span>{exp.name}</span>
              </label>
            ))}
          </div>

          {compareIds.length === 0 ? (
            <div style={{ color: T.text3, textAlign: "center", fontSize: "0.8rem", padding: "16px" }}>Please check at least one experiment above to display side-by-side matrices.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: T.surf2, borderBottom: `2px solid ${T.border2}` }}>
                    <th style={{ padding: "10px", border: `1px solid ${T.border}` }}>Metric</th>
                    {compareIds.map(id => {
                      const exp = experiments.find(e => e.id === id);
                      return (
                        <th key={id} style={{ padding: "10px", border: `1px solid ${T.border}`, fontWeight: 800, color: T.accent }}>
                          {exp?.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "10px", border: `1px solid ${T.border}`, fontWeight: 700 }}>Accuracy Rate</td>
                    {compareIds.map(id => {
                      const exp = experiments.find(e => e.id === id);
                      return (
                        <td key={id} style={{ padding: "10px", border: `1px solid ${T.border}`, color: T.green, fontWeight: "bold" }}>
                          {exp?.accuracy ? `${exp.accuracy}%` : "Pending/N/A"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "10px", border: `1px solid ${T.border}`, fontWeight: 700 }}>Throughput</td>
                    {compareIds.map(id => {
                      const exp = experiments.find(e => e.id === id);
                      return (
                        <td key={id} style={{ padding: "10px", border: `1px solid ${T.border}`, color: T.cyan }}>
                          {exp?.throughput || "N/A"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "10px", border: `1px solid ${T.border}`, fontWeight: 700 }}>Assigned Pipeline</td>
                    {compareIds.map(id => {
                      const exp = experiments.find(e => e.id === id);
                      return (
                        <td key={id} style={{ padding: "10px", border: `1px solid ${T.border}`, fontFamily: "monospace" }}>
                          {exp?.assignedAlgorithm || "None"}
                        </td>
                      );
                    })}
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "10px", border: `1px solid ${T.border}`, fontWeight: 700 }}>Research Focus</td>
                    {compareIds.map(id => {
                      const exp = experiments.find(e => e.id === id);
                      return (
                        <td key={id} style={{ padding: "10px", border: `1px solid ${T.border}` }}>
                          {exp?.researchArea}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
                  onClick={handleOpenCreateModal}
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
                        setDetailsTab("parameters"); // default to parameters view
                        setTimelineSearch("");
                        setTimelineFilter("All");
                        setAttachmentSearch("");
                        setAttachmentFilter("All");
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

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "0.72rem", color: T.text3 }}>
                          Updated {exp.lastUpdated.split(" ")[0]}
                        </div>
                        <div style={{ display: "flex", gap: "6px" }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleOpenEditModal(exp)} style={{ background: "none", border: "none", color: T.cyan, cursor: "pointer", fontSize: "0.75rem" }} title="Edit">✏️</button>
                          <button onClick={() => handleDeleteExperiment(exp.id)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.75rem" }} title="Delete">🗑️</button>
                        </div>
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
            minWidth: "320px",
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
              <div style={{ flex: 1, minWidth: 0, marginRight: "8px" }}>
                <div style={{ fontSize: "0.68rem", color: T.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                  Selected Experiment Details
                </div>
                <h2 style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: T.text1,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }} title={selectedExperiment.name}>
                  {selectedExperiment.name}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedExperiment(null);
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
                  transition: "all 0.15s",
                  flexShrink: 0
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

            {/* TAB SELECTOR BAR */}
            <div style={{
              display: "flex",
              background: T.surf2,
              border: `1px solid ${T.border}`,
              borderRadius: "8px",
              padding: "4px",
              gap: "4px"
            }}>
              {["parameters", "timeline", "attachments"].map(tabOpt => (
                <button
                  key={tabOpt}
                  onClick={() => setDetailsTab(tabOpt)}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    background: detailsTab === tabOpt ? T.border2 : "transparent",
                    border: "none",
                    borderRadius: "6px",
                    color: detailsTab === tabOpt ? T.text1 : T.text2,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textTransform: "capitalize"
                  }}
                >
                  {tabOpt}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS: PARAMETERS VIEW */}
            {detailsTab === "parameters" && (
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
                    🧬 {selectedExperiment.assignedAlgorithm || "None Assigned"}
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <div style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>Objective</div>
                  <div style={{ fontSize: "0.8rem", color: T.text1, lineHeight: 1.5, background: T.surf2, padding: "12px", borderRadius: "8px", border: `1px solid ${T.border}` }}>
                    {selectedExperiment.objective || "No objective configured."}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "4px" }}>Description</div>
                  <div style={{ fontSize: "0.8rem", color: T.text2, lineHeight: 1.5, background: T.surf2, padding: "12px", borderRadius: "8px", border: `1px solid ${T.border}` }}>
                    {selectedExperiment.description || "No description provided."}
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
            )}

            {/* TAB CONTENTS: TIMELINE VIEW */}
            {detailsTab === "timeline" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                {/* Search Field */}
                <div>
                  <input
                    type="text"
                    value={timelineSearch}
                    onChange={e => setTimelineSearch(e.target.value)}
                    placeholder="🔍 Search timeline events..."
                    style={{
                      width: "100%",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "8px",
                      padding: "8px 12px",
                      color: T.text1,
                      fontSize: "0.8rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Vertical Timeline Stream */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  paddingLeft: "20px",
                  borderLeft: `2px solid ${T.border2}`,
                  marginLeft: "10px",
                  gap: "20px",
                  maxHeight: "320px",
                  overflowY: "auto",
                  paddingTop: "4px",
                  paddingBottom: "4px"
                }}>
                  {filteredTimelineEvents.length === 0 ? (
                    <div style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: T.text3,
                      fontSize: "0.8rem"
                    }}>
                      No events match filters.
                    </div>
                  ) : (
                    filteredTimelineEvents.map((evt) => {
                      let nodeColor = T.accent;
                      if (evt.type === "success") nodeColor = T.green;
                      if (evt.type === "warning") nodeColor = T.yellow;

                      return (
                        <div key={evt.id} style={{ position: "relative" }}>
                          {/* Timeline node icon */}
                          <div style={{
                            position: "absolute",
                            left: "-27px",
                            top: "2px",
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: T.surf,
                            border: `2px solid ${nodeColor}`,
                            boxShadow: `0 0 6px ${nodeColor}50`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.6rem"
                          }}>
                            {evt.icon}
                          </div>

                          {/* Event info */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text1 }}>
                                {evt.title}
                              </span>
                              <span style={{ fontSize: "0.68rem", color: T.text3 }}>
                                {evt.timestamp.split(" ")[1] || evt.timestamp}
                              </span>
                            </div>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem", color: T.text2, lineHeight: 1.4 }}>
                              {evt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENTS: ATTACHMENTS VIEW */}
            {detailsTab === "attachments" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                {/* Search Field */}
                <div>
                  <input
                    type="text"
                    value={attachmentSearch}
                    onChange={e => setAttachmentSearch(e.target.value)}
                    placeholder="🔍 Search attachments..."
                    style={{
                      width: "100%",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "8px",
                      padding: "8px 12px",
                      color: T.text1,
                      fontSize: "0.8rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* File list */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  maxHeight: "320px",
                  overflowY: "auto"
                }}>
                  {filteredAttachments.length === 0 ? (
                    <div style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: T.text3,
                      fontSize: "0.8rem"
                    }}>
                      No attachments match filters.
                    </div>
                  ) : (
                    filteredAttachments.map(att => (
                      <div
                        key={att.id}
                        style={{
                          background: T.surf2,
                          border: `1px solid ${T.border}`,
                          borderRadius: "8px",
                          padding: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ minWidth: 0, marginRight: "8px" }}>
                          <div style={{
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            color: T.text1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }} title={att.name}>
                            {att.name}
                          </div>
                          <div style={{ fontSize: "0.64rem", color: T.text3, marginTop: "2px" }}>
                            Type: <strong>{att.type}</strong> | Size: {att.size} | By: {att.uploader}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button
                            onClick={() => handleRemoveAttachment(selectedExperiment.id, att.id)}
                            style={{ background: "transparent", border: "none", color: T.red, cursor: "pointer", fontSize: "0.8rem" }}
                            title="Remove"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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
                onClick={() => handleOpenEditModal(selectedExperiment)}
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
              >
                Edit Details
              </button>
              <button
                onClick={() => handleDuplicateExperiment(selectedExperiment)}
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
              >
                Duplicate
              </button>
              <button
                onClick={() => handleToggleArchiveExperiment(selectedExperiment)}
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
              >
                {selectedExperiment.status === "Archived" ? "Unarchive" : "Archive"}
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

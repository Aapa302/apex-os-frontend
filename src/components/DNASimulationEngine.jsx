import React, { useState, useEffect, useMemo } from "react";

// Design themes matching App.jsx and ResearchLab.jsx
const THEME = {
  dark: {
    bg: "#05050f",
    surf: "#0b0b18",
    surf2: "#0f0f1e",
    border: "#161628",
    border2: "#1e1e35",
    text1: "#f0f2ff",
    text2: "#8890b0",
    text3: "#444868",
    accent: "#5b5ef4",
    accent2: "#7c5cf6",
    accentGlow: "rgba(91, 94, 244, 0.15)",
    green: "#22d3a5",
    greenGlow: "rgba(34, 211, 165, 0.1)",
    red: "#f04060",
    yellow: "#f5a623",
    yellowGlow: "rgba(245, 166, 35, 0.1)",
    cyan: "#00d4ff",
    pink: "#e040fb",
    glass: "rgba(11, 11, 24, 0.85)",
    shadow: "rgba(0, 0, 0, 0.5)",
  },
  light: {
    bg: "#f8fafc",
    surf: "#ffffff",
    surf2: "#f1f5f9",
    border: "#e2e8f0",
    border2: "#cbd5e1",
    text1: "#0f172a",
    text2: "#475569",
    text3: "#94a3b8",
    accent: "#3b82f6",
    accent2: "#4f46e5",
    accentGlow: "rgba(59, 130, 246, 0.1)",
    green: "#10b981",
    greenGlow: "rgba(16, 185, 129, 0.1)",
    red: "#ef4444",
    yellow: "#d97706",
    yellowGlow: "rgba(217, 119, 6, 0.1)",
    cyan: "#06b6d4",
    pink: "#db2777",
    glass: "rgba(255, 255, 255, 0.85)",
    shadow: "rgba(15, 23, 42, 0.08)",
  }
};

const BASE_COLORS = {
  A: { bg: "#ef4444", text: "#ffffff", label: "Adenine" },
  T: { bg: "#3b82f6", text: "#ffffff", label: "Thymine" },
  C: { bg: "#10b981", text: "#ffffff", label: "Cytosine" },
  G: { bg: "#f5a623", text: "#ffffff", label: "Guanine" },
  U: { bg: "#a855f7", text: "#ffffff", label: "Uracil" }
};

const SAMPLE_SEQUENCES = [
  { name: "CRISPR-Cas9 Target Sequence", seq: "ATGCGATCGATCGATCGATCGATCGATC" },
  { name: "Human Hemoglobin Gene Segment", seq: "ATGGTGCATCTGACTCCTGAGGAGAAGT" },
  { name: "Sars-Cov-2 Spike Receptor Motif", seq: "ATGTTTGTTTTTCTTGTTTTATTGCCAC" },
  { name: "Synthetic Archival Metadata block", seq: "ATCGATCGATCGATCGATCGATCGATCG" }
];

export default function DNASimulationEngine() {
  const [isLight, setIsLight] = useState(false);
  const theme = isLight ? THEME.light : THEME.dark;

  // State
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, queue, sequencing, mutations, translation, mapping, reports, settings

  // Sequence Previews
  const [currentSeqName, setCurrentSeqName] = useState(SAMPLE_SEQUENCES[0].name);
  const [dnaSeq, setDnaSeq] = useState(SAMPLE_SEQUENCES[0].seq);

  // Simulation parameters & settings
  const [mutationRate, setMutationRate] = useState(0.05);
  const [mutationType, setMutationType] = useState("point"); // point, insertion, deletion
  const [mutationPos, setMutationPos] = useState(5);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [errorTolerance, setErrorTolerance] = useState(0.01);
  const [codonTable, setCodonTable] = useState("standard");

  // Mock Simulations & Queue
  const [simulations, setSimulations] = useState([
    { id: "SIM-001", name: "SARS-Cov-2 Mutation Propensity", type: "Mutation Drift", status: "running", progress: 68, estTime: "45s", date: "2026-07-20 14:22" },
    { id: "SIM-002", name: "Hemoglobin Beta Chain Translation", type: "Protein Synthesis", status: "queued", progress: 0, estTime: "2m 15s", date: "2026-07-20 14:25" },
    { id: "SIM-003", name: "CRISPR Off-target Mapping", type: "Gene Mapping", status: "queued", progress: 0, estTime: "5m 10s", date: "2026-07-20 14:26" },
    { id: "SIM-004", name: "Oligo Synthesis Error Correction", type: "Alignment Refinement", status: "completed", progress: 100, estTime: "0s", date: "2026-07-20 13:45" },
    { id: "SIM-005", name: "Myoglobin Structural Conformity", type: "Folding Dynamics", status: "failed", progress: 45, estTime: "—", date: "2026-07-20 13:10" }
  ]);

  // Toast handler
  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Run dynamic progress updating for "running" simulations to make the dashboard feel alive!
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulations(prev => prev.map(sim => {
        if (sim.status === "running") {
          const nextProg = sim.progress + Math.floor(Math.random() * 5 * simSpeed);
          if (nextProg >= 100) {
            triggerToast(`Simulation ${sim.id} completed successfully!`, "success");
            return { ...sim, status: "completed", progress: 100, estTime: "0s" };
          }
          return { ...sim, progress: nextProg, estTime: `${Math.max(1, Math.round((100 - nextProg) / (2 * simSpeed)))}s` };
        }
        return sim;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [simSpeed]);

  // Statistics summaries
  const stats = useMemo(() => {
    const total = simulations.length;
    const running = simulations.filter(s => s.status === "running").length;
    const queued = simulations.filter(s => s.status === "queued").length;
    const completed = simulations.filter(s => s.status === "completed").length;
    const failed = simulations.filter(s => s.status === "failed").length;
    return { total, running, queued, completed, failed, avgRuntime: "14.2s" };
  }, [simulations]);

  // Sequence Actions
  const handleRandomize = () => {
    const bases = ["A", "T", "C", "G"];
    let randomSeq = "";
    for (let i = 0; i < 28; i++) {
      randomSeq += bases[Math.floor(Math.random() * bases.length)];
    }
    setDnaSeq(randomSeq);
    setCurrentSeqName("Custom Randomized Sequence");
    triggerToast("Randomized DNA sequence generated", "info");
  };

  const handleComplement = () => {
    const pairs = { A: "T", T: "A", C: "G", G: "C" };
    const comp = dnaSeq.split("").map(b => pairs[b] || b).join("");
    setDnaSeq(comp);
    triggerToast("Computed base pair complement", "success");
  };

  const handleTranscribe = () => {
    const rna = dnaSeq.replace(/T/g, "U");
    triggerToast(`Transcribed RNA Sequence: ${rna}`, "success");
  };

  // Simulated reports calculation
  const reportStats = useMemo(() => {
    const len = dnaSeq.length || 1;
    const gCount = (dnaSeq.match(/G/g) || []).length;
    const cCount = (dnaSeq.match(/C/g) || []).length;
    const gcPercent = Math.round(((gCount + cCount) / len) * 100);
    // Rough estimate for melting temperature: Tm = 2*(A+T) + 4*(G+C)
    const aCount = (dnaSeq.match(/A/g) || []).length;
    const tCount = (dnaSeq.match(/T/g) || []).length;
    const tm = 2 * (aCount + tCount) + 4 * (gCount + cCount);

    return { gcPercent, tm, length: len, codonBias: "Moderate (0.54)" };
  }, [dnaSeq]);

  // Mutation Preview (Diff UI)
  const mutationDiff = useMemo(() => {
    const original = dnaSeq;
    const bases = ["A", "T", "C", "G"];
    let modified = "";

    const safePos = Math.min(Math.max(0, mutationPos), original.length - 1);

    if (mutationType === "point") {
      const origBase = original[safePos] || "A";
      const otherBases = bases.filter(b => b !== origBase);
      const sub = otherBases[Math.floor((mutationRate * 10) % otherBases.length)];
      modified = original.slice(0, safePos) + sub + original.slice(safePos + 1);
    } else if (mutationType === "insertion") {
      modified = original.slice(0, safePos) + "A" + original.slice(safePos);
    } else if (mutationType === "deletion") {
      modified = original.slice(0, safePos) + original.slice(safePos + 1);
    }

    return { original, modified, pos: safePos };
  }, [dnaSeq, mutationType, mutationPos, mutationRate]);

  // Codon Translation Preview (Triplets to Amino Acids mapping)
  const translationPreview = useMemo(() => {
    const triplets = [];
    const codonMap = {
      ATG: "Met (Start)", TGG: "Trp", GAA: "Glu", GAG: "Glu", AAG: "Lys",
      CAT: "His", CTG: "Leu", ACT: "Thr", CCT: "Pro", GTG: "Val",
      TTT: "Phe", TTC: "Phe", TTA: "Leu", TTG: "Leu", GTT: "Val",
      GTC: "Val", GTA: "Val", CCG: "Pro", CCA: "Pro", CCC: "Pro",
      TAA: "Stop", TAG: "Stop", TGA: "Stop"
    };

    for (let i = 0; i < dnaSeq.length - 2; i += 3) {
      const triplet = dnaSeq.slice(i, i + 3);
      const aa = codonMap[triplet] || "Ala"; // Default fallback
      triplets.push({ codon: triplet, aa });
    }

    return triplets;
  }, [dnaSeq]);

  // Add / Trigger Simulation Actions
  const handleAddNewSimulation = () => {
    const newSim = {
      id: `SIM-00${simulations.length + 1}`,
      name: `Simulated Alignment Run - ${currentSeqName.split(" ")[0]}`,
      type: "Alignment Refinement",
      status: "queued",
      progress: 0,
      estTime: "1m 30s",
      date: new Date().toISOString().replace("T", " ").slice(0, 16)
    };
    setSimulations(prev => [newSim, ...prev]);
    triggerToast("New Simulation added to queue!", "success");
  };

  const handleStartQueue = () => {
    setSimulations(prev => prev.map(sim => {
      if (sim.status === "queued") {
        return { ...sim, status: "running" };
      }
      return sim;
    }));
    triggerToast("DNA Simulation queue started", "info");
  };

  const handleCancelSim = (id) => {
    setSimulations(prev => prev.map(sim => {
      if (sim.id === id) {
        return { ...sim, status: "failed", progress: sim.progress, estTime: "Cancelled" };
      }
      return sim;
    }));
    triggerToast(`Simulation ${id} cancelled.`, "warning");
  };

  const handleResetQueue = () => {
    setSimulations([
      { id: "SIM-001", name: "SARS-Cov-2 Mutation Propensity", type: "Mutation Drift", status: "running", progress: 68, estTime: "45s", date: "2026-07-20 14:22" },
      { id: "SIM-002", name: "Hemoglobin Beta Chain Translation", type: "Protein Synthesis", status: "queued", progress: 0, estTime: "2m 15s", date: "2026-07-20 14:25" },
      { id: "SIM-003", name: "CRISPR Off-target Mapping", type: "Gene Mapping", status: "queued", progress: 0, estTime: "5m 10s", date: "2026-07-20 14:26" }
    ]);
    triggerToast("Simulation Engine queue reset to default.", "info");
  };

  return (
    <div style={{
      background: theme.bg,
      color: theme.text1,
      minHeight: "100%",
      fontFamily: "'Inter', system-ui, sans-serif",
      transition: "background-color 0.2s, color 0.2s"
    }}>
      {/* ── Page Header ── */}
      <div style={{
        padding: "24px 20px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.surf,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: "1.6rem" }}>🧬</span>
            <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              DNA Simulation Engine
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.78rem", color: theme.text2 }}>
            Interactive controller for mapping, protein translations, genetic code analysis and mutation modeling.
          </p>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: "0.7rem",
            color: theme.cyan,
            background: `${theme.cyan}12`,
            border: `1px solid ${theme.cyan}40`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            VIRTUAL ENGINE ACTIVE
          </div>
          <button
            onClick={() => setIsLight(prev => !prev)}
            style={{
              padding: "8px 14px",
              background: theme.surf2,
              border: `1px solid ${theme.border2}`,
              borderRadius: 10,
              color: theme.text1,
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            {isLight ? "🌙 Dark Theme" : "☀️ Light Theme"}
          </button>
        </div>
      </div>

      {/* Toast Alert Component */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 99999,
          background: toast.type === "error" ? "#2a0a10" : toast.type === "warning" ? "#2a1a00" : toast.type === "success" ? "#002a1a" : "#0a0a2a",
          border: `1px solid ${toast.type === "error" ? theme.red : toast.type === "warning" ? theme.yellow : toast.type === "success" ? theme.green : theme.accent}`,
          borderRadius: 10,
          padding: "12px 18px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          boxShadow: `0 8px 32px ${theme.shadow}`,
          animation: "toastSlideIn 0.3s ease"
        }}>
          <span style={{ fontSize: 16 }}>
            {toast.type === "error" ? "⚠️" : toast.type === "warning" ? "⚡" : toast.type === "success" ? "✅" : "ℹ️"}
          </span>
          <span style={{ color: theme.text1, fontSize: "0.82rem", fontWeight: 600 }}>{toast.msg}</span>
        </div>
      )}

      {/* ── Sub Navigation Tab switcher ── */}
      <div style={{
        background: theme.surf,
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 20px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        overflowX: "auto"
      }}>
        {[
          { id: "dashboard", label: "📊 Dashboard" },
          { id: "queue", label: "📋 Queue Control" },
          { id: "sequencing", label: "🧬 Sequence Preview" },
          { id: "mutations", label: "⚡ Mutation Diff" },
          { id: "translation", label: "🧪 Translation Preview" },
          { id: "mapping", label: "🗺️ Gene Mapping" },
          { id: "reports", label: "📄 Reports & Charts" },
          { id: "settings", label: "⚙️ Engine Settings" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 16px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? `3px solid ${theme.accent}` : "3px solid transparent",
              color: activeTab === tab.id ? theme.text1 : theme.text2,
              fontSize: "0.82rem",
              fontWeight: activeTab === tab.id ? 700 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Engine Panels ── */}
      <div style={{ padding: 20 }}>

        {/* ══ 1. SIMULATION DASHBOARD ══ */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stat Cards Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
              marginBottom: 20
            }}>
              {[
                { title: "Total Simulations", value: stats.total, icon: "📂", color: theme.accent },
                { title: "Active Running", value: stats.running, icon: "⏳", color: theme.cyan },
                { title: "Queued Simulations", value: stats.queued, icon: "⌛", color: theme.yellow },
                { title: "Completed Successfully", value: stats.completed, icon: "✅", color: theme.green },
                { title: "Failed Runs", value: stats.failed, icon: "❌", color: theme.red },
                { title: "Average Runtime", value: stats.avgRuntime, icon: "⏱️", color: theme.pink }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: theme.surf,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 14,
                  padding: "16px 20px",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: stat.color
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.72rem", color: theme.text2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {stat.title}
                    </span>
                    <span style={{ fontSize: "1.1rem" }}>{stat.icon}</span>
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 900, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Control & Quick Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 20
            }}>
              {/* Quick Controller */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 20
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>
                  ⚡ Simulation Queue Engine Controller
                </h3>
                <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
                  Instantiate virtual sequencing iterations. Track performance telemetry, alignment coefficients, and computational workloads in real time.
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={handleAddNewSimulation}
                    style={{
                      padding: "10px 18px",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                      border: "none",
                      borderRadius: 9,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    🚀 Trigger New Simulation
                  </button>

                  <button
                    onClick={handleStartQueue}
                    style={{
                      padding: "10px 18px",
                      background: theme.greenGlow,
                      border: `1px solid ${theme.green}50`,
                      borderRadius: 9,
                      color: theme.green,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    ▶️ Run All Queued
                  </button>

                  <button
                    onClick={handleResetQueue}
                    style={{
                      padding: "10px 18px",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 9,
                      color: theme.text1,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    🔄 Reset Telemetry Queue
                  </button>
                </div>
              </div>

              {/* Engine Status info */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 20
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.92rem", fontWeight: 800 }}>
                  🧬 Genetic Sequence Active Profile
                </h3>
                <div style={{ fontSize: "0.75rem", color: theme.text2, lineHeight: 1.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>Active Preset:</span>
                    <strong style={{ color: theme.text1 }}>{currentSeqName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>Sequence Length:</span>
                    <strong style={{ color: theme.text1 }}>{reportStats.length} bp</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>GC Content ratio:</span>
                    <strong style={{ color: theme.green }}>{reportStats.gcPercent}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Melting Temp (Tm):</span>
                    <strong style={{ color: theme.yellow }}>{reportStats.tm}°C</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Simulation Tables Mini-view */}
            <div style={{
              background: theme.surf,
              border: `1px solid ${theme.border2}`,
              borderRadius: 14,
              padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                  📋 Live Simulation Queue Status Table
                </h3>
                <button
                  onClick={() => setActiveTab("queue")}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.accent,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  View Full Queue Control →
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border2}`, color: theme.text3 }}>
                      <th style={{ padding: "10px 8px" }}>ID</th>
                      <th style={{ padding: "10px 8px" }}>Simulation Name</th>
                      <th style={{ padding: "10px 8px" }}>Type</th>
                      <th style={{ padding: "10px 8px" }}>Status</th>
                      <th style={{ padding: "10px 8px" }}>Progress</th>
                      <th style={{ padding: "10px 8px" }}>Est. Time</th>
                      <th style={{ padding: "10px 8px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulations.slice(0, 4).map(sim => (
                      <tr key={sim.id} style={{ borderBottom: `1px solid ${theme.border2}`, transition: "all 0.15s" }}>
                        <td style={{ padding: "12px 8px", fontFamily: "monospace", fontWeight: 700 }}>{sim.id}</td>
                        <td style={{ padding: "12px 8px", color: theme.text1, fontWeight: 600 }}>{sim.name}</td>
                        <td style={{ padding: "12px 8px", color: theme.text2 }}>{sim.type}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background: sim.status === "running" ? `${theme.cyan}15` : sim.status === "completed" ? `${theme.green}15` : sim.status === "failed" ? `${theme.red}15` : `${theme.yellow}15`,
                            color: sim.status === "running" ? theme.cyan : sim.status === "completed" ? theme.green : sim.status === "failed" ? theme.red : theme.yellow
                          }}>
                            {sim.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", width: "140px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: theme.surf2, borderRadius: 2, overflow: "hidden" }}>
                              <div style={{
                                width: `${sim.progress}%`,
                                height: "100%",
                                background: sim.status === "failed" ? theme.red : theme.green,
                                borderRadius: 2
                              }} />
                            </div>
                            <span style={{ fontSize: "0.68rem", color: theme.text2 }}>{sim.progress}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 8px", color: theme.text2, fontFamily: "monospace" }}>{sim.estTime}</td>
                        <td style={{ padding: "12px 8px" }}>
                          {sim.status === "running" || sim.status === "queued" ? (
                            <button
                              onClick={() => handleCancelSim(sim.id)}
                              style={{
                                padding: "4px 8px",
                                background: "none",
                                border: `1px solid ${theme.red}30`,
                                color: theme.red,
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: "0.72rem"
                              }}
                            >
                              Cancel
                            </button>
                          ) : <span style={{ color: theme.text3 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ 2. SIMULATION QUEUE CONTROL PANEL ══ */}
        {activeTab === "queue" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>
                  📋 Enterprise Simulation Queue & Engine Scheduler
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: theme.text2 }}>
                  Verify high-throughput alignments, mutations, and coordinate models in an organized workspace.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleAddNewSimulation}
                  style={{
                    padding: "8px 14px",
                    background: theme.accent,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer"
                  }}
                >
                  + Add Custom Run
                </button>
                <button
                  onClick={handleStartQueue}
                  style={{
                    padding: "8px 14px",
                    background: theme.green,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer"
                  }}
                >
                  Start Processing
                </button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border2}`, color: theme.text3 }}>
                    <th style={{ padding: "12px 10px" }}>Run ID</th>
                    <th style={{ padding: "12px 10px" }}>Simulation Target</th>
                    <th style={{ padding: "12px 10px" }}>Modality</th>
                    <th style={{ padding: "12px 10px" }}>Status Indicator</th>
                    <th style={{ padding: "12px 10px" }}>Completed %</th>
                    <th style={{ padding: "12px 10px" }}>Est. Time Left</th>
                    <th style={{ padding: "12px 10px" }}>Initiated Date</th>
                    <th style={{ padding: "12px 10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.map(sim => (
                    <tr key={sim.id} style={{ borderBottom: `1px solid ${theme.border2}`, hover: { background: theme.surf2 } }}>
                      <td style={{ padding: "12px 10px", fontFamily: "monospace", fontWeight: 700 }}>{sim.id}</td>
                      <td style={{ padding: "12px 10px", color: theme.text1, fontWeight: 600 }}>{sim.name}</td>
                      <td style={{ padding: "12px 10px", color: theme.text2 }}>{sim.type}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 12,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: sim.status === "running" ? `${theme.cyan}12` : sim.status === "completed" ? `${theme.green}12` : sim.status === "failed" ? `${theme.red}12` : `${theme.yellow}12`,
                          color: sim.status === "running" ? theme.cyan : sim.status === "completed" ? theme.green : sim.status === "failed" ? theme.red : theme.yellow
                        }}>
                          {sim.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", width: "180px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 5, background: theme.surf2, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                              width: `${sim.progress}%`,
                              height: "100%",
                              background: sim.status === "failed" ? theme.red : sim.status === "running" ? theme.cyan : theme.green,
                              borderRadius: 3
                            }} />
                          </div>
                          <span style={{ fontSize: "0.68rem", color: theme.text2 }}>{sim.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 10px", color: theme.text2, fontFamily: "monospace" }}>{sim.estTime}</td>
                      <td style={{ padding: "12px 10px", color: theme.text3, fontSize: "0.75rem" }}>{sim.date}</td>
                      <td style={{ padding: "12px 10px" }}>
                        {sim.status === "running" || sim.status === "queued" ? (
                          <button
                            onClick={() => handleCancelSim(sim.id)}
                            style={{
                              padding: "4px 10px",
                              background: "none",
                              border: `1px solid ${theme.red}40`,
                              color: theme.red,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.72rem"
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSimulations(prev => prev.map(s => s.id === sim.id ? { ...s, status: "queued", progress: 0, estTime: "1m 15s" } : s));
                              triggerToast(`Re-enqueued simulation ${sim.id}`);
                            }}
                            style={{
                              padding: "4px 10px",
                              background: "none",
                              border: `1px solid ${theme.border2}`,
                              color: theme.text2,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.72rem"
                            }}
                          >
                            Rerun
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ 3. DNA SEQUENCE PREVIEW PANEL ══ */}
        {activeTab === "sequencing" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧬 Dynamic DNA Sequence Alignment & Presets
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Manipulate sample templates or generate random oligonucleotides. Use controls to complement base pairs or transcribe nucleotides instantly.
            </p>

            {/* Presets Row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {SAMPLE_SEQUENCES.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDnaSeq(preset.seq);
                    setCurrentSeqName(preset.name);
                    triggerToast(`Loaded: ${preset.name}`, "info");
                  }}
                  style={{
                    padding: "8px 14px",
                    background: currentSeqName === preset.name ? `${theme.accent}15` : theme.surf2,
                    border: `1px solid ${currentSeqName === preset.name ? theme.accent : theme.border2}`,
                    borderRadius: 8,
                    color: currentSeqName === preset.name ? theme.accent : theme.text2,
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Nucleobase Visualization Display */}
            <div style={{
              background: theme.surf2,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              fontFamily: "monospace"
            }}>
              <div style={{ fontSize: "0.74rem", color: theme.text3, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>🧬 5' → 3' Sense Strand Direction:</span>
                <span>{dnaSeq.length} base pairs</span>
              </div>

              {/* Graphical nucleobase chains */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {dnaSeq.split("").map((base, idx) => {
                  const bMeta = BASE_COLORS[base] || { bg: "#7c5cf6", text: "#fff" };
                  return (
                    <div key={idx} style={{
                      background: bMeta.bg,
                      color: bMeta.text,
                      width: "32px",
                      height: "38px",
                      borderRadius: 6,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 4px ${theme.shadow}`,
                      position: "relative"
                    }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>{base}</span>
                      <span style={{ fontSize: "0.55rem", opacity: 0.8, position: "absolute", bottom: 2 }}>{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sequence Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={handleRandomize}
                style={{
                  padding: "10px 16px",
                  background: theme.surf2,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 8,
                  color: theme.text1,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                🎲 Randomize Sequence
              </button>

              <button
                onClick={handleComplement}
                style={{
                  padding: "10px 16px",
                  background: theme.surf2,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 8,
                  color: theme.text1,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                🔄 Compute Complement
              </button>

              <button
                onClick={handleTranscribe}
                style={{
                  padding: "10px 16px",
                  background: `${theme.accent}12`,
                  border: `1px solid ${theme.accent}30`,
                  borderRadius: 8,
                  color: theme.accent,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Transcription (RNA)
              </button>
            </div>
          </div>
        )}

        {/* ══ 4. MUTATION SIMULATION PREVIEW (UI ONLY) ══ */}
        {activeTab === "mutations" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              ⚡ Interactive Mutation Diff Telemetry
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Choose mutation parameters. Preview predicted nucleobase insertions, deletions, or single-point sequence transitions cleanly.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16
            }}>
              {/* Controls Column */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>
                  Mutation Parameters
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>Mutation Type:</label>
                    <select
                      value={mutationType}
                      onChange={e => {
                        setMutationType(e.target.value);
                        triggerToast(`Switched to ${e.target.value} mutation model`);
                      }}
                      style={{
                        width: "100%",
                        background: theme.surf,
                        border: `1px solid ${theme.border2}`,
                        borderRadius: 6,
                        padding: 6,
                        color: theme.text1,
                        fontSize: "0.78rem"
                      }}
                    >
                      <option value="point">Single-Point Mutation</option>
                      <option value="insertion">Single Nucleotide Insertion</option>
                      <option value="deletion">Single Nucleotide Deletion</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>Target Mutation Position (index):</label>
                    <input
                      type="number"
                      min={0}
                      max={dnaSeq.length - 1}
                      value={mutationPos}
                      onChange={e => setMutationPos(Number(e.target.value))}
                      style={{
                        width: "100%",
                        background: theme.surf,
                        border: `1px solid ${theme.border2}`,
                        borderRadius: 6,
                        padding: 6,
                        color: theme.text1,
                        fontSize: "0.78rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>Frequency Rate: {(mutationRate * 100).toFixed(1)}%</label>
                    <input
                      type="range"
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      value={mutationRate}
                      onChange={e => setMutationRate(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Legend & Summary Info */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text1 }}>
                  Mutation Telemetry Insights
                </h4>
                <div style={{ fontSize: "0.74rem", color: theme.text2, lineHeight: 1.6 }}>
                  <p style={{ margin: "0 0 8px 0" }}>
                    • Point mutations simulate substitution transitions or transversions without shifting the coordinate frame.
                  </p>
                  <p style={{ margin: "0 0 8px 0" }}>
                    • Insertion and Deletion processes trigger severe frame shifts downstream from the targeted index.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <span style={{ background: `${theme.red}20`, color: theme.red, padding: "2px 8px", borderRadius: 4, fontSize: "0.65rem", fontWeight: 700 }}>Frame-shift Risk: HIGH</span>
                    <span style={{ background: `${theme.yellow}20`, color: theme.yellow, padding: "2px 8px", borderRadius: 4, fontSize: "0.65rem", fontWeight: 700 }}>Transition Ratio: 1.48</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Before-and-after visual alignment comparison */}
            <div style={{
              background: theme.surf2,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: 18,
              fontFamily: "monospace"
            }}>
              {/* Original strand */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.72rem", color: theme.text3, marginBottom: 6 }}>Original Sequence Sense Strand:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {mutationDiff.original.split("").map((base, idx) => (
                    <span key={idx} style={{
                      background: idx === mutationDiff.pos ? `${theme.yellow}22` : theme.surf,
                      border: `1px solid ${idx === mutationDiff.pos ? theme.yellow : theme.border2}`,
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: idx === mutationDiff.pos ? theme.yellow : theme.text1
                    }}>
                      {base}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modified strand */}
              <div>
                <div style={{ fontSize: "0.72rem", color: theme.text3, marginBottom: 6 }}>Mutated Alignment Strand:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {mutationDiff.modified.split("").map((base, idx) => {
                    const isMutated = idx === mutationDiff.pos;
                    return (
                      <span key={idx} style={{
                        background: isMutated ? `${theme.red}22` : theme.surf,
                        border: `1px solid ${isMutated ? theme.red : theme.border2}`,
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: isMutated ? theme.red : theme.text1
                      }}>
                        {base}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ 5. PROTEIN TRANSLATION PREVIEW (UI ONLY) ══ */}
        {activeTab === "translation" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧪 Ribosomal Translation Preview
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Analyze transcribed RNA codons mapped directly against genetic tables to synthesize virtual amino acid peptide residues.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 16
            }}>
              {/* Left Column: Stats & Settings */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text1 }}>
                    Translation Metrics
                  </h4>
                  <div style={{ fontSize: "0.75rem", color: theme.text2, lineHeight: 1.6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>Total Codons:</span>
                      <strong style={{ color: theme.text1 }}>{translationPreview.length}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>Start Codon Identified:</span>
                      <strong style={{ color: theme.green }}>
                        {dnaSeq.startsWith("ATG") ? "YES (Met)" : "NO (No ATG)"}
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>Stop Codon Included:</span>
                      <strong style={{ color: theme.yellow }}>
                        {dnaSeq.includes("TAA") || dnaSeq.includes("TAG") ? "YES" : "NO"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => triggerToast("Peptide chain verified for synthesis alignment.")}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: theme.accent,
                      border: "none",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Verify Peptide Residues
                  </button>
                </div>
              </div>

              {/* Right Column: Triplet List */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>
                  Codons Mapping Table View
                </h4>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 8,
                  maxHeight: "180px",
                  overflowY: "auto",
                  padding: "4px"
                }}>
                  {translationPreview.map((item, idx) => (
                    <div key={idx} style={{
                      background: theme.surf,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "0.64rem", color: theme.text3 }}>Codon {idx + 1}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: theme.accent, fontFamily: "monospace", margin: "2px 0" }}>
                        {item.codon}
                      </div>
                      <div style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: item.aa.includes("Met") ? theme.green : item.aa.includes("Stop") ? theme.red : theme.text2
                      }}>
                        {item.aa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ 6. GENE MAPPING PREVIEW (UI ONLY) ══ */}
        {activeTab === "mapping" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🗺️ High-Fidelity Gene Mapping Previewer
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Visualize the genome architecture timeline showing exons, introns, and promoters using interactive tooltip elements.
            </p>

            {/* Visual Timelines */}
            <div style={{
              background: theme.surf2,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${theme.border}`,
              marginBottom: 16
            }}>
              <div style={{ fontSize: "0.74rem", color: theme.text3, marginBottom: 12 }}>
                🧬 Exon-Intron Coordinate Structure mapping:
              </div>

              {/* Graphic container */}
              <div style={{ position: "relative", height: "70px", background: theme.surf, borderRadius: 8, border: `1px solid ${theme.border2}`, display: "flex", overflow: "hidden" }}>
                {/* Promoter Block */}
                <div style={{
                  width: "15%",
                  background: `linear-gradient(90deg, ${theme.yellow}30, ${theme.yellow}60)`,
                  borderRight: `2px solid ${theme.yellow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.yellow,
                  cursor: "help"
                }} title="Promoter Sequence coordinate: indices 0-150">
                  Promoter
                </div>

                {/* Exon 1 */}
                <div style={{
                  width: "25%",
                  background: `linear-gradient(90deg, ${theme.green}30, ${theme.green}60)`,
                  borderRight: `2px solid ${theme.green}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.green,
                  cursor: "help"
                }} title="Exon 1 coordinate: indices 150-400">
                  Exon 1
                </div>

                {/* Intron 1 */}
                <div style={{
                  width: "20%",
                  background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.border2} 10px, ${theme.border2} 20px)`,
                  borderRight: `2px solid ${theme.text3}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: theme.text2,
                  cursor: "help"
                }} title="Intron 1 coordinate: indices 400-600">
                  Intron 1
                </div>

                {/* Exon 2 */}
                <div style={{
                  width: "30%",
                  background: `linear-gradient(90deg, ${theme.green}30, ${theme.green}60)`,
                  borderRight: `2px solid ${theme.green}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.green,
                  cursor: "help"
                }} title="Exon 2 coordinate: indices 600-900">
                  Exon 2
                </div>

                {/* Terminator */}
                <div style={{
                  width: "10%",
                  background: `linear-gradient(90deg, ${theme.red}30, ${theme.red}60)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.red,
                  cursor: "help"
                }} title="Terminator: indices 900-1000">
                  Terminator
                </div>
              </div>

              {/* Coordinates axis */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.64rem", color: theme.text3, marginTop: 6, fontFamily: "monospace" }}>
                <span>0 bp</span>
                <span>250 bp</span>
                <span>500 bp</span>
                <span>750 bp</span>
                <span>1000 bp</span>
              </div>
            </div>

            {/* Annotation Legend cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12
            }}>
              {[
                { title: "Promoters", count: "1 Located", color: theme.yellow, desc: "Initiation coordinates for transcribed processes." },
                { title: "Exons", count: "2 Located", color: theme.green, desc: "Coding segments preserved within final RNA residue." },
                { title: "Introns", count: "1 Located", color: theme.text3, desc: "Spliced segments discarded during alignment." }
              ].map((c, idx) => (
                <div key={idx} style={{
                  background: theme.surf2,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: theme.text1 }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: "0.66rem", color: theme.text2, marginBottom: 4 }}>{c.count}</div>
                  <div style={{ fontSize: "0.64rem", color: theme.text3, lineHeight: 1.4 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 7. SIMULATION REPORTS & CHARTS ══ */}
        {activeTab === "reports" && (
          <div>
            {/* SVG Charts Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16
            }}>
              {/* Chart 1: GC Content Distribution */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 18
              }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: 800 }}>
                  📈 GC Content Density Distribution
                </h4>
                <div style={{ height: "140px", display: "flex", alignItems: "flex-end", gap: 14, padding: "10px 4px 4px" }}>
                  {[42, 58, 62, 51, 48, 65, 59].map((val, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: "100%",
                        height: `${val * 1.3}px`,
                        background: `linear-gradient(180deg, ${theme.cyan}, ${theme.accent})`,
                        borderRadius: "4px 4px 0 0"
                      }} />
                      <span style={{ fontSize: "0.65rem", color: theme.text3, marginTop: 4 }}>W{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Mutation Frequency */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 18
              }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: 800 }}>
                  📊 Codon Base Distribution
                </h4>
                <div style={{ height: "140px", display: "flex", alignItems: "flex-end", gap: 20, padding: "10px 10px 4px" }}>
                  {[
                    { label: "Adenine", count: 28, color: BASE_COLORS.A.bg },
                    { label: "Thymine", count: 22, color: BASE_COLORS.T.bg },
                    { label: "Cytosine", count: 32, color: BASE_COLORS.C.bg },
                    { label: "Guanine", count: 18, color: BASE_COLORS.G.bg }
                  ].map((codon, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: "100%",
                        height: `${codon.count * 3}px`,
                        background: codon.color,
                        borderRadius: "4px 4px 0 0"
                      }} />
                      <span style={{ fontSize: "0.64rem", color: theme.text2, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {codon.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports Block */}
            <div style={{
              background: theme.surf,
              border: `1px solid ${theme.border2}`,
              borderRadius: 14,
              padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                  📄 Diagnostic Telemetry Simulation Report
                </h3>
                <button
                  onClick={() => triggerToast("PDF alignment report exported successfully!", "success")}
                  style={{
                    padding: "6px 12px",
                    background: theme.accent,
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  📥 Export Report
                </button>
              </div>

              {/* Detailed Metrics Report body */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, fontSize: "0.78rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Target Helix Segment:</span>
                      <span style={{ color: theme.text1, fontWeight: 700 }}>{currentSeqName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>GC Content Percent:</span>
                      <span style={{ color: theme.green, fontWeight: 700 }}>{reportStats.gcPercent}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Transition Frequency:</span>
                      <span style={{ color: theme.text1 }}>0.048 mutations / kb</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Thermodynamic Tm:</span>
                      <span style={{ color: theme.yellow, fontWeight: 700 }}>{reportStats.tm}°C</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Sequence Complexity:</span>
                      <span style={{ color: theme.text1 }}>High Entropic Purity</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Codon Splicing Index:</span>
                      <span style={{ color: theme.text1 }}>0.62 (Normal)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ 8. SETTINGS PANEL ══ */}
        {activeTab === "settings" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20,
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "1rem", fontWeight: 800 }}>
              ⚙️ DNA Simulation Configuration Settings
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                  Simulation Speed Multiplier:
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 5].map(speed => (
                    <button
                      key={speed}
                      onClick={() => {
                        setSimSpeed(speed);
                        triggerToast(`Speed factor adjusted to ${speed}x`);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        background: simSpeed === speed ? `${theme.accent}15` : theme.surf2,
                        border: `1px solid ${simSpeed === speed ? theme.accent : theme.border2}`,
                        borderRadius: 6,
                        color: simSpeed === speed ? theme.accent : theme.text2,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {speed}x speed
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                  Error Tolerance Coefficient:
                </label>
                <input
                  type="number"
                  step={0.005}
                  min={0.001}
                  max={0.05}
                  value={errorTolerance}
                  onChange={e => {
                    setErrorTolerance(Number(e.target.value));
                    triggerToast("Error tolerance adjusted");
                  }}
                  style={{
                    width: "100%",
                    background: theme.surf2,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 6,
                    padding: "8px 12px",
                    color: theme.text1,
                    fontSize: "0.82rem"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                  Genetic Code Table Selection:
                </label>
                <select
                  value={codonTable}
                  onChange={e => {
                    setCodonTable(e.target.value);
                    triggerToast(`Switched translation table: ${e.target.value}`);
                  }}
                  style={{
                    width: "100%",
                    background: theme.surf2,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 6,
                    padding: "8px 12px",
                    color: theme.text1,
                    fontSize: "0.82rem"
                  }}
                >
                  <option value="standard">Standard Genetic Translation Code</option>
                  <option value="vertebrate_mito">Vertebrate Mitochondrial Code</option>
                  <option value="yeast_mito">Yeast Mitochondrial Genetic Table</option>
                </select>
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    setMutationRate(0.05);
                    setMutationType("point");
                    setMutationPos(5);
                    setSimSpeed(1);
                    setErrorTolerance(0.01);
                    setCodonTable("standard");
                    triggerToast("Restored engine default parameters");
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: theme.surf2,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 8,
                    color: theme.text2,
                    fontSize: "0.78rem",
                    cursor: "pointer"
                  }}
                >
                  Reset Defaults
                </button>
                <button
                  onClick={() => triggerToast("Simulation parameters saved and calibrated successfully", "success")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Save Calibrations
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

import React, { useState, useMemo } from "react";

// Standard Design Tokens (fallback theme)
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

const MOCK_PIPELINES = [
  {
    id: "pipe_1",
    name: "CRISPR Off-Target Screening Pipeline",
    version: "v2.1",
    status: "Running",
    createdBy: "Dr. Mei Lin",
    lastRun: "2026-07-15 08:30",
    runtime: "4m 12s",
    description: "Multi-threaded alignment pipeline mapping CRISPR-Cas9 target sites against reference assemblies using affine gap penalty matrices.",
    inputDataset: "Human Genome Reference GRCh38.p14",
    selectedAlgorithm: "CRISPR PAM Searcher v2.0",
    output: "off_target_frequency_matrix.csv",
    progress: 72,
    queuePosition: "—",
    cpuUsage: "84%",
    memUsage: "6.2 GB",
    eta: "1m 45s",
    logs: [
      { id: "log_1_1", type: "INFO", time: "08:30:02", msg: "Initializing sequence read buffers and thread pool pools." },
      { id: "log_1_2", type: "INFO", time: "08:30:15", msg: "Loading reference genome index coordinates from disk memory." },
      { id: "log_1_3", type: "SUCCESS", time: "08:31:05", msg: "Genome reference loaded (GRCh38.p14 assembly mapped)." },
      { id: "log_1_4", type: "WARNING", time: "08:32:12", msg: "GC-skew values in segment 14.2 exceed standard thresholds. Adjusting scoring." },
      { id: "log_1_5", type: "INFO", time: "08:33:45", msg: "Aligning guide-RNA mismatch vectors against chromosome boundaries." }
    ],
    results: {
      summary: "High-precision CRISPR target alignment. Detected 12 high-probability off-target locations across standard mismatch models.",
      metrics: [
        { label: "Alignment Sensitivity", value: "99.85%" },
        { label: "Mismatch Tolerance Max", value: "3 base pairs" },
        { label: "Target G-C Bias Coefficient", value: "0.64" }
      ],
      chartData: [45, 62, 78, 92, 110, 115]
    }
  },
  {
    id: "pipe_2",
    name: "Phylogenetic Lineage Mapping Network",
    version: "v1.4",
    status: "Completed",
    createdBy: "Sarah Kim",
    lastRun: "2026-07-14 14:15",
    runtime: "12m 45s",
    description: "Constructs mutational traceback nodes and lineage trees from RNA sequence read maps.",
    inputDataset: "SARS-CoV-2 Phylogenetic Variant Map",
    selectedAlgorithm: "Base Aligner v1.1.0",
    output: "lineage_traceback_graph.json",
    progress: 100,
    queuePosition: "—",
    cpuUsage: "0%",
    memUsage: "0 GB",
    eta: "0s",
    logs: [
      { id: "log_2_1", type: "INFO", time: "14:15:00", msg: "Phylogenetic alignment task initialized." },
      { id: "log_2_2", type: "INFO", time: "14:16:30", msg: "Assembling traceback matrices across low-quality sequence maps." },
      { id: "log_2_3", type: "SUCCESS", time: "14:27:45", msg: "Pipeline execution completed cleanly. Graph tree output exported." }
    ],
    results: {
      summary: "Reconstructed mutational network for BA.5 lineages. Confirmed European clades remain evolutionary drivers.",
      metrics: [
        { label: "Lineage Tree Clades", value: "24 mapped clades" },
        { label: "Network Edge Reliability", value: "94.8%" },
        { label: "Variant Clustered Density", value: "0.82" }
      ],
      chartData: [12, 28, 54, 82, 102, 128]
    }
  },
  {
    id: "pipe_3",
    name: "Crystalline Torsional Shear Analyzer",
    version: "v1.0",
    status: "Queued",
    createdBy: "Alex Chen",
    lastRun: "Pending",
    runtime: "—",
    description: "Models chemical force fields and amino-acid sequence torsional rotations for protein structural configurations.",
    inputDataset: "Myoglobin Torsional Shear Matrices",
    selectedAlgorithm: "Double Helix 3D Simulator v1.0",
    output: "torsional_stress_tolerances.pdf",
    progress: 0,
    queuePosition: "2nd in queue",
    cpuUsage: "0%",
    memUsage: "0 GB",
    eta: "Est: 4m 30s",
    logs: [
      { id: "log_3_1", type: "INFO", time: "Pending", msg: "Pipeline queued. Waiting for core compute allocation availability." }
    ],
    results: {
      summary: "Results will be compiled and displayed once the execution run has completed.",
      metrics: [],
      chartData: []
    }
  },
  {
    id: "pipe_4",
    name: "Mitochondrial DNA Mutation Pipeline",
    version: "v3.0",
    status: "Failed",
    createdBy: "Dr. Mei Lin",
    lastRun: "2026-07-12 11:10",
    runtime: "1m 15s",
    description: "Scans circular mitochondrial assemblies for pathogenic heteroplasmy variations.",
    inputDataset: "MitoSeq Patient Samples",
    selectedAlgorithm: "MitoVariant Scouter v3.0",
    output: "None (Run aborted)",
    progress: 15,
    queuePosition: "—",
    cpuUsage: "0%",
    memUsage: "0 GB",
    eta: "—",
    logs: [
      { id: "log_4_1", type: "INFO", time: "11:10:01", msg: "Mitochondrial assembly screening initiated." },
      { id: "log_4_2", type: "ERROR", time: "11:11:16", msg: "Buffer overflow detected at FASTA header index 415. Pathological size bounds exceeded. Terminating execution." }
    ],
    results: {
      summary: "Run failed during the validation phase due to input parameter boundary errors.",
      metrics: [],
      chartData: []
    }
  }
];

const TEMPLATES = [
  { name: "DNA Alignment", desc: "Sequence read alignments against large reference genomes.", icon: "🧬" },
  { name: "Genome Analysis", desc: "Variant discovery and annotations pipelines.", icon: "📊" },
  { name: "Mutation Detection", desc: "Heteroplasmy and single nucleotide variant scoring.", icon: "🔬" },
  { name: "Protein Prediction", desc: " rotamer coordinates and mechanical folder simulations.", icon: "💎" },
  { name: "Gene Mapping", desc: "Traceback lineage matrices and genomic locus charts.", icon: "🗺️" }
];

export default function PipelineEngine({ T = DEFAULT_T }) {
  const [pipelines, setPipelines] = useState(MOCK_PIPELINES);
  const [selectedPipelineId, setSelectedPipelineId] = useState("pipe_1");
  const [toastMessage, setToastMessage] = useState(null);
  const [resultsTab, setResultsTab] = useState("summary");

  // Settings states
  const [autoSave, setAutoSave] = useState(true);
  const [retryFailed, setRetryFailed] = useState(false);
  const [parallelExec, setParallelExecution] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Selected object helper
  const selectedPipeline = useMemo(() => {
    return pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];
  }, [pipelines, selectedPipelineId]);

  // Toast trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Status variables calculation
  const stats = useMemo(() => {
    const total = pipelines.length;
    const running = pipelines.filter(p => p.status === "Running").length;
    const queued = pipelines.filter(p => p.status === "Queued").length;
    const failed = pipelines.filter(p => p.status === "Failed").length;
    const completed = pipelines.filter(p => p.status === "Completed").length;
    const avgRuntime = "5m 57s";

    return { total, running, queued, failed, completed, avgRuntime };
  }, [pipelines]);

  // Actions
  const handleRunPipeline = (id) => {
    setPipelines(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: "Running",
          progress: 5,
          eta: "3m 45s",
          cpuUsage: "45%",
          memUsage: "2.8 GB",
          logs: [
            ...p.logs,
            { id: `log_run_${Date.now()}`, type: "INFO", time: new Date().toLocaleTimeString(), msg: "Manual pipeline re-execution sequence triggered." }
          ]
        };
      }
      return p;
    }));
    triggerToast(`Execution sequence triggered for: ${pipelines.find(p => p.id === id)?.name}`);
  };

  const handleDuplicatePipeline = (pipe) => {
    const duplicated = {
      ...pipe,
      id: `pipe_${Date.now()}`,
      name: `${pipe.name} (Copy)`,
      status: "Queued",
      progress: 0,
      queuePosition: "3rd in queue",
      lastRun: "Pending",
      runtime: "—",
      eta: "Est: 6m 15s",
      logs: [
        { id: `log_dup_${Date.now()}`, type: "INFO", time: "Pending", msg: "Pipeline duplicated. Placed in wait state queue." }
      ]
    };
    setPipelines(prev => [...prev, duplicated]);
    triggerToast(`Duplicated "${pipe.name}".`);
  };

  const handleStopPipeline = (id) => {
    setPipelines(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: "Failed",
          progress: p.progress,
          eta: "—",
          cpuUsage: "0%",
          memUsage: "0 GB",
          logs: [
            ...p.logs,
            { id: `log_stop_${Date.now()}`, type: "ERROR", time: new Date().toLocaleTimeString(), msg: "Execution sequence terminated by administrator request." }
          ]
        };
      }
      return p;
    }));
    triggerToast(`Terminated pipeline.`);
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
      {toastMessage && (
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

      {/* ── HEADER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px",
        borderBottom: `1px solid ${T.border}`,
        paddingBottom: "16px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "1.6rem" }}>⛓️</span>
            <h1 style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: T.text1
            }}>
              DNA Pipeline Engine
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Build, execute, and monitor sequence alignment, mutation detection, and protein prediction pipelines.
          </p>
        </div>
      </div>

      {/* ── PIPELINE DASHBOARD STATISTICS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "14px",
        marginBottom: "24px"
      }}>
        {[
          { label: "Total Pipelines", val: stats.total, color: T.accent, icon: "⛓️" },
          { label: "Running", val: stats.running, color: T.cyan, icon: "⚡" },
          { label: "Queued", val: stats.queued, color: T.yellow, icon: "⏳" },
          { label: "Failed", val: stats.failed, color: T.red, icon: "❌" },
          { label: "Completed", val: stats.completed, color: T.green, icon: "✅" },
          { label: "Average Runtime", val: stats.avgRuntime, color: T.pink, icon: "⏱️" }
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "12px",
              padding: "14px 16px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: stat.color }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.72rem", color: T.text2, fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
              <span style={{ fontSize: "0.9rem" }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: T.text1 }}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* ── WORKSPACE SPLIT LAYOUT ── */}
      <div style={{
        display: "flex",
        gap: "24px",
        flexWrap: "wrap",
        flex: 1
      }}>
        {/* LEFT COLUMN: Pipeline List & Pipeline Builder */}
        <div style={{
          flex: "2 1 600px",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Pipelines List */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px",
            boxSizing: "border-box"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", fontWeight: 800 }}>📂 Registered Genomic Pipelines</h3>

            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.78rem",
                textAlign: "left"
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T.border2}`, color: T.text2 }}>
                    <th style={{ padding: "10px" }}>Pipeline Name</th>
                    <th style={{ padding: "10px" }}>Version</th>
                    <th style={{ padding: "10px" }}>Status</th>
                    <th style={{ padding: "10px" }}>Created By</th>
                    <th style={{ padding: "10px" }}>Last Run</th>
                    <th style={{ padding: "10px" }}>Runtime</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelines.map(pipe => {
                    const isSelected = selectedPipelineId === pipe.id;
                    let statColor = T.yellow;
                    if (pipe.status === "Completed") statColor = T.green;
                    if (pipe.status === "Running") statColor = T.cyan;
                    if (pipe.status === "Failed") statColor = T.red;

                    return (
                      <tr
                        key={pipe.id}
                        onClick={() => {
                          setSelectedPipelineId(pipe.id);
                          setResultsTab("summary");
                          triggerToast(`Switched pipeline context to: ${pipe.name}`);
                        }}
                        style={{
                          borderBottom: `1px solid ${T.border}`,
                          background: isSelected ? `${T.accent}12` : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s"
                        }}
                      >
                        <td style={{ padding: "12px 10px", fontWeight: 700, color: T.text1 }}>{pipe.name}</td>
                        <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{pipe.version}</td>
                        <td style={{ padding: "12px 10px" }}>
                          <span style={{
                            fontSize: "0.64rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: `${statColor}12`,
                            border: `1px solid ${statColor}30`,
                            color: statColor
                          }}>
                            {pipe.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px" }}>{pipe.createdBy}</td>
                        <td style={{ padding: "12px 10px", color: T.text2 }}>{pipe.lastRun}</td>
                        <td style={{ padding: "12px 10px", fontFamily: "monospace" }}>{pipe.runtime}</td>
                        <td style={{ padding: "12px 10px" }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {pipe.status === "Running" ? (
                              <button
                                onClick={() => handleStopPipeline(pipe.id)}
                                style={{ background: T.surf2, border: `1px solid ${T.border2}`, color: T.red, padding: "3px 6px", borderRadius: "4px", cursor: "pointer" }}
                              >
                                Stop
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRunPipeline(pipe.id)}
                                style={{ background: T.surf2, border: `1px solid ${T.border2}`, color: T.green, padding: "3px 6px", borderRadius: "4px", cursor: "pointer" }}
                              >
                                Run
                              </button>
                            )}
                            <button
                              onClick={() => handleDuplicatePipeline(pipe)}
                              style={{ background: T.surf2, border: `1px solid ${T.border2}`, color: T.yellow, padding: "3px 6px", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Dup
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pipeline Builder: Connected nodes visual editor (UI ONLY) */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", fontWeight: 800 }}>🛠️ Pipeline Builder: Visual Node Flow</h3>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              background: T.surf2,
              border: `1px solid ${T.border}`,
              borderRadius: "12px",
              padding: "20px",
              overflowX: "auto"
            }}>
              {[
                { type: "Dataset Input", label: selectedPipeline?.inputDataset?.split(" ")[0] || "In", color: T.pink, icon: "📥" },
                { type: "DNA Sequence", label: "Read Mapping", color: T.yellow, icon: "🧬" },
                { type: "Algorithm", label: selectedPipeline?.selectedAlgorithm?.split(" ")[0] || "PAM", color: T.cyan, icon: "⚙️" },
                { type: "Validation", label: "Heteroplasmy", color: T.accent, icon: "🛡️" },
                { type: "Analysis", label: "Scoring Matrix", color: T.accent2, icon: "📊" },
                { type: "Report", label: selectedPipeline?.output?.split(".")[0] || "PDF", color: T.green, icon: "📄" }
              ].map((node, index, arr) => (
                <React.Fragment key={node.type}>
                  {/* Node box */}
                  <div style={{
                    background: T.surf,
                    border: `1px solid ${node.color}50`,
                    boxShadow: `0 4px 10px ${node.color}15`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    minWidth: "110px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>{node.icon}</span>
                    <strong style={{ fontSize: "0.68rem", color: T.text1, textTransform: "uppercase" }}>{node.type}</strong>
                    <span style={{ fontSize: "0.64rem", color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "90px" }}>{node.label}</span>
                  </div>

                  {/* Connector arrow */}
                  {index < arr.length - 1 && (
                    <div style={{
                      color: T.text3,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      ➔
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pipeline Details, Monitor, Logs, Settings, Templates, Results */}
        <div style={{
          flex: "1 1 350px",
          minWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Pipeline Details Sidebar */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "0.95rem", fontWeight: 800 }}>📋 Pipeline Configuration</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.78rem" }}>
              <div>
                <label style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Pipeline Name</label>
                <div style={{ color: T.text1, fontWeight: "bold", marginTop: "2px" }}>{selectedPipeline.name}</div>
              </div>

              <div>
                <label style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Description</label>
                <div style={{ color: T.text2, lineHeight: 1.4, marginTop: "2px" }}>{selectedPipeline.description}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Input Dataset</label>
                  <div style={{ color: T.text2, marginTop: "2px" }}>{selectedPipeline.inputDataset}</div>
                </div>
                <div>
                  <label style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Algorithm</label>
                  <div style={{ color: T.cyan, marginTop: "2px" }}>{selectedPipeline.selectedAlgorithm}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Output</label>
                  <div style={{ color: T.text2, marginTop: "2px" }}>{selectedPipeline.output}</div>
                </div>
                <div>
                  <label style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Runtime</label>
                  <div style={{ color: T.text1, marginTop: "2px" }}>{selectedPipeline.runtime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Monitor Card */}
          {selectedPipeline && (
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "20px"
            }}>
              <h3 style={{ margin: "0 0 14px 0", fontSize: "0.9rem", fontWeight: 800 }}>⚡ Live Execution Monitor</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.76rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>Pipeline Progress</span>
                    <strong>{selectedPipeline.progress}%</strong>
                  </div>
                  <div style={{ height: "6px", background: T.surf2, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${selectedPipeline.progress}%`, background: T.accent, borderRadius: "3px", transition: "width 0.3s" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: T.surf2, padding: "8px 10px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "0.6rem", color: T.text3 }}>CPU Load</div>
                    <strong style={{ color: T.cyan, fontSize: "0.85rem" }}>{selectedPipeline.cpuUsage}</strong>
                  </div>
                  <div style={{ background: T.surf2, padding: "8px 10px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "0.6rem", color: T.text3 }}>Memory Allocation</div>
                    <strong style={{ color: T.pink, fontSize: "0.85rem" }}>{selectedPipeline.memUsage}</strong>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: T.surf2, padding: "8px 10px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "0.6rem", color: T.text3 }}>Queue Position</div>
                    <strong style={{ color: T.yellow, fontSize: "0.85rem" }}>{selectedPipeline.queuePosition}</strong>
                  </div>
                  <div style={{ background: T.surf2, padding: "8px 10px", borderRadius: "6px", border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "0.6rem", color: T.text3 }}>ETA Remaining</div>
                    <strong style={{ color: T.green, fontSize: "0.85rem" }}>{selectedPipeline.eta}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Execution Logs */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800 }}>📜 Live Execution Logs</h3>

            <div style={{
              background: T.surf2,
              border: `1px solid ${T.border}`,
              borderRadius: "8px",
              padding: "10px",
              maxHeight: "150px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontFamily: "monospace",
              fontSize: "0.68rem"
            }}>
              {selectedPipeline.logs.map(log => {
                let logCol = T.text2;
                if (log.type === "SUCCESS") logCol = T.green;
                if (log.type === "WARNING") logCol = T.yellow;
                if (log.type === "ERROR") logCol = T.red;

                return (
                  <div key={log.id} style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                    <span style={{ color: T.text3 }}>[{log.time}]</span>
                    <strong style={{ color: logCol, flexShrink: 0 }}>{log.type}</strong>
                    <span style={{ color: T.text2 }}>{log.msg}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Viewer: Tabs (Summary, Metrics, Charts, Export) */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800 }}>📊 Results Viewer</h3>

            <div style={{
              display: "flex",
              background: T.surf2,
              border: `1px solid ${T.border}`,
              borderRadius: "6px",
              padding: "3px",
              gap: "3px",
              marginBottom: "12px"
            }}>
              {["summary", "metrics", "export"].map(rTab => (
                <button
                  key={rTab}
                  onClick={() => setResultsTab(rTab)}
                  style={{
                    flex: 1,
                    padding: "4px 8px",
                    background: resultsTab === rTab ? T.border2 : "transparent",
                    border: "none",
                    borderRadius: "4px",
                    color: resultsTab === rTab ? T.text1 : T.text2,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {rTab}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "0.76rem", color: T.text2, minHeight: "80px" }}>
              {resultsTab === "summary" && (
                <div style={{ lineHeight: 1.4 }}>{selectedPipeline.results.summary}</div>
              )}
              {resultsTab === "metrics" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedPipeline.results.metrics.length === 0 ? (
                    <div style={{ color: T.text3, textAlign: "center", padding: "10px" }}>No metrics loaded.</div>
                  ) : (
                    selectedPipeline.results.metrics.map(met => (
                      <div key={met.label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{met.label}</span>
                        <strong style={{ color: T.cyan }}>{met.value}</strong>
                      </div>
                    ))
                  )}
                </div>
              )}
              {resultsTab === "export" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "0.72rem" }}>Choose an output format to export compile metrics:</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button onClick={() => triggerToast("Exporting matrix as Excel...")} style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "4px", color: T.text1, padding: "5px", fontSize: "0.68rem", cursor: "pointer" }}>Excel</button>
                    <button onClick={() => triggerToast("Exporting parameters as JSON...")} style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "4px", color: T.text1, padding: "5px", fontSize: "0.68rem", cursor: "pointer" }}>JSON</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pipeline Templates */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800 }}>🎨 Pipeline Templates</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TEMPLATES.map(temp => (
                <div
                  key={temp.name}
                  onClick={() => {
                    triggerToast(`Template initialized: ${temp.name}`);
                  }}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border}`,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    transition: "border-color 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                >
                  <span style={{ fontSize: "1.2rem" }}>{temp.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: "0.76rem", color: T.text1, display: "block" }}>{temp.name}</strong>
                    <span style={{ fontSize: "0.66rem", color: T.text2, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{temp.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Settings (UI Only) */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800 }}>⚙️ Engine Settings</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.76rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Auto-Save Configurations</span>
                <input type="checkbox" checked={autoSave} onChange={e => setAutoSave(e.target.checked)} style={{ cursor: "pointer" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Retry Failed Pipeline Steps</span>
                <input type="checkbox" checked={retryFailed} onChange={e => setRetryFailed(e.target.checked)} style={{ cursor: "pointer" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Parallel Thread Execution</span>
                <input type="checkbox" checked={parallelExec} onChange={e => setParallelExecution(e.target.checked)} style={{ cursor: "pointer" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>System Status Notifications</span>
                <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} style={{ cursor: "pointer" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

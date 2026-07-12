import React, { useState, useMemo } from "react";

// Design Tokens for Light/Dark themes with premium glassmorphism
const THEME = {
  dark: {
    bg: "#05050f",
    surf: "rgba(11, 11, 24, 0.75)",
    surf2: "rgba(15, 15, 30, 0.6)",
    border: "rgba(255, 255, 255, 0.08)",
    border2: "rgba(255, 255, 255, 0.15)",
    text1: "#f0f2ff",
    text2: "#8890b0",
    text3: "#444868",
    accent: "#5b5ef4",
    accent2: "#7c5cf6",
    accentGlow: "rgba(91, 94, 244, 0.2)",
    green: "#22d3a5",
    greenGlow: "rgba(34, 211, 165, 0.15)",
    red: "#f04060",
    yellow: "#f5a623",
    yellowGlow: "rgba(245, 166, 35, 0.15)",
    cyan: "#00d4ff",
    glass: "rgba(11, 11, 24, 0.85)",
    shadow: "rgba(0, 0, 0, 0.6)",
    cardBg: "rgba(15, 15, 30, 0.45)",
    glassBorder: "rgba(255, 255, 255, 0.05)"
  },
  light: {
    bg: "#f3f4f6",
    surf: "rgba(255, 255, 255, 0.75)",
    surf2: "rgba(241, 245, 249, 0.6)",
    border: "rgba(15, 23, 42, 0.08)",
    border2: "rgba(15, 23, 42, 0.15)",
    text1: "#0f172a",
    text2: "#475569",
    text3: "#94a3b8",
    accent: "#2563eb",
    accent2: "#4f46e5",
    accentGlow: "rgba(37, 99, 235, 0.15)",
    green: "#059669",
    greenGlow: "rgba(5, 150, 105, 0.15)",
    red: "#dc2626",
    yellow: "#d97706",
    yellowGlow: "rgba(217, 119, 6, 0.15)",
    cyan: "#0891b2",
    glass: "rgba(255, 255, 255, 0.85)",
    shadow: "rgba(15, 23, 42, 0.06)",
    cardBg: "rgba(241, 245, 249, 0.45)",
    glassBorder: "rgba(15, 23, 42, 0.04)"
  }
};

// Original 10 experimental modules
const LAB_MODULES = [
  {
    id: "dna",
    title: "DNA Research",
    icon: "🧬",
    category: "Biomedical",
    description: "Map nucleobase alignments and sequence experimental genomes to discover biological structures.",
    stats: { sequenceRate: "3.2 Gbps", alignmentAccuracy: "99.98%", activeSimulations: "4" }
  },
  {
    id: "ai",
    title: "AI Research",
    icon: "🤖",
    category: "Digital",
    description: "Train and evaluate advanced deep neural networks, custom transformer systems, and heuristics.",
    stats: { trainingEpochs: "14,200", lossRate: "0.024", modelSize: "180B parameters" }
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    icon: "⚛️",
    category: "Digital",
    description: "Perform qubit calibration and super-position simulations to analyze encryption-grade quantum decoherence.",
    stats: { logicalQubits: "128", coherenceTime: "240μs", gateFidelity: "99.992%" }
  },
  {
    id: "robotics",
    title: "Robotics",
    icon: "🦾",
    category: "Engineering",
    description: "Simulate kinematic actuation, multi-joint coordination, and spatial pathfinding in real-time.",
    stats: { feedbackLoop: "0.4ms", degreesOfFreedom: "32", payloadCapacity: "12.5kg" }
  },
  {
    id: "space",
    title: "Space Technology",
    icon: "🚀",
    category: "Engineering",
    description: "Model satellite orbital trajectories, atmospheric re-entry conditions, and spacecraft telemetry.",
    stats: { orbitalSpeed: "7.8 km/s", telemetryChannels: "48", signalLatency: "1.2s" }
  },
  {
    id: "biotech",
    title: "Biotechnology",
    icon: "🧪",
    category: "Biomedical",
    description: "Synthesize bioreactor enzymes and engineer metabolic pathways for cellular bio-manufacturing.",
    stats: { yieldEfficiency: "94.2%", batchConsistency: "99.1%", tempControl: "±0.05°C" }
  },
  {
    id: "materials",
    title: "Materials Science",
    icon: "💎",
    category: "Engineering",
    description: "Analyze molecular strain and crystalline lattices of super-alloys and high-temperature superconductors.",
    stats: { tensileStrength: "4.8 GPa", latticePurity: "99.999%", meltingPoint: "2,450°C" }
  },
  {
    id: "energy",
    title: "Energy Research",
    icon: "⚡",
    category: "Engineering",
    description: "Evaluate lithium-sulfur chemical cycles, fuel-cell density, and virtual smart-grid micro-turbines.",
    stats: { energyDensity: "480 Wh/kg", efficiencyRatio: "89.4%", storageCycles: "10k" }
  },
  {
    id: "medical",
    title: "Medical Research",
    icon: "🩺",
    category: "Biomedical",
    description: "Conduct in-silico clinical trial models, tumor vascular mapping, and targeted drug delivery simulations.",
    stats: { cellTargeting: "98.7%", toxicityIndex: "0.01", simulationCohorts: "5,000" }
  },
  {
    id: "custom",
    title: "Custom Projects",
    icon: "🛠️",
    category: "Special",
    description: "Bootstrap bespoke experimental setups, sandboxes, and custom technology incubation fields.",
    stats: { customSandboxCount: "3", allocatedResources: "Variable", isolationLevel: "Maximum" }
  }
];

// Sidebar navigation structure (now has 9 sections, starting with Dashboard!)
const SIDEBAR_SECTIONS = [
  { id: "dashboard", label: "Research Dashboard", icon: "📊" },
  { id: "dna_research", label: "DNA Research", icon: "🧬" },
  { id: "algorithms", label: "Algorithms", icon: "🧮" },
  { id: "ai_models", label: "AI Models", icon: "🧠" },
  { id: "simulations", label: "Simulations", icon: "🧪" },
  { id: "datasets", label: "Datasets", icon: "📁" },
  { id: "experiments", label: "Experiments", icon: "🔬" },
  { id: "notes", label: "Notes", icon: "📝" },
  { id: "settings", label: "Settings", icon: "⚙️" }
];

// Recent Research table mock data
const RECENT_RESEARCH_DATA = [
  { name: "Alpha-Helix Alignment Matrix", category: "DNA Research", status: "Active", progress: 85, updated: "2 hours ago" },
  { name: "Neuro-Adaptive Weight Mapping", category: "AI Models", status: "Completed", progress: 100, updated: "4 hours ago" },
  { name: "Kinematic Path Calibration", category: "Simulations", status: "Running", progress: 62, updated: "1 day ago" },
  { name: "Superconducting Lattice Shift", category: "Experiments", status: "Paused", progress: 40, updated: "2 days ago" },
  { name: "Smart-Grid Voltage Balance", category: "Algorithms", status: "Active", progress: 91, updated: "3 days ago" }
];

// Recent Activity Timeline mock data
const RECENT_ACTIVITIES = [
  { id: 1, event: "Completed mapping on human-genome-hgp-v4.csv", time: "10 mins ago", icon: "🧬", color: "#22d3a5" },
  { id: 2, event: "Initiated coherence stress test calibration on Qubit simulator", time: "45 mins ago", icon: "⚛️", color: "#00d4ff" },
  { id: 3, event: "Adjusted attention learning weights to 180B model parameter", time: "2 hours ago", icon: "🧠", color: "#7c5cf6" },
  { id: 4, event: "Imported telemetry path data orbital-trajectory-sc.json", time: "1 day ago", icon: "🚀", color: "#f5a623" }
];

// Glassmorphism wrapper card component
const GlassCard = ({ children, theme, style }) => (
  <div style={{
    background: theme.surf,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0 8px 32px 0 ${theme.shadow}`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    ...style
  }}>
    {children}
  </div>
);

export default function ResearchLab() {
  const [isLight, setIsLight] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeLabDetail, setActiveLabDetail] = useState(null);

  // Dynamic console/alert logs for quick actions
  const [consoleLog, setConsoleLog] = useState("");
  const [showConsole, setShowConsole] = useState(false);

  // Notes state
  const [userNotes, setUserNotes] = useState([
    { id: 1, title: "Qubit Decoherence Strategy", body: "Focus optimization on lower-temperature superconductor alloy crystalline structures.", date: "July 12, 2025" },
    { id: 2, title: "CRISPR Genome Bounds", body: "Set nucleobase bounds dynamically utilizing DNA Research Alignment Matrix v2.", date: "July 10, 2025" }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");

  const theme = isLight ? THEME.light : THEME.dark;

  // Filter sidebar sections based on search query
  const filteredSidebarSections = useMemo(() => {
    return SIDEBAR_SECTIONS.filter(section =>
      section.label.toLowerCase().includes(sidebarSearch.toLowerCase())
    );
  }, [sidebarSearch]);

  // Filter 10 labs modules
  const filteredModules = useMemo(() => {
    return LAB_MODULES.filter(lab => {
      const matchesSearch = lab.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                            lab.description.toLowerCase().includes(moduleSearch.toLowerCase());
      const matchesCat = categoryFilter === "All" || lab.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [moduleSearch, categoryFilter]);

  const categories = ["All", "Biomedical", "Digital", "Engineering", "Special"];

  // Toggle sidebar
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Log action simulator helper
  const triggerAction = (actionName) => {
    setShowConsole(true);
    setConsoleLog(`&gt; Initializing sequence: ${actionName}...\n&gt; Deploying secure compilation telemetry...\n&gt; Command loaded successfully.\n&gt; Status: SIMULATION READY (Coming Soon)`);
  };

  // Add notes locally
  const addNote = () => {
    if (!newNoteTitle.trim()) return;
    const note = {
      id: Date.now(),
      title: newNoteTitle,
      body: newNoteBody,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };
    setUserNotes([note, ...userNotes]);
    setNewNoteTitle("");
    setNewNoteBody("");
  };

  return (
    <div style={{
      background: theme.bg,
      color: theme.text1,
      height: "100%",
      display: "flex",
      flexDirection: "row",
      transition: "background-color 0.2s, color 0.2s",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden"
    }}>
      {/* LEFT SIDEBAR */}
      <aside style={{
        width: sidebarCollapsed ? 68 : 240,
        background: theme.surf,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: "16px 14px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.2rem" }}>🔮</span>
              <span style={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "1px", color: theme.text1 }}>LAB CONTROL</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            style={{
              background: theme.surf2,
              border: `1px solid ${theme.border2}`,
              borderRadius: 6,
              color: theme.text2,
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: "0.72rem",
              marginLeft: sidebarCollapsed ? "auto" : "0"
            }}
          >
            {sidebarCollapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Sidebar Search */}
        {!sidebarCollapsed && (
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${theme.border}` }}>
            <input
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              placeholder="🔍 Filter controls..."
              style={{
                width: "100%",
                background: theme.surf2,
                border: `1px solid ${theme.border2}`,
                borderRadius: 8,
                padding: "6px 10px",
                color: theme.text1,
                fontSize: "0.78rem",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {filteredSidebarSections.map(section => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                title={sidebarCollapsed ? section.label : undefined}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: isActive ? `${theme.accent}18` : "transparent",
                  color: isActive ? theme.accent : theme.text2,
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 700 : 400,
                  cursor: "pointer",
                  marginBottom: 3,
                  transition: "all 0.15s",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start"
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{section.icon}</span>
                {!sidebarCollapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{section.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapsed view status indicator */}
        <div style={{
          padding: "12px",
          borderTop: `1px solid ${theme.border}`,
          textAlign: "center",
          fontSize: "0.6rem",
          color: theme.text3
        }}>
          {sidebarCollapsed ? "🔒 v1" : "SECURE SHELL v1.0"}
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Workspace Sub-Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.surf,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: "1.1rem" }}>🧬</span>
              <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
                Enterprise Research Dashboard
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: theme.text2 }}>
              Managing and analyzing advanced innovation initiatives across deep-tech modules.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              fontSize: "0.68rem",
              color: theme.cyan,
              background: `${theme.cyan}12`,
              border: `1px solid ${theme.cyan}30`,
              padding: "4px 10px",
              borderRadius: 20,
              fontWeight: 700
            }}>
              DASHBOARD v1.0
            </div>
            <button
              onClick={() => setIsLight(prev => !prev)}
              style={{
                padding: "6px 12px",
                background: theme.surf2,
                border: `1px solid ${theme.border2}`,
                borderRadius: 8,
                color: theme.text1,
                fontSize: "0.74rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {isLight ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>

        {/* DYNAMIC VIEW CONTAINER */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {/* SECTION 1: RESEARCH DASHBOARD UI */}
          {activeSection === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Stat Logs Overlay Panel if Quick Action triggered */}
              {showConsole && (
                <div style={{
                  background: isLight ? "#0f172a" : "#02020a",
                  border: `1px solid ${isLight ? "#334155" : "#1e1e35"}`,
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#38bdf8",
                  position: "relative"
                }}>
                  <button
                    onClick={() => setShowConsole(false)}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 12,
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >✕</button>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: consoleLog }} />
                </div>
              )}

              {/* 1. Research Overview (Glassmorphism Cards) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 14
              }}>
                {[
                  { title: "Total Projects", value: "10", icon: "📁", color: theme.accent },
                  { title: "Active Experiments", value: "4", icon: "🔬", color: theme.cyan },
                  { title: "Running Algorithms", value: "2", icon: "🧮", color: theme.green },
                  { title: "AI Models", value: "180B Base", icon: "🧠", color: theme.yellow },
                  { title: "Success Rate", value: "99.98%", icon: "📈", color: theme.cyan }
                ].map((stat, idx) => (
                  <GlassCard key={idx} theme={theme} style={{ padding: "16px 18px", border: `1px solid ${stat.color}25` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "0.72rem", color: theme.text2, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.title}</span>
                      <span style={{ fontSize: "1.1rem" }}>{stat.icon}</span>
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  </GlassCard>
                ))}
              </div>

              {/* Responsive Layout Grid for Table, Actions, Timeline, Charts */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
                alignItems: "start"
              }}>

                {/* LEFT MAIN PANELS */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* 2. Recent Research Table */}
                  <GlassCard theme={theme}>
                    <h3 style={{ margin: "0 0 14px 0", fontSize: "0.95rem", fontWeight: 800 }}>📂 Recent Research Initiatives</h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <th style={{ padding: "10px", fontSize: "0.74rem", color: theme.text3 }}>Name</th>
                            <th style={{ padding: "10px", fontSize: "0.74rem", color: theme.text3 }}>Category</th>
                            <th style={{ padding: "10px", fontSize: "0.74rem", color: theme.text3 }}>Status</th>
                            <th style={{ padding: "10px", fontSize: "0.74rem", color: theme.text3 }}>Progress</th>
                            <th style={{ padding: "10px", fontSize: "0.74rem", color: theme.text3 }}>Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RECENT_RESEARCH_DATA.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: idx < RECENT_RESEARCH_DATA.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                              <td style={{ padding: "12px 10px", fontSize: "0.78rem", fontWeight: 700 }}>{row.name}</td>
                              <td style={{ padding: "12px 10px", fontSize: "0.76rem", color: theme.text2 }}>{row.category}</td>
                              <td style={{ padding: "12px 10px" }}>
                                <span style={{
                                  background: row.status === "Completed" ? theme.greenGlow : theme.yellowGlow,
                                  color: row.status === "Completed" ? theme.green : theme.yellow,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  fontSize: "0.64rem",
                                  fontWeight: 700
                                }}>{row.status}</span>
                              </td>
                              <td style={{ padding: "12px 10px", minWidth: 100 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <div style={{ height: 6, background: theme.border, borderRadius: 3, flex: 1, overflow: "hidden" }}>
                                    <div style={{ width: `${row.progress}%`, height: "100%", background: row.progress === 100 ? theme.green : theme.accent }} />
                                  </div>
                                  <span style={{ fontSize: "0.72rem", color: theme.text2 }}>{row.progress}%</span>
                                </div>
                              </td>
                              <td style={{ padding: "12px 10px", fontSize: "0.74rem", color: theme.text3 }}>{row.updated}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>

                  {/* 5. Charts Section (CSS/SVG high-tech visualization) */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 14
                  }}>
                    {/* Performance Card */}
                    <GlassCard theme={theme}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text2, textTransform: "uppercase" }}>⚡ Performance Telemetry</h4>
                      <div style={{ height: 110, display: "flex", alignItems: "flex-end", gap: 4, paddingBottom: 10 }}>
                        {[40, 24, 75, 52, 90, 64, 82].map((h, i) => (
                          <div key={i} style={{ flex: 1, background: `linear-gradient(to top, ${theme.accent}, ${theme.accent2})`, height: `${h}%`, borderRadius: 4, opacity: 0.8 }} />
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: theme.text3 }}>
                        <span>Avg Latency: 0.4ms</span>
                        <span>State: Peak</span>
                      </div>
                    </GlassCard>

                    {/* Accuracy Gauge */}
                    <GlassCard theme={theme}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text2, textTransform: "uppercase" }}>🎯 Accuracy Quotient</h4>
                      <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="90" height="90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={theme.border}
                            strokeWidth="3.2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={theme.green}
                            strokeDasharray="99.98, 100"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div style={{ position: "absolute", fontSize: "1rem", fontWeight: 800, color: theme.green }}>99.98%</div>
                      </div>
                      <div style={{ textAlign: "center", fontSize: "0.68rem", color: theme.text3 }}>Confidence bound mapping nominal</div>
                    </GlassCard>

                    {/* Resource Usage */}
                    <GlassCard theme={theme}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text2, textTransform: "uppercase" }}>📊 Resource Allocations</h4>
                      <div style={{ height: 110, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3 }}>
                            <span>Dynamic RAM</span>
                            <span>42.8 GB / 128 GB</span>
                          </div>
                          <div style={{ height: 6, background: theme.border, borderRadius: 3 }}>
                            <div style={{ width: "35%", height: "100%", background: theme.cyan, borderRadius: 3 }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: 3 }}>
                            <span>GPU Computing</span>
                            <span>89.2% load</span>
                          </div>
                          <div style={{ height: 6, background: theme.border, borderRadius: 3 }}>
                            <div style={{ width: "89%", height: "100%", background: theme.yellow, borderRadius: 3 }} />
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                </div>

                {/* RIGHT SIDEBAR PANELS */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* 3. Quick Actions */}
                  <GlassCard theme={theme}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>⚡ Quick Actions</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { label: "New Research Workspace", key: "new_research", icon: "➕", color: theme.accent },
                        { label: "Import Genomic Dataset", key: "import_dataset", icon: "📥", color: theme.cyan },
                        { label: "Upload Algorithm Sequence", key: "upload_algo", icon: "🧮", color: theme.green },
                        { label: "Launch AI Control Sandbox", key: "open_ai_lab", icon: "🧠", color: theme.yellow },
                        { label: "Generate Live Telemetry Report", key: "generate_report", icon: "📄", color: theme.cyan }
                      ].map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerAction(act.label)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            background: theme.surf2,
                            border: `1px solid ${theme.border2}`,
                            borderRadius: 8,
                            color: theme.text1,
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = `${theme.accent}12`; e.currentTarget.style.borderColor = theme.accent; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = theme.surf2; e.currentTarget.style.borderColor = theme.border2; }}
                        >
                          <span style={{ fontSize: "1rem" }}>{act.icon}</span>
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </GlassCard>

                  {/* 4. Activity Timeline */}
                  <GlassCard theme={theme}>
                    <h3 style={{ margin: "0 0 14px 0", fontSize: "0.95rem", fontWeight: 800 }}>🕒 Activity Timeline</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {RECENT_ACTIVITIES.map(act => (
                        <div key={act.id} style={{ display: "flex", gap: 10, alignItems: "start" }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: `${act.color}15`,
                            border: `1px solid ${act.color}35`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.9rem",
                            flexShrink: 0
                          }}>{act.icon}</div>
                          <div>
                            <div style={{ fontSize: "0.76rem", color: theme.text1, fontWeight: 700, lineHeight: 1.3 }}>{act.event}</div>
                            <div style={{ fontSize: "0.68rem", color: theme.text3, marginTop: 2 }}>{act.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                </div>

              </div>

            </div>
          )}

          {/* SECTION: DNA RESEARCH & CORE MODULES */}
          {activeSection === "dna_research" && (
            <div style={{ padding: "20px" }}>
              {/* Module Filters & Search */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 16
              }}>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      style={{
                        padding: "5px 12px",
                        background: categoryFilter === cat ? theme.accent : theme.surf,
                        border: `1px solid ${categoryFilter === cat ? theme.accent : theme.border2}`,
                        borderRadius: 16,
                        color: categoryFilter === cat ? "#fff" : theme.text2,
                        fontSize: "0.72rem",
                        fontWeight: categoryFilter === cat ? 700 : 400,
                        cursor: "pointer"
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <input
                  value={moduleSearch}
                  onChange={e => setModuleSearch(e.target.value)}
                  placeholder="🔍 Search standard modules..."
                  style={{
                    background: theme.surf,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 8,
                    padding: "7px 12px",
                    color: theme.text1,
                    fontSize: "0.78rem",
                    outline: "none",
                    width: "100%",
                    maxWidth: 240,
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Modules Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 14
              }}>
                {filteredModules.map(lab => (
                  <div
                    key={lab.id}
                    style={{
                      background: theme.surf,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 12,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      boxShadow: `0 2px 4px -1px ${theme.shadow}`
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      background: theme.yellowGlow,
                      border: `1px solid ${theme.yellow}30`,
                      color: theme.yellow,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: "0.58rem",
                      fontWeight: 800
                    }}>
                      COMING SOON
                    </div>

                    <div>
                      <div style={{ fontSize: "0.62rem", color: theme.text3, textTransform: "uppercase", marginBottom: 6 }}>{lab.category}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 18 }}>{lab.icon}</span>
                        <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: theme.text1 }}>{lab.title}</h3>
                      </div>
                      <p style={{ margin: "0 0 16px 0", fontSize: "0.74rem", color: theme.text2, lineHeight: 1.4, minHeight: 40 }}>{lab.description}</p>
                    </div>

                    <button
                      onClick={() => setActiveLabDetail(lab)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: theme.surf2,
                        border: `1px solid ${theme.border2}`,
                        borderRadius: 6,
                        color: theme.accent,
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4
                      }}
                    >
                      <span>Open Lab</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: ALGORITHMS */}
          {activeSection === "algorithms" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>🧮 Experimental Cryptographic & Alignment Algorithms</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Curated computational mathematical models for genomic sequencing stress runs.</p>

              <div style={{ display: "grid", gap: 10 }}>
                {MOCK_ALGORITHMS.map((algo, idx) => (
                  <div key={idx} style={{
                    background: theme.surf,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    padding: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.84rem", color: theme.text1 }}>{algo.name}</div>
                      <div style={{ fontSize: "0.72rem", color: theme.text3 }}>Type: {algo.type} · Complexity: {algo.complexity}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: "0.74rem", color: theme.green, fontWeight: 700 }}>Accuracy: {algo.accuracy}</span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        background: algo.active ? theme.greenGlow : theme.border,
                        color: algo.active ? theme.green : theme.text3
                      }}>{algo.active ? "Ready" : "Inactive"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: AI MODELS */}
          {activeSection === "ai_models" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>🧠 Transformer Core & Neural Models</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Virtual model validation controls and hyper-parameter configurations.</p>

              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 12,
                padding: 18,
                maxWidth: 540
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Parametric Architecture Config</span>
                  <span style={{ fontSize: "0.7rem", color: theme.yellow }}>● COMING SOON</span>
                </div>

                {/* Simulated parameter ranges */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", marginBottom: 4 }}>
                      <span>Context Window Bounds</span>
                      <span>128k tokens</span>
                    </div>
                    <div style={{ height: 6, background: theme.border, borderRadius: 3 }}>
                      <div style={{ width: "80%", height: "100%", background: theme.accent, borderRadius: 3 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", marginBottom: 4 }}>
                      <span>Inference Quantization</span>
                      <span>FP8 (E4M3)</span>
                    </div>
                    <div style={{ height: 6, background: theme.border, borderRadius: 3 }}>
                      <div style={{ width: "45%", height: "100%", background: theme.cyan, borderRadius: 3 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", marginBottom: 4 }}>
                      <span>Attention Dropout Rate</span>
                      <span>0.05 (Target)</span>
                    </div>
                    <div style={{ height: 6, background: theme.border, borderRadius: 3 }}>
                      <div style={{ width: "20%", height: "100%", background: theme.green, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>

                <button disabled style={{
                  width: "100%",
                  padding: "10px",
                  background: `${theme.accent}20`,
                  border: "none",
                  borderRadius: 6,
                  color: theme.text3,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  marginTop: 20,
                  cursor: "not-allowed"
                }}>
                  Deploy New Weights Sequence
                </button>
              </div>
            </div>
          )}

          {/* SECTION: SIMULATIONS */}
          {activeSection === "simulations" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>🧪 Real-time Virtual Physics & Medical Simulations</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Diagnostic active sandboxes currently initializing inside isolated memory blocks.</p>

              <div style={{ display: "grid", gap: 12 }}>
                {LAB_MODULES.map(sim => (
                  <div key={sim.id} style={{
                    background: theme.surf,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 10,
                    padding: 16
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.82rem", color: theme.text1 }}>{sim.title}</span>
                      <span style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: theme.yellow
                      }}>Coming Soon</span>
                    </div>
                    <div style={{ height: 6, background: theme.border, borderRadius: 3, marginBottom: 8 }}>
                      <div style={{ width: `30%`, height: "100%", background: theme.accent, borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: theme.text3 }}>
                      <span>Simulations in queue: {sim.stats?.activeSimulations || "0"}</span>
                      <span>Alignment accuracy target: {sim.stats?.alignmentAccuracy || "n/a"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: DATASETS */}
          {activeSection === "datasets" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>📂 Curated Datasets Manifest</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Pre-validated dataset manifests prepared for model evaluations.</p>

              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 12,
                overflow: "hidden"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: theme.surf2, borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ padding: "10px 14px", fontSize: "0.74rem", color: theme.text3 }}>Filename</th>
                      <th style={{ padding: "10px 14px", fontSize: "0.74rem", color: theme.text3 }}>Size</th>
                      <th style={{ padding: "10px 14px", fontSize: "0.74rem", color: theme.text3 }}>Category</th>
                      <th style={{ padding: "10px 14px", fontSize: "0.74rem", color: theme.text3 }}>Integrity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", fontWeight: 700 }}>human-genome-hgp-v4.csv</td>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.text2 }}>4.2 GB</td>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.text2 }}>Biological</td>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.green, fontWeight: 700 }}>99.99%</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", fontWeight: 700 }}>nlp-transformer-vocab-v10.txt</td>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.text2 }}>840 MB</td>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.text2 }}>NLP</td>
                      <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.green, fontWeight: 700 }}>99.50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: EXPERIMENTS */}
          {activeSection === "experiments" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>🔬 Experimental Sandboxes</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Incubate and map dynamic scientific simulations in progress.</p>

              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 12,
                padding: 20,
                textAlign: "center",
                color: theme.text3
              }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>🧪</div>
                <div style={{ fontSize: "0.84rem", fontWeight: 700, color: theme.text2, marginBottom: 4 }}>Lab Simulator Engine Awaiting Calibration</div>
                <div style={{ fontSize: "0.74rem", color: theme.text3 }}>No dynamic active user experiments configured. Open one of the 10 Standard Lab modules to review parameters.</div>
              </div>
            </div>
          )}

          {/* SECTION: NOTES */}
          {activeSection === "notes" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>📝 Lab Digital Notepad</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Store ideas, code patterns, and diagnostic logs in local state.</p>

              {/* Note creator */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 20
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    placeholder="Note title..."
                    style={{
                      width: "100%",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      color: theme.text1,
                      fontSize: "0.8rem",
                      outline: "none"
                    }}
                  />
                  <textarea
                    value={newNoteBody}
                    onChange={e => setNewNoteBody(e.target.value)}
                    placeholder="Start typing some dynamic diagnostic notes..."
                    rows={3}
                    style={{
                      width: "100%",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      color: theme.text1,
                      fontSize: "0.8rem",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                  <button
                    onClick={addNote}
                    style={{
                      alignSelf: "flex-end",
                      padding: "8px 16px",
                      background: theme.accent,
                      border: "none",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Saved Notes display */}
              <div style={{ display: "grid", gap: 10 }}>
                {userNotes.map(note => (
                  <div key={note.id} style={{
                    background: theme.surf,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    padding: 14
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <h4 style={{ margin: 0, fontSize: "0.84rem", fontWeight: 800, color: theme.text1 }}>{note.title}</h4>
                      <span style={{ fontSize: "0.68rem", color: theme.text3 }}>{note.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>{note.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SETTINGS */}
          {activeSection === "settings" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>⚙️ Lab Sandbox Security & Config Controls</h2>
              <p style={{ fontSize: "0.78rem", color: theme.text2, marginBottom: 16 }}>Tune compilation parameters, resource allocations, and encryption layers.</p>

              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 12,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: 480
              }}>
                <div style={{ display: "flex", justify: "space-between", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>Isolated Sandbox Encryption</div>
                    <div style={{ fontSize: "0.7rem", color: theme.text3 }}>Deploy end-to-end security loops on simulations.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: "pointer", width: 16, height: 16 }} />
                </div>

                <div style={{ display: "flex", justify: "space-between", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>Telemetry Data Compression</div>
                    <div style={{ fontSize: "0.7rem", color: theme.text3 }}>Minify data footprint on large sequence downloads.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: "pointer", width: 16, height: 16 }} />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Lab detail view overlay modal */}
      <LabDetailsModal
        isOpen={activeLabDetail !== null}
        onClose={() => setActiveLabDetail(null)}
        lab={activeLabDetail}
        theme={theme}
        isLight={isLight}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

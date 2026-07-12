import React, { useState, useMemo } from "react";

// Design Tokens for Light/Dark themes
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
    glass: "rgba(255, 255, 255, 0.85)",
    shadow: "rgba(15, 23, 42, 0.08)",
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

// Sidebar section structures
const SIDEBAR_SECTIONS = [
  { id: "dna_research", label: "DNA Research", icon: "🧬" },
  { id: "algorithms", label: "Algorithms", icon: "🧮" },
  { id: "ai_models", label: "AI Models", icon: "🧠" },
  { id: "simulations", label: "Simulations", icon: "🧪" },
  { id: "datasets", label: "Datasets", icon: "📊" },
  { id: "experiments", label: "Experiments", icon: "🔬" },
  { id: "notes", label: "Notes", icon: "📝" },
  { id: "settings", label: "Settings", icon: "⚙️" }
];

// Mock Data for Interactive Panels
const MOCK_ALGORITHMS = [
  { name: "Gene Alignment Matrix v2", type: "DNA/Dynamic", complexity: "O(MN)", accuracy: "99.98%", active: true },
  { name: "Transformer Attention Tokenizer", type: "AI/Attention", complexity: "O(N²)", accuracy: "98.4%", active: false },
  { name: "Quantum Annealer Optimizer", type: "Quantum/Adiabatic", complexity: "NP-Hard", accuracy: "99.99%", active: true },
  { name: "Kinematic Path Planner", type: "Robotics/Heuristics", complexity: "O(E + V log V)", accuracy: "96.2%", active: false }
];

const MOCK_DATASETS = [
  { id: "ds1", name: "human-genome-hgp-v4.csv", size: "4.2 GB", type: "Biological", entries: "3.2B base pairs", integrity: "99.99%" },
  { id: "ds2", name: "nlp-transformer-vocab-v10.txt", size: "840 MB", type: "NLP", entries: "1.2M tokens", integrity: "99.50%" },
  { id: "ds3", name: "orbital-telemetry-trajectory-sc.json", size: "124 MB", type: "Aero/Telemetry", entries: "4.8M frames", integrity: "100.00%" }
];

const MOCK_SIMULATIONS = [
  { id: "sim1", name: "Qubit Coherence Stress Test", progress: 85, status: "Active", timeRemaining: "4m 12s" },
  { id: "sim2", name: "Bioreactor Batch Enzymology", progress: 100, status: "Completed", timeRemaining: "0s" },
  { id: "sim3", name: "Vascular Map Neural Routing", progress: 24, status: "Active", timeRemaining: "42m 8s" }
];

// Stats card component
const StatCard = ({ title, value, icon, color, text2, border, bg }) => (
  <div style={{
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    flex: "1 1 200px"
  }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 9,
      background: `${color}15`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      color: color
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: "0.68rem", color: text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: color }}>{value}</div>
    </div>
  </div>
);

// Detail modal component for "Open Lab" buttons
const LabDetailsModal = ({ isOpen, onClose, lab, theme, isLight }) => {
  if (!isOpen || !lab) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      backdropFilter: "blur(6px)",
      animation: "fadeIn 0.2s ease"
    }}>
      <div style={{
        background: theme.surf,
        border: `1px solid ${theme.border2}`,
        borderRadius: 16,
        padding: 24,
        width: 480,
        maxWidth: "90vw",
        boxShadow: `0 24px 48px ${theme.shadow}`,
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: theme.text3,
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${theme.accent}15`,
            border: `1px solid ${theme.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22
          }}>{lab.icon}</div>
          <div>
            <div style={{ fontSize: "0.7rem", color: theme.accent, fontWeight: 700, textTransform: "uppercase" }}>{lab.category}</div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: theme.text1 }}>{lab.title}</h3>
          </div>
        </div>

        <p style={{ fontSize: "0.82rem", color: theme.text2, lineHeight: 1.6, marginBottom: 18 }}>
          {lab.description}
        </p>

        <div style={{
          background: theme.surf2,
          borderRadius: 10,
          padding: 14,
          marginBottom: 18,
          border: `1px solid ${theme.border}`
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "0.7rem", color: theme.text1, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Telemetry Simulation Specs
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(lab.stats).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: theme.text2, textTransform: "capitalize" }}>
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span style={{ color: theme.text1, fontWeight: 700 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Console view */}
        <div style={{
          background: isLight ? "#0f172a" : "#02020a",
          border: `1px solid ${isLight ? "#334155" : "#1e1e35"}`,
          borderRadius: 8,
          padding: "10px 14px",
          fontFamily: "monospace",
          fontSize: "0.7rem",
          color: "#38bdf8",
          marginBottom: 20,
          maxHeight: 110,
          overflowY: "auto"
        }}>
          <div style={{ color: "#10b981" }}>[SECURE COMPILATION PIPELINE READY]</div>
          <div>&gt; Initiating virtual diagnostics for {lab.title}...</div>
          <div>&gt; Pipeline state: Awaiting implementation code.</div>
          <div style={{ color: theme.yellow }}>&gt; Status: COMING SOON</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "9px",
              background: theme.surf2,
              border: `1px solid ${theme.border2}`,
              borderRadius: 8,
              color: theme.text2,
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >Close Detail</button>
          <button
            disabled
            style={{
              flex: 1,
              padding: "9px",
              background: `${theme.accent}30`,
              border: "none",
              borderRadius: 8,
              color: theme.text3,
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "not-allowed"
            }}
          >Initialize Lab</button>
        </div>
      </div>
    </div>
  );
};

export default function ResearchLab() {
  const [isLight, setIsLight] = useState(false);
  const [activeSection, setActiveSection] = useState("dna_research");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeLabDetail, setActiveLabDetail] = useState(null);

  // Notes state
  const [userNotes, setUserNotes] = useState([
    { id: 1, title: "Qubit Decoherence Strategy", body: "Focus optimization on lower-temperature superconductor alloy crystalline structures.", date: "July 12, 2025" },
    { id: 2, title: "CRISPR Genome Bounds", body: "Set nucleobase bounds dynamically utilizing DNA Research Alignment Matrix v2.", date: "July 10, 2025" }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");

  const theme = isLight ? THEME.light : THEME.dark;

  // Filter sidebar items based on search
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

  // Toggle collapsing sidebar
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

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
        position: "relative"
      }}>
        {/* Sidebar Header & Toggle */}
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

        {/* Search Box inside Sidebar */}
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

        {/* Sidebar Navigation Items */}
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
                  background: isActive ? `${theme.accent}15` : "transparent",
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
          gap: 12
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: "1.1rem" }}>🧬</span>
              <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
                Research Lab & Innovation Console
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: theme.text2 }}>
              Incubating high-frontier physical, biological, and synthetic simulations.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              fontSize: "0.68rem",
              color: theme.green,
              background: theme.greenGlow,
              border: `1px solid ${theme.green}20`,
              padding: "4px 10px",
              borderRadius: 20,
              fontWeight: 700
            }}>
              SYSTEMS ACTIVE
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
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* SECTION: DNA RESEARCH & CORE MODULES */}
          {activeSection === "dna_research" && (
            <div style={{ padding: "20px" }}>
              {/* Overview Stats */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 20
              }}>
                <StatCard title="Total Lab Modules" value="10" icon="🔬" color={theme.accent} text2={theme.text2} border={theme.border2} bg={theme.surf} />
                <StatCard title="Sandbox Phase" value="Alpha v1.0" icon="⚙️" color={theme.cyan} text2={theme.text2} border={theme.border2} bg={theme.surf} />
                <StatCard title="Security Clearance" value="Level 5" icon="🛡️" color={theme.green} text2={theme.text2} border={theme.border2} bg={theme.surf} />
                <StatCard title="Initialization" value="Secure Ready" icon="⚡" color={theme.yellow} text2={theme.text2} border={theme.border2} bg={theme.surf} />
              </div>

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
                {MOCK_SIMULATIONS.map(sim => (
                  <div key={sim.id} style={{
                    background: theme.surf,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 10,
                    padding: 16
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.82rem", color: theme.text1 }}>{sim.name}</span>
                      <span style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: sim.status === "Completed" ? theme.green : theme.cyan
                      }}>{sim.status}</span>
                    </div>
                    <div style={{ height: 6, background: theme.border, borderRadius: 3, marginBottom: 8 }}>
                      <div style={{ width: `${sim.progress}%`, height: "100%", background: sim.status === "Completed" ? theme.green : theme.accent, borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: theme.text3 }}>
                      <span>Progress: {sim.progress}%</span>
                      <span>ETA: {sim.timeRemaining}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: DATASETS */}
          {activeSection === "datasets" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>📊 Sandbox Standard Curated Datasets</h2>
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
                    {MOCK_DATASETS.map(ds => (
                      <tr key={ds.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: "10px 14px", fontSize: "0.78rem", fontWeight: 700 }}>{ds.name}</td>
                        <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.text2 }}>{ds.size}</td>
                        <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.text2 }}>{ds.type}</td>
                        <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: theme.green, fontWeight: 700 }}>{ds.integrity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: EXPERIMENTS */}
          {activeSection === "experiments" && (
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, color: theme.text1, marginBottom: 4 }}>🔬 Custom Laboratory Experiments</h2>
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

                <div style={{ display: "flex", justify: "space-between", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>Automatic Calibration Loop</div>
                    <div style={{ fontSize: "0.7rem", color: theme.text3 }}>Initiate neural resets dynamically on sequence drop.</div>
                  </div>
                  <input type="checkbox" style={{ cursor: "pointer", width: 16, height: 16 }} />
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

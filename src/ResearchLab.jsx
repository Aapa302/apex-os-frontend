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

// 10 required modules with realistic meta-data for simulation
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

// Stats summary component
const StatCard = ({ title, value, icon, color, text2, border, bg }) => (
  <div style={{
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 14,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    flex: 1,
    minWidth: 200
  }}>
    <div style={{
      width: 44,
      height: 44,
      borderRadius: 10,
      background: `${color}15`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      color: color
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: "0.72rem", color: text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: color }}>{value}</div>
    </div>
  </div>
);

// Reusable modal for "Open Lab" details
const LabDetailsModal = ({ isOpen, onClose, lab, theme, isLight, onOpenDNA }) => {
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
        width: 500,
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
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${theme.accent}15`,
            border: `1px solid ${theme.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24
          }}>{lab.icon}</div>
          <div>
            <div style={{ fontSize: "0.74rem", color: theme.accent, fontWeight: 700, textTransform: "uppercase" }}>{lab.category}</div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: theme.text1 }}>{lab.title}</h3>
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: theme.text2, lineHeight: 1.6, marginBottom: 20 }}>
          {lab.description}
        </p>

        <div style={{
          background: theme.surf2,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: `1px solid ${theme.border}`
        }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.74rem", color: theme.text1, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Telemetry Simulation Specs
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(lab.stats).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
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
          padding: "12px 16px",
          fontFamily: "monospace",
          fontSize: "0.72rem",
          color: "#38bdf8",
          marginBottom: 24,
          maxHeight: 120,
          overflowY: "auto"
        }}>
          <div style={{ color: "#10b981" }}>[SECURE COMPILATION PIPELINE READY]</div>
          <div>&gt; Initiating virtual diagnostics for {lab.title}...</div>
          <div>&gt; Pipeline state: Awaiting implementation code.</div>
          <div style={{ color: theme.yellow }}>&gt; Status: COMING SOON</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              background: theme.surf2,
              border: `1px solid ${theme.border2}`,
              borderRadius: 9,
              color: theme.text2,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >Close Detail</button>
          <button
            disabled={lab.id !== "dna"}
            onClick={() => {
              if (lab.id === "dna" && onOpenDNA) {
                onOpenDNA();
                onClose();
              }
            }}
            style={{
              flex: 1,
              padding: "10px",
              background: lab.id === "dna" ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})` : `${theme.accent}30`,
              border: "none",
              borderRadius: 9,
              color: lab.id === "dna" ? "#fff" : theme.text3,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: lab.id === "dna" ? "pointer" : "not-allowed"
            }}
          >
            {lab.id === "dna" ? "Initialize Algorithm Designer" : "Initialize Lab"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResearchLab({ onOpenDNA }) {
  const [isLight, setIsLight] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeLabDetail, setActiveLabDetail] = useState(null);

  const theme = isLight ? THEME.light : THEME.dark;

  // Filter modules based on search and selected category
  const filteredModules = useMemo(() => {
    return LAB_MODULES.filter(lab => {
      const matchesSearch = lab.title.toLowerCase().includes(search.toLowerCase()) ||
                            lab.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === "All" || lab.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [search, categoryFilter]);

  const categories = ["All", "Biomedical", "Digital", "Engineering", "Special"];

  return (
    <div style={{
      background: theme.bg,
      color: theme.text1,
      minHeight: "100%",
      transition: "background-color 0.2s, color 0.2s",
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Page Header */}
      <div style={{
        padding: "24px 20px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.surf,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div style={{ minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "1.4rem" }}>🧬</span>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Enterprise Research & Innovation Lab
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.78rem", color: theme.text2 }}>
            A high-fidelity technological sandbox and deep-tech incubation control center.
          </p>
        </div>

        {/* Theme Toggle & Visual Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: "0.72rem",
            color: theme.green,
            background: theme.greenGlow,
            border: `1px solid ${theme.green}30`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            SYSTEMS NOMINAL
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
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s"
            }}
          >
            {isLight ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </div>

      {/* Overview Statistics Row */}
      <div style={{
        padding: "20px 20px 0 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 14
      }}>
        <StatCard
          title="Total Labs"
          value="10"
          icon="🔬"
          color={theme.accent}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
        <StatCard
          title="Sandbox Phase"
          value="Alpha v1.0"
          icon="⚙️"
          color={theme.cyan}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
        <StatCard
          title="Security Clearances"
          value="Level 5"
          icon="🛡️"
          color={theme.green}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
        <StatCard
          title="Incubation Queue"
          value="Pending Init"
          icon="⌛"
          color={theme.yellow}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        padding: "20px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "6px 14px",
                background: categoryFilter === cat ? theme.accent : theme.surf,
                border: `1px solid ${categoryFilter === cat ? theme.accent : theme.border2}`,
                borderRadius: 20,
                color: categoryFilter === cat ? "#fff" : theme.text2,
                fontSize: "0.74rem",
                fontWeight: categoryFilter === cat ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search labs by name or keyword..."
          style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 10,
            padding: "8px 14px",
            color: theme.text1,
            fontSize: "0.82rem",
            outline: "none",
            width: "100%",
            maxWidth: 320,
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Grid of 10 Required Labs */}
      <div style={{ padding: "0 20px 40px 20px" }}>
        {filteredModules.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            color: theme.text3,
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 16
          }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: "0.9rem" }}>No experimental labs match your current parameters.</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}>
            {filteredModules.map(lab => (
              <div
                key={lab.id}
                style={{
                  background: theme.surf,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  boxShadow: `0 4px 6px -1px ${theme.shadow}`,
                  transition: "all 0.2s ease"
                }}
              >
                {/* Coming Soon status badge */}
                <div style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: theme.yellowGlow,
                  border: `1px solid ${theme.yellow}40`,
                  color: theme.yellow,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: "0.5px"
                }}>
                  COMING SOON
                </div>

                <div>
                  {/* Category */}
                  <div style={{
                    fontSize: "0.66rem",
                    color: theme.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 8
                  }}>
                    {lab.category}
                  </div>

                  {/* Icon & Title */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `${theme.accent}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18
                    }}>{lab.icon}</div>
                    <h3 style={{
                      margin: 0,
                      fontSize: "0.94rem",
                      fontWeight: 800,
                      color: theme.text1
                    }}>{lab.title}</h3>
                  </div>

                  {/* Short Description */}
                  <p style={{
                    margin: "0 0 20px 0",
                    fontSize: "0.78rem",
                    color: theme.text2,
                    lineHeight: 1.5,
                    minHeight: 45
                  }}>{lab.description}</p>
                </div>

                {/* Open Lab Button */}
                <button
                  onClick={() => setActiveLabDetail(lab)}
                  style={{
                    width: "100%",
                    padding: "9px",
                    background: theme.surf2,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 8,
                    color: theme.accent,
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${theme.accent}12`;
                    e.currentTarget.style.borderColor = theme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme.surf2;
                    e.currentTarget.style.borderColor = theme.border2;
                  }}
                >
                  <span>Open Lab</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal Component */}
      <LabDetailsModal
        isOpen={activeLabDetail !== null}
        onClose={() => setActiveLabDetail(null)}
        lab={activeLabDetail}
        theme={theme}
        isLight={isLight}
        onOpenDNA={onOpenDNA}
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

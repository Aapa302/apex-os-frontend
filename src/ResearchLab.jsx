import React, { useState, useMemo, useEffect } from "react";

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
    glass: "rgba(11,11,24,0.85)",
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

const DEFAULT_PROJECTS = [
  { id: "p1", name: "High-Throughput Smith-Waterman Optimization", description: "Optimize SW alignments to achieve sub-millisecond genomic searches.", category: "Biomedical", progress: 85, status: "Active", date: "2026-07-10", lastUpdated: "2026-07-10", archived: false },
  { id: "p2", name: "SARS-CoV-2 Lineage Traceback Map", description: "Trace spike protein mutations using thermodynamic alignments.", category: "Biomedical", progress: 100, status: "Completed", date: "2026-03-15", lastUpdated: "2026-03-15", archived: false },
  { id: "p3", name: "Qubit Calibration & Coherence Simulations", description: "Map microwave telemetry channels againstLogical Qubits.", category: "Digital", progress: 40, status: "Active", date: "2026-07-12", lastUpdated: "2026-07-12", archived: false }
];

const DEFAULT_TIMELINE = [
  { id: "t1", title: "SARS-CoV-2 Traceback Finalized", project: "SARS-CoV-2 Lineage Traceback Map", date: "2026-07-14", desc: "Lineage models and spike coordinates fully validated." },
  { id: "t2", title: "Smith-Waterman Cache Optimization", project: "High-Throughput Smith-Waterman Optimization", date: "2026-07-13", desc: "Traceback local cache optimizations are running." }
];

const DEFAULT_MILESTONES = [
  { id: "m1", title: "First sequence alignment success", projectId: "p1", desc: "Successfully aligned standard DNA sample." }
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
const LabDetailsModal = ({ isOpen, onClose, lab, theme, isLight, onOpenDNA, onOpenLab }) => {
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
          <div>&gt; Pipeline state: Active sandbox ready.</div>
          <div style={{ color: theme.green }}>&gt; Status: FUNCTIONAL</div>
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
            onClick={() => {
              if (onOpenLab) {
                onOpenLab(lab.id);
                onClose();
              } else if (lab.id === "dna" && onOpenDNA) {
                onOpenDNA();
                onClose();
              }
            }}
            style={{
              flex: 1,
              padding: "10px",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
              border: "none",
              borderRadius: 9,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            {lab.id === "dna" ? "Initialize Algorithm Designer" : "Initialize Lab"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResearchLab({ onOpenDNA, onOpenLab }) {
  const [isLight, setIsLight] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeLabDetail, setActiveLabDetail] = useState(null);

  // Search & Filters for Dashboard
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [dashboardFilter, setDashboardFilter] = useState("All"); // All, Active, Completed, Archived

  // Active navigation tab inside Research Lab: "dashboard" or "labs"
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Persistent Active Projects, Timeline, and Milestones states
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_research_projects");
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  const [timeline, setTimeline] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_research_timeline");
      return saved ? JSON.parse(saved) : DEFAULT_TIMELINE;
    } catch {
      return DEFAULT_TIMELINE;
    }
  });

  const [milestones, setMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_research_milestones");
      return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
    } catch {
      return DEFAULT_MILESTONES;
    }
  });

  // Project Form States
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Biomedical");
  const [newProjectProgress, setNewProjectProgress] = useState(0);
  const [newProjectStatus, setNewProjectStatus] = useState("Active");
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Milestone Form States
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneProject, setNewMilestoneProject] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);

  // Sync to local storage & Research Memory when states update
  const syncToResearchMemory = (type, title, text) => {
    try {
      const cached = localStorage.getItem("apex_os_v4_research_memories");
      let memories = cached ? JSON.parse(cached) : [];
      memories.unshift({
        id: `mem_lab_${Date.now()}`,
        title: `[Lab ${type}] ${title}`,
        type: "AI Observation",
        content: text,
        tags: ["Research Lab", type],
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        severity: "Low"
      });
      localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
    } catch (err) {
      console.error("Error syncing to Research Memory:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("apex_os_research_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("apex_os_research_timeline", JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem("apex_os_research_milestones", JSON.stringify(milestones));
  }, [milestones]);

  // Listen to Storage events for real-time synchronization across views/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "apex_os_research_projects") {
        setProjects(JSON.parse(e.newValue || "[]"));
      } else if (e.key === "apex_os_research_timeline") {
        setTimeline(JSON.parse(e.newValue || "[]"));
      } else if (e.key === "apex_os_research_milestones") {
        setMilestones(JSON.parse(e.newValue || "[]"));
      } else if (e.key === "apex_os_experiments" || e.key === "apex_os_algorithms") {
        const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
        if (e.key === "apex_os_experiments") {
          const exps = JSON.parse(e.newValue || "[]");
          if (exps.length > 0) {
            const latest = exps[0];
            setTimeline(prev => {
              if (prev.some(t => t.id === `t_exp_${latest.id}`)) return prev;
              const newEv = {
                id: `t_exp_${latest.id || Date.now()}`,
                title: `Experiment Executed: ${latest.name}`,
                project: latest.assignedAlgorithm || "DNA Sequencing",
                date: timestamp.split(" ")[0],
                desc: latest.description
              };
              const next = [newEv, ...prev];
              localStorage.setItem("apex_os_research_timeline", JSON.stringify(next));
              return next;
            });
          }
        } else if (e.key === "apex_os_algorithms") {
          const algs = JSON.parse(e.newValue || "[]");
          if (algs.length > 0) {
            const latest = algs[0];
            setTimeline(prev => {
              if (prev.some(t => t.id === `t_alg_${latest.id}`)) return prev;
              const newEv = {
                id: `t_alg_${latest.id || Date.now()}`,
                title: `Algorithm Saved: ${latest.name}`,
                project: "Algorithm Designer",
                date: timestamp.split(" ")[0],
                desc: `Objective: ${latest.objective}. Version: ${latest.version}.`
              };
              const next = [newEv, ...prev];
              localStorage.setItem("apex_os_research_timeline", JSON.stringify(next));
              return next;
            });
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

  // Filter and search projects based on filters and search queries
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = dashboardSearch.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) ||
                            p.category.toLowerCase().includes(q) ||
                            p.status.toLowerCase().includes(q);

      let matchesFilter = true;
      if (dashboardFilter === "Active") {
        matchesFilter = p.status === "Active" && !p.archived;
      } else if (dashboardFilter === "Completed") {
        matchesFilter = p.status === "Completed" && !p.archived;
      } else if (dashboardFilter === "Archived") {
        matchesFilter = !!p.archived;
      } else {
        matchesFilter = !p.archived; // Default to non-archived projects
      }

      return matchesSearch && matchesFilter;
    });
  }, [projects, dashboardSearch, dashboardFilter]);

  const categories = ["All", "Biomedical", "Digital", "Engineering", "Special"];

  // Projects CRUD handlers
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const timestamp = new Date().toISOString().split("T")[0];

    if (editingProjectId) {
      setProjects(prev => prev.map(p => p.id === editingProjectId ? {
        ...p,
        name: newProjectName,
        description: newProjectDesc,
        category: newProjectCategory,
        progress: Number(newProjectProgress),
        status: newProjectStatus,
        lastUpdated: timestamp
      } : p));

      // Append Timeline event
      const editEvent = {
        id: `t_${Date.now()}`,
        title: `Project Updated: ${newProjectName}`,
        project: newProjectName,
        date: timestamp,
        desc: `Updated project parameters. Status: ${newProjectStatus}, Progress: ${newProjectProgress}%.`
      };
      setTimeline(prev => [editEvent, ...prev]);
      syncToResearchMemory("Project Edit", newProjectName, `Project Updated: ${newProjectName}\nDescription: ${newProjectDesc}\nStatus: ${newProjectStatus}\nProgress: ${newProjectProgress}%`);

      setEditingProjectId(null);
    } else {
      const newProj = {
        id: `p_${Date.now()}`,
        name: newProjectName,
        description: newProjectDesc,
        category: newProjectCategory,
        progress: Number(newProjectProgress),
        status: newProjectStatus,
        date: timestamp,
        lastUpdated: timestamp,
        archived: false
      };
      setProjects(prev => [newProj, ...prev]);

      // Automatically add a timeline event for new project
      const newTime = {
        id: `t_${Date.now()}`,
        title: `Project Created: ${newProjectName}`,
        project: newProjectName,
        date: timestamp,
        desc: `New research project initialized in category ${newProjectCategory}.`
      };
      setTimeline(prev => [newTime, ...prev]);
      syncToResearchMemory("Project Create", newProjectName, `Project Created: ${newProjectName}\nDescription: ${newProjectDesc}\nCategory: ${newProjectCategory}`);
    }

    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectProgress(0);
    setNewProjectStatus("Active");
  };

  const handleEditProject = (p) => {
    setEditingProjectId(p.id);
    setNewProjectName(p.name);
    setNewProjectDesc(p.description || "");
    setNewProjectCategory(p.category);
    setNewProjectProgress(p.progress);
    setNewProjectStatus(p.status);
  };

  const handleDeleteProject = (id) => {
    const projToDelete = projects.find(p => p.id === id);
    if (!projToDelete) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    setTimeline(prev => prev.filter(t => t.project !== projToDelete.name));
    setMilestones(prev => prev.filter(m => m.projectId !== id));

    // Timeline event
    const delEvent = {
      id: `t_${Date.now()}`,
      title: `Project Deleted: ${projToDelete.name}`,
      project: projToDelete.name,
      date: new Date().toISOString().split("T")[0],
      desc: `Project and associated records successfully removed.`
    };
    setTimeline(prev => [delEvent, ...prev]);
    syncToResearchMemory("Project Delete", projToDelete.name, `Project deleted: ${projToDelete.name}`);

    if (editingProjectId === id) {
      setEditingProjectId(null);
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectProgress(0);
    }
  };

  const handleArchiveProject = (id) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, archived: true, lastUpdated: new Date().toISOString().split("T")[0] } : p));

    // Timeline event
    const arcEvent = {
      id: `t_${Date.now()}`,
      title: `Project Archived: ${proj.name}`,
      project: proj.name,
      date: new Date().toISOString().split("T")[0],
      desc: `Project status successfully set to Archived.`
    };
    setTimeline(prev => [arcEvent, ...prev]);
    syncToResearchMemory("Project Archive", proj.name, `Project archived: ${proj.name}`);
  };

  const handleRestoreProject = (id) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, archived: false, lastUpdated: new Date().toISOString().split("T")[0] } : p));

    // Timeline event
    const restEvent = {
      id: `t_${Date.now()}`,
      title: `Project Restored: ${proj.name}`,
      project: proj.name,
      date: new Date().toISOString().split("T")[0],
      desc: `Project restored to active board.`
    };
    setTimeline(prev => [restEvent, ...prev]);
    syncToResearchMemory("Project Restore", proj.name, `Project restored: ${proj.name}`);
  };

  // Milestones CRUD handlers
  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newMilestoneProject) {
      alert("Milestone Title and Project link are required!");
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const linkedProj = projects.find(p => p.id === newMilestoneProject);

    if (editingMilestoneId) {
      setMilestones(prev => prev.map(m => m.id === editingMilestoneId ? {
        ...m,
        title: newMilestoneTitle,
        projectId: newMilestoneProject,
        desc: newMilestoneDesc
      } : m));

      // Timeline event
      const editMilEvent = {
        id: `t_${Date.now()}`,
        title: `Milestone Edited: ${newMilestoneTitle}`,
        project: linkedProj ? linkedProj.name : "General",
        date: timestamp,
        desc: `Edited milestone details: ${newMilestoneDesc}`
      };
      setTimeline(prev => [editMilEvent, ...prev]);
      syncToResearchMemory("Milestone Edit", newMilestoneTitle, `Milestone Edited: ${newMilestoneTitle}\nDetails: ${newMilestoneDesc}`);

      setEditingMilestoneId(null);
    } else {
      const newMil = {
        id: `m_${Date.now()}`,
        title: newMilestoneTitle,
        projectId: newMilestoneProject,
        desc: newMilestoneDesc
      };
      setMilestones(prev => [newMil, ...prev]);

      // Automatically add a timeline event for new milestone
      const newTime = {
        id: `t_${Date.now()}`,
        title: `Milestone Achieved: ${newMilestoneTitle}`,
        project: linkedProj ? linkedProj.name : "General",
        date: timestamp,
        desc: `New milestone logged: ${newMilestoneDesc}`
      };
      setTimeline(prev => [newTime, ...prev]);
      syncToResearchMemory("Milestone Create", newMilestoneTitle, `Milestone Achieved: ${newMilestoneTitle}\nProject: ${linkedProj ? linkedProj.name : "General"}\nDetails: ${newMilestoneDesc}`);
    }

    setNewMilestoneTitle("");
    setNewMilestoneProject("");
    setNewMilestoneDesc("");
  };

  const handleEditMilestone = (m) => {
    setEditingMilestoneId(m.id);
    setNewMilestoneTitle(m.title);
    setNewMilestoneProject(m.projectId);
    setNewMilestoneDesc(m.desc || "");
  };

  const handleDeleteMilestone = (id) => {
    const mil = milestones.find(m => m.id === id);
    if (!mil) return;
    setMilestones(prev => prev.filter(m => m.id !== id));

    const linkedProj = projects.find(p => p.id === mil.projectId);

    // Timeline event
    const delMilEvent = {
      id: `t_${Date.now()}`,
      title: `Milestone Deleted: ${mil.title}`,
      project: linkedProj ? linkedProj.name : "General",
      date: new Date().toISOString().split("T")[0],
      desc: `Milestone record successfully removed.`
    };
    setTimeline(prev => [delMilEvent, ...prev]);
    syncToResearchMemory("Milestone Delete", mil.title, `Milestone Deleted: ${mil.title}`);

    if (editingMilestoneId === id) {
      setEditingMilestoneId(null);
      setNewMilestoneTitle("");
      setNewMilestoneProject("");
      setNewMilestoneDesc("");
    }
  };

  // Stats calculation over non-archived projects
  const nonArchivedProjects = useMemo(() => projects.filter(p => !p.archived), [projects]);
  const totalProjects = nonArchivedProjects.length;
  const activeProjectsCount = nonArchivedProjects.filter(p => p.status === "Active").length;
  const completedProjectsCount = nonArchivedProjects.filter(p => p.status === "Completed").length;
  const avgProgress = totalProjects > 0 ? Math.round(nonArchivedProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0;

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

      {/* Tabs Row */}
      <div style={{
        background: theme.surf,
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 24px",
        display: "flex",
        gap: 16,
        height: "50px",
        alignItems: "center"
      }}>
        <button
          onClick={() => setCurrentTab("dashboard")}
          style={{
            padding: "0 16px",
            height: "100%",
            background: "none",
            border: "none",
            borderBottom: currentTab === "dashboard" ? `3px solid ${theme.accent}` : "3px solid transparent",
            color: currentTab === "dashboard" ? theme.text1 : theme.text2,
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s"
          }}
        >
          📊 Research Dashboard
        </button>
        <button
          onClick={() => setCurrentTab("labs")}
          style={{
            padding: "0 16px",
            height: "100%",
            background: "none",
            border: "none",
            borderBottom: currentTab === "labs" ? `3px solid ${theme.accent}` : "3px solid transparent",
            color: currentTab === "labs" ? theme.text1 : theme.text2,
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s"
          }}
        >
          🔬 Labs Directory
        </button>
      </div>

      {/* Overview Statistics Row */}
      <div style={{
        padding: "20px 20px 0 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 14
      }}>
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon="🔬"
          color={theme.accent}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
        <StatCard
          title="Active Projects"
          value={activeProjectsCount}
          icon="⚡"
          color={theme.cyan}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
        <StatCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          icon="📈"
          color={theme.green}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
        <StatCard
          title="Completed"
          value={completedProjectsCount}
          icon="🏆"
          color={theme.yellow}
          text2={theme.text2}
          border={theme.border2}
          bg={theme.surf}
        />
      </div>

      {/* ── TAB CONTENT: RESEARCH DASHBOARD ── */}
      {currentTab === "dashboard" && (
        <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", boxSizing: "border-box" }}>
          <style>{`
            @media (max-width: 900px) {
              div[style*="gridTemplateColumns: 2fr 1fr"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Left Side: Projects Management */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Active Projects List */}
            <div style={{ background: theme.surf, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: theme.text1 }}>
                  📁 Research Projects Board
                </h2>

                {/* Filters */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["All", "Active", "Completed", "Archived"].map(filt => (
                    <button
                      key={filt}
                      onClick={() => setDashboardFilter(filt)}
                      style={{
                        padding: "4px 10px",
                        background: dashboardFilter === filt ? theme.accent : theme.surf2,
                        border: `1px solid ${dashboardFilter === filt ? theme.accent : theme.border2}`,
                        borderRadius: 6,
                        color: dashboardFilter === filt ? "#fff" : theme.text2,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {filt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                value={dashboardSearch}
                onChange={e => setDashboardSearch(e.target.value)}
                placeholder="🔍 Search projects by name, category, or status..."
                style={{
                  width: "100%",
                  background: theme.surf2,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: theme.text1,
                  fontSize: "0.82rem",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "16px"
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredProjects.length === 0 ? (
                  <div style={{ color: theme.text3, textAlign: "center", padding: "24px" }}>No projects match your search/filter parameters.</div>
                ) : (
                  filteredProjects.map(p => (
                    <div key={p.id} style={{ background: theme.surf2, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "0.68rem", color: theme.accent, fontWeight: 700, textTransform: "uppercase" }}>{p.category}</span>
                          <h3 style={{ margin: "2px 0 0 0", fontSize: "0.95rem", fontWeight: 700, color: theme.text1 }}>{p.name}</h3>
                          {p.description && <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.4 }}>{p.description}</p>}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEditProject(p)} style={{ background: "none", border: `1px solid ${theme.border2}`, borderRadius: 6, color: theme.cyan, padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer" }}>✏️ Edit</button>
                          {p.archived ? (
                            <button onClick={() => handleRestoreProject(p.id)} style={{ background: "none", border: `1px solid ${theme.border2}`, borderRadius: 6, color: theme.green, padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer" }}>Restore</button>
                          ) : (
                            <button onClick={() => handleArchiveProject(p.id)} style={{ background: "none", border: `1px solid ${theme.border2}`, borderRadius: 6, color: theme.yellow, padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer" }}>Archive</button>
                          )}
                          <button onClick={() => handleDeleteProject(p.id)} style={{ background: "none", border: `1px solid ${theme.border2}`, borderRadius: 6, color: theme.red, padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer" }}>🗑️ Delete</button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: theme.text2, marginBottom: "4px" }}>
                          <span>Status: <strong>{p.status}</strong></span>
                          <strong>{p.progress}%</strong>
                        </div>
                        <div style={{ height: "6px", background: theme.border, borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${p.progress}%`, height: "100%", background: p.status === "Completed" ? theme.green : theme.accent, borderRadius: "3px" }} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Project Creator Form */}
            <div style={{ background: theme.surf, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 800, color: theme.text1 }}>
                {editingProjectId ? "✏️ Edit Project" : "➕ Create Research Project"}
              </h2>
              <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    placeholder="e.g. DNA Sequence Pathfinding Heuristic"
                    style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "10px 12px", color: theme.text1, fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Description</label>
                  <textarea
                    rows={2}
                    value={newProjectDesc}
                    onChange={e => setNewProjectDesc(e.target.value)}
                    placeholder="e.g. Optimize SW alignments to achieve sub-millisecond searches"
                    style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "10px 12px", color: theme.text1, fontSize: "0.85rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Category</label>
                    <select
                      value={newProjectCategory}
                      onChange={e => setNewProjectCategory(e.target.value)}
                      style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "10px 12px", color: theme.text1, fontSize: "0.85rem", outline: "none" }}
                    >
                      <option value="Biomedical">Biomedical</option>
                      <option value="Digital">Digital</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Status</label>
                    <select
                      value={newProjectStatus}
                      onChange={e => setNewProjectStatus(e.target.value)}
                      style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "10px 12px", color: theme.text1, fontSize: "0.85rem", outline: "none" }}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Progress ({newProjectProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProjectProgress}
                    onChange={e => setNewProjectProgress(e.target.value)}
                    style={{ width: "100%", accentColor: theme.accent }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                    {editingProjectId ? "Save Changes" : "Create Project"}
                  </button>
                  {editingProjectId && (
                    <button type="button" onClick={() => { setEditingProjectId(null); setNewProjectName(""); setNewProjectDesc(""); setNewProjectProgress(0); }} style={{ padding: "10px 16px", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, color: theme.text2, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Milestones Directory */}
            <div style={{ background: theme.surf, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 800, color: theme.text1 }}>
                🏆 Logged Milestones Directory
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {milestones.length === 0 ? (
                  <div style={{ color: theme.text3, textAlign: "center", padding: "12px" }}>No milestones logged. Log one below!</div>
                ) : (
                  milestones.map(m => {
                    const pInfo = projects.find(proj => proj.id === m.projectId);
                    return (
                      <div key={m.id} style={{ background: theme.surf2, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: "0.85rem", color: theme.text1 }}>{m.title}</strong>
                          <div style={{ fontSize: "0.74rem", color: theme.text2, marginTop: "2px" }}>{m.desc}</div>
                          <span style={{ display: "inline-block", marginTop: "4px", fontSize: "0.65rem", background: theme.surf, padding: "2px 6px", borderRadius: "4px", color: theme.green }}>{pInfo ? pInfo.name : "Unlinked / General"}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleEditMilestone(m)} style={{ background: "none", border: `1px solid ${theme.border2}`, borderRadius: 6, color: theme.cyan, padding: "3px 6px", fontSize: "0.7rem", cursor: "pointer" }}>Edit</button>
                          <button onClick={() => handleDeleteMilestone(m.id)} style={{ background: "none", border: `1px solid ${theme.border2}`, borderRadius: 6, color: theme.red, padding: "3px 6px", fontSize: "0.7rem", cursor: "pointer" }}>Delete</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Timeline Logs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Timeline View */}
            <div style={{ background: theme.surf, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 800, color: theme.text1 }}>
                ⚡ Research Timeline
              </h2>

              <div style={{ display: "flex", flexDirection: "column", borderLeft: `2px solid ${theme.border2}`, paddingLeft: "16px", gap: "20px", maxHeight: "400px", overflowY: "auto" }}>
                {timeline.length === 0 ? (
                  <div style={{ color: theme.text3, fontSize: "0.8rem", paddingLeft: "8px" }}>No timeline logs recorded.</div>
                ) : (
                  timeline.map(t => (
                    <div key={t.id} style={{ position: "relative" }}>
                      {/* Node point */}
                      <div style={{ position: "absolute", left: "-22px", top: "4px", width: "10px", height: "10px", borderRadius: "50%", background: theme.accent, border: `2px solid ${theme.surf}` }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "0.68rem", color: theme.text3, fontWeight: "bold" }}>{t.date}</span>
                        <button onClick={() => handleDeleteTimeline(t.id)} style={{ background: "none", border: "none", color: theme.text3, cursor: "pointer", fontSize: "0.65rem", padding: 0 }}>✕</button>
                      </div>
                      <h4 style={{ margin: "2px 0", fontSize: "0.82rem", fontWeight: 700, color: theme.text1 }}>{t.title}</h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.72rem", color: theme.text2, lineHeight: 1.3 }}>{t.desc}</p>
                      <span style={{ display: "inline-block", marginTop: "4px", fontSize: "0.65rem", background: theme.surf2, padding: "2px 6px", borderRadius: "4px", color: theme.accent }}>{t.project}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Milestone Log Form */}
            <div style={{ background: theme.surf, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 800, color: theme.text1 }}>
                {editingMilestoneId ? "📝 Edit Milestone" : "🏆 Log Milestone"}
              </h2>
              <form onSubmit={handleAddMilestone} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Title *</label>
                  <input
                    type="text"
                    required
                    value={newMilestoneTitle}
                    onChange={e => setNewMilestoneTitle(e.target.value)}
                    placeholder="e.g. Smith-Waterman optimization approved"
                    style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "8px 10px", color: theme.text1, fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Associated Project *</label>
                  <select
                    required
                    value={newMilestoneProject}
                    onChange={e => setNewMilestoneProject(e.target.value)}
                    style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "8px 10px", color: theme.text1, fontSize: "0.8rem", outline: "none" }}
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: theme.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 4, fontWeight: 600 }}>Description</label>
                  <textarea
                    rows={3}
                    value={newMilestoneDesc}
                    onChange={e => setNewMilestoneDesc(e.target.value)}
                    placeholder="Provide detailed description of the milestone outcome..."
                    style={{ width: "100%", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, padding: "8px 10px", color: theme.text1, fontSize: "0.8rem", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                    {editingMilestoneId ? "Save Changes" : "Log Event"}
                  </button>
                  {editingMilestoneId && (
                    <button type="button" onClick={() => { setEditingMilestoneId(null); setNewMilestoneTitle(""); setNewMilestoneProject(""); setNewMilestoneDesc(""); }} style={{ padding: "10px 16px", background: theme.surf2, border: `1px solid ${theme.border2}`, borderRadius: 8, color: theme.text2, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: LABS DIRECTORY ── */}
      {currentTab === "labs" && (
        <>
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
                    {/* Status badge */}
                    <div style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: theme.greenGlow,
                      border: `1px solid ${theme.green}40`,
                      color: theme.green,
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.5px"
                    }}>
                      ACTIVE
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
        </>
      )}

      {/* Detail Modal Component */}
      <LabDetailsModal
        isOpen={activeLabDetail !== null}
        onClose={() => setActiveLabDetail(null)}
        lab={activeLabDetail}
        theme={theme}
        isLight={isLight}
        onOpenDNA={onOpenDNA}
        onOpenLab={onOpenLab}
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

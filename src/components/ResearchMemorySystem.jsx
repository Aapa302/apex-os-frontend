import React, { useState, useEffect, useMemo, useRef } from "react";

// Pre-populated research memory items
const INITIAL_MEMORIES = [
  {
    id: "mem_1",
    title: "Centromeric Alignments in Chromosome 21",
    type: "AI Observation",
    content: "Vast gap alignments resolved. Noted higher density of sequence matches using recursive dynamic scoring heuristics.",
    tags: ["Genomics", "Heuristics", "Chromosome 21"],
    timestamp: "2026-07-11 14:23",
    severity: "High"
  },
  {
    id: "mem_2",
    title: "Spike Protein Torsional Vector Calibration",
    type: "Experiment Log",
    content: "Rotational forces calculated around the S1 subunit RBD. Found stable convergence limits under 45 degrees of strain.",
    tags: ["Virology", "Protein", "Shear Matrix"],
    timestamp: "2026-07-13 09:12",
    severity: "Medium"
  },
  {
    id: "mem_3",
    title: "Decoherence mapping across 128 logical Qubits",
    type: "Research Paper Notes",
    content: "Microwave telemetry channels mapped successfully. Found coherence drops during continuous multi-channel excitation loops.",
    tags: ["Quantum", "Decoherence", "Calibration"],
    timestamp: "2026-07-14 18:45",
    severity: "Critical"
  }
];

export default function ResearchMemorySystem() {
  const [memories, setMemories] = useState(() => {
    const cached = localStorage.getItem("apex_os_v4_research_memories");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return INITIAL_MEMORIES; }
    }
    return INITIAL_MEMORIES;
  });

  const [isLightMode, setIsLightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // Custom Form fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("AI Observation");
  const [newContent, setNewContent] = useState("");
  const [newTagsString, setNewTagsString] = useState("");
  const [newSeverity, setNewSeverity] = useState("Medium");

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
  }, [memories]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set();
    memories.forEach(m => {
      if (Array.isArray(m.tags)) {
        m.tags.forEach(t => set.add(t));
      }
    });
    return ["All", ...Array.from(set)];
  }, [memories]);

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Title and Content are required!");
      return;
    }

    const newMem = {
      id: `mem_${Date.now()}`,
      title: newTitle,
      type: newType,
      content: newContent,
      tags: newTagsString.split(",").map(t => t.trim()).filter(Boolean),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      severity: newSeverity
    };

    setMemories(prev => [newMem, ...prev]);
    setNewTitle("");
    setNewContent("");
    setNewTagsString("");
    setNewSeverity("Medium");
    alert("Research memory logged successfully!");
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm("Are you sure you want to delete this research memory?")) {
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleRenameMemory = (id) => {
    const item = memories.find(m => m.id === id);
    if (!item) return;
    const newName = window.prompt("Enter new title for this research memory:", item.title);
    if (newName && newName.trim()) {
      setMemories(prev => prev.map(m => m.id === id ? { ...m, title: newName.trim() } : m));
      alert("Research memory renamed successfully!");
    }
  };

  // Export as JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `apex_os_research_memories_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  // Import from JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          // Merge safely or overwrite
          if (window.confirm("Do you want to append imported memories? Click Cancel to overwrite instead.")) {
            setMemories(prev => [...parsed, ...prev]);
          } else {
            setMemories(parsed);
          }
          alert("Research memory system records imported successfully!");
        } else {
          alert("Invalid file format! Expected a JSON array.");
        }
      } catch (err) {
        alert("Error parsing JSON file!");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

  // Filter logic
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (Array.isArray(m.tags) && m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesType = selectedType === "All" || m.type === selectedType;
      const matchesTag = selectedTag === "All" || (Array.isArray(m.tags) && m.tags.includes(selectedTag));
      return matchesSearch && matchesType && matchesTag;
    });
  }, [memories, searchQuery, selectedType, selectedTag]);

  // Design Theme mapping
  const T = isLightMode ? {
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
    green: "#10b981",
    red: "#ef4444",
    cyan: "#06b6d4",
    yellow: "#d97706"
  } : {
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
    green: "#22d3a5",
    red: "#f04060",
    cyan: "#00d4ff",
    yellow: "#f5a623"
  };

  const severityColor = (sev) => {
    if (sev === "Critical") return T.red;
    if (sev === "High") return T.yellow;
    if (sev === "Medium") return T.accent;
    return T.text3;
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
      padding: "24px"
    }}>
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
            <span style={{ fontSize: "1.6rem" }}>🧠</span>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Research Memory System
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Manage long-term knowledge indexing, observations history, scientific calibrations, and exportable research database blocks.
          </p>
        </div>

        {/* Theme Toggle & Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            fontSize: "0.72rem",
            color: T.green,
            background: `${T.green}12`,
            border: `1px solid ${T.green}30`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            SYSTEM MEMORY ONLINE
          </div>
          <button
            onClick={() => setIsLightMode(p => !p)}
            style={{
              padding: "8px 14px",
              background: T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 10,
              color: T.text1,
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </div>

      {/* ── CONTROLS PANEL ── */}
      <div style={{
        background: T.surf,
        border: `1px solid ${T.border2}`,
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}>
        <div style={{ display: "flex", gap: "12px", width: "100%", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Search memory titles, content descriptions, or specific tagging parameters..."
            style={{
              flex: 1,
              background: T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: "8px",
              padding: "10px 14px",
              color: T.text1,
              fontSize: "0.85rem",
              outline: "none"
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleExportJSON}
              style={{
                padding: "10px 16px",
                background: T.surf2,
                border: `1px solid ${T.border2}`,
                borderRadius: "8px",
                color: T.text1,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              📤 Export JSON
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                padding: "10px 16px",
                background: T.surf2,
                border: `1px solid ${T.border2}`,
                borderRadius: "8px",
                color: T.text1,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              📥 Import JSON
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: T.text3 }}>Type:</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "6px", padding: "6px 10px", color: T.text1, fontSize: "0.78rem" }}
            >
              <option value="All">All Types</option>
              <option value="AI Observation">AI Observation</option>
              <option value="Experiment Log">Experiment Log</option>
              <option value="Research Paper Notes">Research Paper Notes</option>
              <option value="Custom Note">Custom Note</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: T.text3 }}>Tag:</span>
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "6px", padding: "6px 10px", color: T.text1, fontSize: "0.78rem" }}
            >
              {allTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN MAIN PANEL ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "24px",
        alignItems: "start",
        flex: 1
      }}>
        {/* LEFT COLUMN: Memories Listing */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredMemories.length === 0 ? (
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "60px",
              textAlign: "center",
              color: T.text3
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🧠</div>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No matching knowledge index entries in database.</p>
            </div>
          ) : (
            filteredMemories.map(m => (
              <div
                key={m.id}
                style={{
                  background: T.surf,
                  border: `1px solid ${T.border2}`,
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.15)`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      background: `${T.accent}15`,
                      color: T.accent,
                      padding: "3px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}>
                      {m.type}
                    </span>
                    <span style={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      border: `1px solid ${severityColor(m.severity)}40`,
                      background: `${severityColor(m.severity)}12`,
                      color: severityColor(m.severity),
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      {m.severity} Priority
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: T.text3 }}>{m.timestamp}</span>
                    <button
                      onClick={() => handleRenameMemory(m.id)}
                      style={{ background: "none", border: "none", color: T.cyan, cursor: "pointer", fontSize: "0.78rem" }}
                    >
                      ✏️ Rename
                    </button>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.78rem" }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>

                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.05rem", fontWeight: 800, color: T.text1 }}>
                  {m.title}
                </h3>

                <p style={{ margin: "0 0 16px 0", fontSize: "0.85rem", color: T.text2, lineHeight: 1.6 }}>
                  {m.content}
                </p>

                {/* Tags mapping */}
                {Array.isArray(m.tags) && m.tags.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {m.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: `${T.cyan}12`,
                        color: T.cyan,
                        padding: "2px 8px",
                        borderRadius: "12px"
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: Add custom memory forms */}
        <div style={{
          background: T.surf,
          border: `1px solid ${T.border2}`,
          borderRadius: "16px",
          padding: "24px"
        }}>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", fontWeight: 800 }}>➕ Add Knowledge Entry</h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "0.76rem", color: T.text2 }}>
            Log custom empirical studies, dynamic pipeline sequences or general notes into the Research Memory cluster.
          </p>

          <form onSubmit={handleAddMemory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Conformational structural stability under 40K strain"
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none" }}
                >
                  <option value="AI Observation">AI Observation</option>
                  <option value="Experiment Log">Experiment Log</option>
                  <option value="Research Paper Notes">Research Paper Notes</option>
                  <option value="Custom Note">Custom Note</option>
                </select>
              </div>

              <div>
                <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Severity/Priority</label>
                <select
                  value={newSeverity}
                  onChange={e => setNewSeverity(e.target.value)}
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none" }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Observations / Memory Content *</label>
              <textarea
                rows={5}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Details of observations, calibration parameters, molecular matrix configurations..."
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none", resize: "none", fontFamily: "inherit" }}
              />
            </div>

            <div>
              <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Tags (comma-separated)</label>
              <input
                type="text"
                value={newTagsString}
                onChange={e => setNewTagsString(e.target.value)}
                placeholder="e.g. Molecular, Virology, DNA"
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "11px 18px",
                background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Add Memory Block
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

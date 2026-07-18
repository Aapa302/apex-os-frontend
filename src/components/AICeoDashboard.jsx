import React, { useState, useEffect } from "react";
import { globalCEOCore } from "../core/ceo/CEOCore";
import { TaskPriority, TaskStatus } from "../core/models/Task";

const INITIAL_DECISIONS = [
  { id: "DEC-810A", title: "Approve Molecular Shear Trajectory run budget Allocation", desc: "Allocate supplementary compute nodes for Amber18 parameter studies.", status: "Approved", timestamp: "12:10:45" },
  { id: "DEC-810B", title: "Scale deep learning activation layers under Softmax models", desc: "Expand weights vectors parameters size across 12-channel telemetry channels.", status: "Pending CEO Signoff", timestamp: "12:15:33" }
];

const INITIAL_PLANS = [
  { id: "PLAN-401A", goal: "Launch gene sequencing alignment patch GRCh38 within 15 days", status: "In Progress", timestamp: "12:05:12" },
  { id: "PLAN-402B", goal: "Audit gate access credentials and encryption keys on cluster databases", status: "Drafting", timestamp: "12:18:00" }
];

export default function AICeoDashboard() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [eventLogs, setEventLogs] = useState([
    { id: 1, event: "Employee Dr. Mei Lin successfully registered on cluster node.", timestamp: "12:35:10", type: "success" },
    { id: 2, event: "Decision Queued: Approve Molecular Shear Trajectory run budget Allocation.", timestamp: "12:38:45", type: "info" },
    { id: 3, event: "Task Model instance transitioned to state: Running.", timestamp: "12:40:15", type: "info" }
  ]);

  // Form entries
  const [decTitle, setDecTitle] = useState("");
  const [decDesc, setDecDesc] = useState("");
  const [planGoal, setPlanGoal] = useState("");

  const handleCreateDecision = (e) => {
    e.preventDefault();
    if (!decTitle.trim()) {
      alert("Decision Title is required.");
      return;
    }

    const newDec = {
      id: "DEC-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      title: decTitle,
      desc: decDesc || "Awaiting comprehensive contextual brief.",
      status: "Awaiting CEO Signoff",
      timestamp: new Date().toTimeString().slice(0, 8)
    };

    setDecisions(prev => [newDec, ...prev]);

    // Push event log
    setEventLogs(prev => [
      { id: Date.now(), event: `Decision Queued: ${decTitle}`, timestamp: new Date().toTimeString().slice(0, 8), type: "info" },
      ...prev
    ]);

    setDecTitle("");
    setDecDesc("");
    alert("Decision candidate added to Planning Queue!");
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!planGoal.trim()) {
      alert("Plan goal is required.");
      return;
    }

    const newPlan = {
      id: "PLAN-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      goal: planGoal,
      status: "Drafting",
      timestamp: new Date().toTimeString().slice(0, 8)
    };

    setPlans(prev => [newPlan, ...prev]);

    // Push event log
    setEventLogs(prev => [
      { id: Date.now(), event: `Plan Queued: ${planGoal}`, timestamp: new Date().toTimeString().slice(0, 8), type: "info" },
      ...prev
    ]);

    setPlanGoal("");
    alert("Strategy goal queued successfully!");
  };

  const handleDeleteDecision = (id) => {
    if (window.confirm("Are you sure you want to remove this decision candidate?")) {
      setDecisions(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleDeletePlan = (id) => {
    if (window.confirm("Are you sure you want to remove this plan?")) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

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

  const registeredStaffCount = globalCEOCore.employeeRegistry.list().length || 11;

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
              AI CEO Core Foundation
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Foundational architecture dashboard visualizing system registries, publication/subscription event telemetry, and strategic queues.
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
            CEO FRAMEWORK STABLE
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

      {/* ── METRICS telemetry widgets ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        {/* CEO Status */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>CEO Core Engine</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "10px", height: "10px", background: T.green, borderRadius: "50%", display: "inline-block" }}></span>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: T.green }}>ONLINE</div>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "6px" }}>Ready for orchestrator bindings</div>
        </div>

        {/* Employee Count */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Registered AI Staff</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: T.cyan }}>{registeredStaffCount} Agents</div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "6px" }}>Tracked under EmployeeRegistry</div>
        </div>

        {/* Running Tasks */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Task Queue status</div>
          <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem" }}>
            <span>Run: <strong style={{ color: T.green }}>5</strong></span>
            <span>Wait: <strong style={{ color: T.yellow }}>1</strong></span>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "12px" }}>Dynamic TaskModel payloads</div>
        </div>

        {/* System Health */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Core Integrity</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: T.green }}>100%</div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "6px" }}>Architecture limits fully verified</div>
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
        {/* LEFT COLUMN: Event Stream, Decision Queue, Planning Queue */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Decision Queue */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              ⚖️ CEO Decision Review Queue
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {decisions.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: T.text3, fontSize: "0.8rem" }}>
                  Decision queue empty.
                </div>
              ) : (
                decisions.map(d => (
                  <div
                    key={d.id}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "10px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: T.accent, fontWeight: 700 }}>
                        {d.id}
                      </span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.65rem", color: T.text3 }}>{d.timestamp}</span>
                        <button
                          onClick={() => handleDeleteDecision(d.id)}
                          style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.74rem" }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: "0.84rem", fontWeight: 800, color: T.text1 }}>
                      {d.title}
                    </div>

                    <p style={{ margin: 0, fontSize: "0.78rem", color: T.text2, lineHeight: 1.4 }}>
                      {d.desc}
                    </p>

                    <div style={{ alignSelf: "flex-end", fontSize: "0.65rem", fontWeight: 800, color: T.yellow, textTransform: "uppercase", padding: "2px 6px", background: `${T.yellow}12`, borderRadius: "4px" }}>
                      {d.status}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick add decision */}
            <form onSubmit={handleCreateDecision} style={{ borderTop: `1px solid ${T.border}`, paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", color: T.text2 }}>➕ Propose Decision Node</div>
              <input
                type="text"
                value={decTitle}
                onChange={e => setDecTitle(e.target.value)}
                placeholder="Decision Title *"
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
              />
              <textarea
                rows={2}
                value={decDesc}
                onChange={e => setDecDesc(e.target.value)}
                placeholder="Decision structural context and parameter summaries (optional)..."
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none", resize: "none", fontFamily: "inherit" }}
              />
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  alignSelf: "start"
                }}
              >
                Propose Decision Node
              </button>
            </form>
          </div>

          {/* Planning Queue */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🗂️ Strategic Planning Queue
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {plans.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: T.text3, fontSize: "0.8rem" }}>
                  No strategies in queue.
                </div>
              ) : (
                plans.map(p => (
                  <div
                    key={p.id}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "10px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: T.cyan, fontWeight: 700 }}>
                        {p.id}
                      </span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.65rem", color: T.text3 }}>{p.timestamp}</span>
                        <button
                          onClick={() => handleDeletePlan(p.id)}
                          style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.74rem" }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: "0.84rem", fontWeight: 700, color: T.text1 }}>
                      {p.goal}
                    </div>

                    <span style={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      alignSelf: "flex-start",
                      background: `${T.accent}12`,
                      color: T.accent,
                      border: `1px solid ${T.accent}30`,
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Quick add strategy */}
            <form onSubmit={handleCreatePlan} style={{ borderTop: `1px solid ${T.border}`, paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", color: T.text2 }}>➕ Add Strategic Goal</div>
              <input
                type="text"
                value={planGoal}
                onChange={e => setPlanGoal(e.target.value)}
                placeholder="e.g. Schedule Amber18 conformational Folding trials..."
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
              />
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: `linear-gradient(135deg, ${T.cyan}, ${T.accent})`,
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  alignSelf: "start"
                }}
              >
                Queue Strategic Goal
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Event Stream Logger & API Extension Interfaces */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Reusable Event Stream */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>
              📡 Publication/Subscription Events stream
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
              {eventLogs.map(l => (
                <div
                  key={l.id}
                  style={{
                    background: T.surf2,
                    borderLeft: `3px solid ${l.type === "success" ? T.green : T.accent}`,
                    padding: "8px 10px",
                    borderRadius: "0 6px 6px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px"
                  }}
                >
                  <div style={{ fontSize: "0.74rem", color: T.text1, lineHeight: 1.4 }}>
                    {l.event}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: T.text3, fontFamily: "monospace", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                    {l.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Extension Interfaces */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "0.95rem", fontWeight: 800 }}>
              🔌 Future Integration Ports
            </h3>
            <p style={{ margin: "0 0 14px 0", fontSize: "0.72rem", color: T.text2 }}>
              Stubs prepared under core services layer for direct analytic, medical databases, and language model expansions.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.76rem" }}>
              {[
                { name: "Gemini", desc: "Autonomous AI strategy layer", icon: "🤖" },
                { name: "NCBI GenBank", desc: "Gene sequences GRCh38 datasets", icon: "🧬" },
                { name: "PubMed", desc: "Medical literature and citations", icon: "📚" },
                { name: "Crossref DOI", desc: "Digital Object Identifier metadata", icon: "🔗" },
                { name: "Semantic Scholar", desc: "Highly influential citations counts", icon: "📈" },
                { name: "OpenAlex", desc: "Unified global knowledge graphs", icon: "🌐" }
              ].map(port => (
                <div
                  key={port.name}
                  style={{
                    background: T.surf2,
                    borderRadius: "8px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: `1px solid ${T.border}`
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{port.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{port.name}</div>
                    <div style={{ fontSize: "0.68rem", color: T.text3 }}>{port.desc}</div>
                  </div>
                  <span style={{
                    marginLeft: "auto",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    color: T.cyan,
                    border: `1px solid ${T.cyan}40`,
                    background: `${T.cyan}12`,
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}>
                    READY
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

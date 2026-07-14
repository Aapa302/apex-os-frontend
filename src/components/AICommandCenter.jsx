import React, { useState, useMemo, useEffect } from "react";

// Demo and sample data for the AI Command Center
const INITIAL_EMPLOYEES = [
  {
    id: "researcher",
    name: "Dr. Mei Lin",
    title: "Research Engineer",
    icon: "🔬",
    color: "#06b6d4",
    status: "Active",
    task: "Analyzing sequence matrices for gene structural folding dynamics",
    progress: 84,
    lastActivity: "10 mins ago"
  },
  {
    id: "engineer",
    name: "Sarah Kim",
    title: "Software Engineer",
    icon: "⚙️",
    color: "#22d3a5",
    status: "Active",
    task: "Optimizing database clusters and building responsive React layouts",
    progress: 68,
    lastActivity: "2 mins ago"
  },
  {
    id: "tester",
    name: "Alex Thorne",
    title: "Tester",
    icon: "🧪",
    color: "#ef4444",
    status: "Idle",
    task: "E2E playwright coverage reviews & regression validation checks",
    progress: 100,
    lastActivity: "1 hour ago"
  },
  {
    id: "writer",
    name: "John Doe",
    title: "Documentation Writer",
    icon: "📝",
    color: "#a78bfa",
    status: "Active",
    task: "Drafting technical guidelines & complete API reference books",
    progress: 42,
    lastActivity: "15 mins ago"
  },
  {
    id: "analyst",
    name: "Ryan Thompson",
    title: "Data Analyst",
    icon: "📈",
    color: "#0ea5e9",
    status: "Active",
    task: "Modeling monthly revenue predictions & team velocity reports",
    progress: 91,
    lastActivity: "4 mins ago"
  },
  {
    id: "security",
    name: "Marcus Cole",
    title: "Security Analyst",
    icon: "🛡️",
    color: "#f5a623",
    status: "Active",
    task: "Auditing authentication pipelines & proxy gateway security rules",
    progress: 55,
    lastActivity: "30 mins ago"
  }
];

const INITIAL_QUEUE = [
  { id: "TASK-4801", priority: "Critical", assignee: "Dr. Mei Lin", status: "Running", progress: 84, eta: "4m" },
  { id: "TASK-4802", priority: "High", assignee: "Sarah Kim", status: "Running", progress: 68, eta: "12m" },
  { id: "TASK-4803", priority: "High", assignee: "Ryan Thompson", status: "Running", progress: 91, eta: "3m" },
  { id: "TASK-4804", priority: "Medium", assignee: "Marcus Cole", status: "Running", progress: 55, eta: "19m" },
  { id: "TASK-4805", priority: "Low", assignee: "John Doe", status: "Running", progress: 42, eta: "45m" },
  { id: "TASK-4806", priority: "Critical", assignee: "Sarah Kim", status: "Queued", progress: 0, eta: "Pending" }
];

const INITIAL_TIMELINE = [
  { id: 1, type: "system", event: "APEX AI CEO initial alignment check complete.", time: "12:45:10", status: "success" },
  { id: 2, type: "task", event: "Sarah Kim completed build task sequence for Formula Library.", time: "12:42:33", status: "success" },
  { id: 3, type: "security", event: "Security scan of database cluster proxy gateway initiated.", time: "12:35:00", status: "info" },
  { id: 4, type: "research", event: "Dr. Mei Lin discovered optimal structural folding candidates.", time: "12:20:15", status: "success" },
  { id: 5, type: "warning", event: "High CPU threshold detected (82.4% occupancy rate).", time: "11:55:40", status: "warning" }
];

export default function AICommandCenter() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [notifSound, setNotifSound] = useState(true);
  const [notifPopups, setNotifPopups] = useState(true);

  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);

  // New item creation fields
  const [newTaskAssignee, setNewTaskAssignee] = useState("Sarah Kim");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskProgress, setNewTaskProgress] = useState(0);

  // Stats calculation
  const totalCompleted = useMemo(() => {
    return 148; // Sample enterprise counter
  }, []);

  const successRate = useMemo(() => {
    return 98.6; // Sample rate
  }, []);

  const utilizationRate = useMemo(() => {
    const active = employees.filter(e => e.status === "Active").length;
    return Math.round((active / employees.length) * 100);
  }, [employees]);

  const handleAddTask = (e) => {
    e.preventDefault();
    const id = "TASK-" + (4800 + queue.length + 1);
    const newT = {
      id,
      priority: newTaskPriority,
      assignee: newTaskAssignee,
      status: newTaskProgress >= 100 ? "Completed" : "Running",
      progress: parseInt(newTaskProgress, 10) || 0,
      eta: newTaskProgress >= 100 ? "0m" : "15m"
    };

    setQueue(prev => [newT, ...prev]);

    // Add activity log
    const log = {
      id: Date.now(),
      type: "task",
      event: `New task ${id} queued and allocated to ${newTaskAssignee}.`,
      time: new Date().toTimeString().slice(0, 8),
      status: "success"
    };
    setTimeline(prev => [log, ...prev]);

    // Update assignee task/progress
    setEmployees(prev => prev.map(emp => {
      if (emp.name === newTaskAssignee) {
        return {
          ...emp,
          status: "Active",
          task: `Executing tasks assigned under ${id}`,
          progress: parseInt(newTaskProgress, 10) || 0,
          lastActivity: "Just now"
        };
      }
      return emp;
    }));

    setNewTaskProgress(0);
    alert("Task successfully added to Queue!");
  };

  const handleClearTimeline = () => {
    setTimeline([]);
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

  const priorityColor = (pri) => {
    if (pri === "Critical") return T.red;
    if (pri === "High") return T.yellow;
    if (pri === "Medium") return T.accent;
    return T.text2;
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
            <span style={{ fontSize: "1.6rem" }}>🕹️</span>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              AI Command Center
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Central administration suite for system orchestrations, multi-agent workload distributions, and pipeline metrics.
          </p>
        </div>

        {/* Theme Toggle & Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            fontSize: "0.72rem",
            color: T.accent,
            background: `${T.accent}12`,
            border: `1px solid ${T.accent}30`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            COMMAND CONTROL ONLINE
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

      {/* ── TOP LEVEL STATISTICS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        {/* KPI: AI CEO Status */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>AI CEO Status</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "10px", height: "10px", background: T.green, borderRadius: "50%", display: "inline-block" }}></span>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: T.green }}>ACTIVE</div>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "6px" }}>Core decision heuristics executing perfectly</div>
        </div>

        {/* KPI: AI Utilization */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>AI Utilization</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color: T.cyan }}>{utilizationRate}%</div>
          <div style={{ background: T.surf2, borderRadius: "4px", height: "4px", overflow: "hidden", marginTop: "8px" }}>
            <div style={{ width: `${utilizationRate}%`, background: T.cyan, height: "100%" }}></div>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "6px" }}>Ratio of executing model agents</div>
        </div>

        {/* KPI: System Health */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>System Health</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color: T.green }}>100%</div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "6px" }}>Gateway connections and endpoints secure</div>
        </div>

        {/* KPI: Resource Footprint */}
        <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "14px", padding: "16px" }}>
          <div style={{ fontSize: "0.72rem", color: T.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hardware Occupancy</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: T.text1 }}>
            <span>CPU: <strong style={{ color: T.yellow }}>62.4%</strong></span>
            <span>MEM: <strong style={{ color: T.accent }}>4.2 GB</strong></span>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, marginTop: "12px" }}>Dynamic container node telemetry</div>
        </div>
      </div>

      {/* ── TWO-COLUMN CONTROL PANEL ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "24px",
        alignItems: "start",
        flex: 1
      }}>
        {/* LEFT COLUMN: Employee Monitor & Task Queue */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* AI Employee Monitor */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: 800 }}>
              👥 AI Employee Workload Monitor
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px"
            }}>
              {employees.map(emp => (
                <div
                  key={emp.id}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "1.1rem" }}>{emp.icon}</span>
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 800, color: T.text1 }}>{emp.name}</div>
                          <div style={{ fontSize: "0.65rem", color: T.text3 }}>{emp.title}</div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: emp.status === "Active" ? `${T.green}15` : `${T.text3}15`,
                        color: emp.status === "Active" ? T.green : T.text3,
                        border: `1px solid ${emp.status === "Active" ? T.green + "30" : T.border2}`
                      }}>
                        {emp.status}
                      </span>
                    </div>

                    <p style={{ margin: "0 0 10px 0", fontSize: "0.74rem", color: T.text2, lineHeight: 1.4 }}>
                      <strong>Active:</strong> {emp.task}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: T.text3, marginBottom: "4px" }}>
                      <span>Run Progress: {emp.progress}%</span>
                      <span>{emp.lastActivity}</span>
                    </div>
                    <div style={{ background: T.surf, borderRadius: "4px", height: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${emp.progress}%`, background: emp.color || T.accent, height: "100%" }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Queue Table */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "1rem", fontWeight: 800 }}>
              📥 Professional Task Queue
            </h3>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}`, color: T.text3, textTransform: "uppercase", fontSize: "0.68rem" }}>
                    <th style={{ padding: "8px 12px" }}>Task ID</th>
                    <th style={{ padding: "8px 12px" }}>Priority</th>
                    <th style={{ padding: "8px 12px" }}>Assignee</th>
                    <th style={{ padding: "8px 12px" }}>Progress</th>
                    <th style={{ padding: "8px 12px" }}>Status</th>
                    <th style={{ padding: "8px 12px" }}>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map(t => (
                    <tr key={t.id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700 }}>{t.id}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{
                          color: priorityColor(t.priority),
                          fontWeight: 700
                        }}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: T.text2 }}>{t.assignee}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ minWidth: "26px" }}>{t.progress}%</span>
                          <div style={{ width: "60px", background: T.surf2, height: "4px", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ width: `${t.progress}%`, background: priorityColor(t.priority), height: "100%" }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: t.status === "Completed" ? `${T.green}12` : `${T.accent}12`,
                          color: t.status === "Completed" ? T.green : T.accent
                        }}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: T.text3, fontFamily: "monospace" }}>{t.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick alloc task form */}
            <form onSubmit={handleAddTask} style={{ borderTop: `1px solid ${T.border}`, paddingTop: "14px", marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.68rem", color: T.text3, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Allocate To</label>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "6px", padding: "6px", color: T.text1, fontSize: "0.74rem" }}
                >
                  {employees.map(e => <option key={e.id} value={e.name}>{e.name} ({e.title})</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.68rem", color: T.text3, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value)}
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "6px", padding: "6px", color: T.text1, fontSize: "0.74rem" }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.68rem", color: T.text3, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Start Progress ({newTaskProgress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTaskProgress}
                  onChange={e => setNewTaskProgress(e.target.value)}
                  style={{ width: "100%", accentColor: T.accent }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "7px 14px",
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.74rem",
                  cursor: "pointer"
                }}
              >
                Queue Task Block
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Timeline, Settings, and Analytics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Settings Panel */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>
              ⚙️ Command Center Settings
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}`, paddingBottom: "8px" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Autonomous Scheduling</div>
                  <div style={{ fontSize: "0.68rem", color: T.text3 }}>CEO delegates queue blocks dynamically</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAutoMode(p => !p)}
                  style={{
                    padding: "4px 10px",
                    background: isAutoMode ? T.green : T.surf2,
                    border: `1px solid ${isAutoMode ? T.green : T.border2}`,
                    borderRadius: "6px",
                    color: isAutoMode ? "#fff" : T.text2,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {isAutoMode ? "Auto Mode" : "Manual Mode"}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}`, paddingBottom: "8px" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Telemetry Sound Alerts</div>
                  <div style={{ fontSize: "0.68rem", color: T.text3 }}>Audible alerts on critical threshold flags</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSound}
                  onChange={e => setNotifSound(e.target.checked)}
                  style={{ accentColor: T.accent, cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Popup Notifications</div>
                  <div style={{ fontSize: "0.68rem", color: T.text3 }}>In-app alert banners for workflow updates</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifPopups}
                  onChange={e => setNotifPopups(e.target.checked)}
                  style={{ accentColor: T.accent, cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                ⚡ Activity Telemetry Logs
              </h3>
              {timeline.length > 0 && (
                <button
                  onClick={handleClearTimeline}
                  style={{ background: "none", border: "none", color: T.text3, cursor: "pointer", fontSize: "0.7rem" }}
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "240px", overflowY: "auto" }}>
              {timeline.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: T.text3, fontSize: "0.74rem" }}>
                  No system logs registered.
                </div>
              ) : (
                timeline.map(l => (
                  <div
                    key={l.id}
                    style={{
                      background: T.surf2,
                      borderLeft: `3px solid ${l.status === "warning" ? T.red : T.green}`,
                      borderRadius: "0 6px 6px 0",
                      padding: "8px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px"
                    }}
                  >
                    <div style={{ fontSize: "0.74rem", color: T.text1, lineHeight: 1.4 }}>
                      {l.event}
                    </div>
                    <span style={{ fontSize: "0.65rem", color: T.text3, fontFamily: "monospace", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                      {l.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Analytics Overview */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>
              📈 Analytics overview
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ background: T.surf2, borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: T.text3, textTransform: "uppercase" }}>Completed Tasks</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: T.green }}>{totalCompleted}</div>
              </div>

              <div style={{ background: T.surf2, borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: T.text3, textTransform: "uppercase" }}>Success Rate</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: T.cyan }}>{successRate}%</div>
              </div>

              <div style={{ background: T.surf2, borderRadius: "8px", padding: "10px", textAlign: "center", gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "0.68rem", color: T.text3, textTransform: "uppercase", marginBottom: "4px" }}>Current Workspace Sessions</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text1 }}>3 Active Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

const FLOWCHART_PLACEHOLDER_BLOCKS = [
  { id: "f_start", type: "Start", x: 180, y: 50, description: "Entry coordinate: Initializes alignment parameter values." },
  { id: "f_process", type: "Process", x: 140, y: 150, description: "Applies dynamic programming heuristics (Smith-Waterman score iteration)." },
  { id: "f_decision", type: "Decision", x: 130, y: 260, description: "Evaluates score boundary limits against target parameters." },
  { id: "f_end", type: "End", x: 180, y: 390, description: "Saves finalized alignment results and returns metadata map." }
];

export default function FlowchartCanvas({
  flowchartZoom,
  setFlowchartZoom,
  selectedFlowchartBlockId,
  setSelectedFlowchartBlockId,
  onShowToast,
  T
}) {
  const selectedFlowchartBlock = FLOWCHART_PLACEHOLDER_BLOCKS.find(b => b.id === selectedFlowchartBlockId) || null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden", position: "relative" }}>
      {/* Canvas Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", borderRight: `1px solid ${T.border}` }}>
        <div style={{ padding: "12px 20px", background: T.surf, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: T.green, letterSpacing: "0.5px" }}>Flowchart Builder Ready</span>
          </div>
          <div style={{ height: "16px", width: "1px", background: T.border2 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onShowToast("Add Block action triggered (Placeholder only)", "info")} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Add Block</button>
            <button onClick={() => onShowToast("Delete Block action triggered (Placeholder only)", "info")} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Delete Block</button>
            <button onClick={() => { setFlowchartZoom(z => Math.min(1.5, z + 0.1)); onShowToast("Zoomed In", "info"); }} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Zoom In</button>
            <button onClick={() => { setFlowchartZoom(z => Math.max(0.6, z - 0.1)); onShowToast("Zoomed Out", "info"); }} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Zoom Out</button>
            <button onClick={() => { setFlowchartZoom(1.0); onShowToast("Reset Flowchart View", "info"); }} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text2, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Reset View</button>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${T.border2} 1px, transparent 1px)`, backgroundSize: "20px 24px", opacity: 0.8 }} />
          <div style={{ position: "absolute", inset: 0, transform: `scale(${flowchartZoom})`, transformOrigin: "top left", transition: "transform 0.15s ease", padding: "30px", boxSizing: "border-box" }}>
            <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}>
              <g>
                <line x1="240" y1="90" x2="240" y2="150" stroke={T.text3} strokeWidth={2} />
                <polygon points="240,150 236,142 244,142" fill={T.text3} />
                <line x1="240" y1="200" x2="240" y2="260" stroke={T.text3} strokeWidth={2} />
                <polygon points="240,260 236,252 244,252" fill={T.text3} />
                <line x1="240" y1="340" x2="240" y2="390" stroke={T.text3} strokeWidth={2} />
                <polygon points="240,390 236,382 244,382" fill={T.text3} />
              </g>
            </svg>

            {FLOWCHART_PLACEHOLDER_BLOCKS.map(block => {
              const isSelected = selectedFlowchartBlockId === block.id;
              let shapeStyle = {};
              if (block.type === "Start" || block.type === "End") {
                shapeStyle = { borderRadius: "24px", width: "120px", height: "40px" };
              } else if (block.type === "Decision") {
                shapeStyle = { width: "80px", height: "80px", transform: "rotate(45deg)", borderRadius: "6px" };
              } else {
                shapeStyle = { borderRadius: "6px", width: "200px", height: "50px" };
              }
              const xCoord = block.type === "Decision" ? block.x + 60 : block.x;
              const yCoord = block.y;
              return (
                <div key={block.id} onClick={() => setSelectedFlowchartBlockId(isSelected ? null : block.id)} style={{ position: "absolute", left: xCoord, top: yCoord, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", ...shapeStyle, background: isSelected ? T.surf2 : T.surf, border: `2px solid ${isSelected ? T.cyan : block.type === "Start" ? T.green : block.type === "End" ? T.red : block.type === "Decision" ? T.yellow : T.accent}`, boxShadow: isSelected ? `0 0 16px ${T.cyan}35` : "0 4px 8px rgba(0,0,0,0.4)" }}>
                  <div style={{ transform: block.type === "Decision" ? "rotate(-45deg)" : "none", fontSize: "0.78rem", fontWeight: 700, color: isSelected ? T.cyan : T.text1, textAlign: "center", padding: "6px" }}>{block.type}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: "72px", background: T.surf, borderTop: `1px solid ${T.border}`, padding: "12px 18px", display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: T.green, boxShadow: `0 0 10px ${T.green}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.72rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>FLOWCHART MOCKUP READY</div>
            <div style={{ fontSize: "0.8rem", color: T.text1, marginTop: 2, fontWeight: 500 }}>✓ Displaying placeholder blocks only. Dragging and connectors are disabled.</div>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, textAlign: "right" }}>PREVIEW MODE<br />Flowchart Visual Grid Layout</div>
        </div>
      </div>

      {/* Right Sidebar properties */}
      <aside style={{ width: "300px", background: T.surf, padding: "20px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 800, color: T.text1 }}>⚙️ Flowchart Properties</h3>
        {selectedFlowchartBlock ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Type</div>
              <div style={{ fontSize: "0.86rem", fontWeight: 700, color: selectedFlowchartBlock.type === "Start" ? T.green : selectedFlowchartBlock.type === "End" ? T.red : selectedFlowchartBlock.type === "Decision" ? T.yellow : T.accent, marginTop: 2 }}>{selectedFlowchartBlock.type}</div>
              <div style={{ fontSize: "0.62rem", color: T.text3, marginTop: 4 }}>ID: {selectedFlowchartBlock.id}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, marginBottom: 4 }}>Block Description</div>
              <div style={{ fontSize: "0.78rem", color: T.text2, lineHeight: 1.5 }}>{selectedFlowchartBlock.description}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, display: "block", marginBottom: 6 }}>Block Parameters</label>
              <textarea rows={3} defaultValue="Read-only parameter preview" disabled style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text3, fontSize: "0.8rem", fontFamily: "monospace", outline: "none", resize: "none", cursor: "not-allowed", boxSizing: "border-box" }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 10px", color: T.text3, fontSize: "0.8rem", border: `1px dashed ${T.border2}`, borderRadius: 10 }}>Select a placeholder shape on the canvas to inspect its block specifications.</div>
        )}
      </aside>
    </div>
  );
}

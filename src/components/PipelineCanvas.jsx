import React, { useRef, useState } from "react";

const AVAILABLE_BLOCK_TYPES = [
  "Input Data",
  "Data Validation",
  "Compression",
  "DNA Encoding",
  "Error Correction",
  "Metadata Generator",
  "Storage Layer",
  "Retrieval Layer",
  "DNA Decoding",
  "Verification",
  "Output"
];

// Description mappings for blocks
const BLOCK_DESCRIPTIONS = {
  "Input Data": "Specifies primary data source files or streams (e.g., FASTA, CSV, binary formats).",
  "Data Validation": "Performs quality score filters, structural checksum audits, and sequencing error validations.",
  "Compression": "Applies lossy or lossless digital data compression algorithms (e.g., LZW, Huffman coding).",
  "DNA Encoding": "Encodes standard digital binary structures (0s and 1s) into biological nucleobases (A, C, G, T).",
  "Error Correction": "Injects mathematical redundancy (e.g., Reed-Solomon, Hamming codes) to handle physical synthesis degradation.",
  "Metadata Generator": "Creates custom structural identifiers, index parameters, and experiment descriptors.",
  "Storage Layer": "Defines physical container parameters, mapping, or archival microplate placements.",
  "Retrieval Layer": "Models microplate sequencing access interfaces and basecalling indexing guides.",
  "DNA Decoding": "Reconstructs digital binary files back from mapped sequencings of nucleobase alignments.",
  "Verification": "Validates final reconstructed payloads against original input digital signatures/checksums.",
  "Output": "Specifies the terminal endpoint, such as molecular synthesis hardware or decoded output files."
};

export default function PipelineCanvas({
  blocks,
  setBlocks,
  connections,
  setConnections,
  selectedBlockId,
  setSelectedFormulaBlockId,
  selectedConnectionId,
  setSelectedConnectionId,
  zoom,
  setZoom,
  panX,
  setPanX,
  panY,
  setPanY,
  isPanning,
  setIsPanning,
  panStart,
  setPanStart,
  connectingFromBlockId,
  setConnectingFromBlockId,
  history,
  redoStack,
  onUndo,
  onRedo,
  onAddBlock,
  onDeleteSelected,
  onAutoLayout,
  onUpdateBlockMeta,
  validation,
  T
}) {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  // Zoom / Pan canvas handlers local triggers
  const handleCanvasMouseDown = (e) => {
    if (e.button === 2 || e.shiftKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  const handleBlockMouseDown = (e, blockId) => {
    e.stopPropagation();
    setSelectedFormulaBlockId(blockId);
    setSelectedConnectionId(null);

    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    dragRef.current = {
      blockId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: block.x,
      initialY: block.y,
      hasMoved: false
    };

    // Push state before moving
    setBlocks(prev => {
      // Create clone to trigger side effects
      return [...prev];
    });

    document.addEventListener("mousemove", handleBlockMouseMove);
    document.addEventListener("mouseup", handleBlockMouseUp);
  };

  const handleBlockMouseMove = (e) => {
    if (!dragRef.current) return;
    const { blockId, startX, startY, initialX, initialY } = dragRef.current;

    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;

    dragRef.current.hasMoved = true;

    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          x: Math.round(initialX + dx),
          y: Math.round(initialY + dy)
        };
      }
      return b;
    }));
  };

  const handleBlockMouseUp = () => {
    document.removeEventListener("mousemove", handleBlockMouseMove);
    document.removeEventListener("mouseup", handleBlockMouseUp);
    dragRef.current = null;
  };

  // Drag connections
  const handlePortMouseDown = (e, blockId) => {
    e.stopPropagation();
    e.preventDefault();
    setConnectingFromBlockId(blockId);
    document.addEventListener("mouseup", handleGlobalMouseUpForConnection);
  };

  const handlePortMouseUp = (e, targetBlockId) => {
    e.stopPropagation();
    if (connectingFromBlockId && connectingFromBlockId !== targetBlockId) {
      const exists = connections.some(c => c.from === connectingFromBlockId && c.to === targetBlockId);
      if (!exists) {
        setConnections(prev => [...prev, {
          id: `c_${Date.now()}`,
          from: connectingFromBlockId,
          to: targetBlockId
        }]);
      }
    }
    setConnectingFromBlockId(null);
    document.removeEventListener("mouseup", handleGlobalMouseUpForConnection);
  };

  const handleGlobalMouseUpForConnection = () => {
    setConnectingFromBlockId(null);
    document.removeEventListener("mouseup", handleGlobalMouseUpForConnection);
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden", position: "relative" }}>
      {/* Canvas Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", borderRight: `1px solid ${T.border}` }}>
        {/* Toolbox Header */}
        <div style={{ padding: "10px 16px", background: T.surf, borderBottom: `1px solid ${T.border2}`, display: "flex", gap: 8, overflowX: "auto", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: T.text3, fontWeight: 700, textTransform: "uppercase", marginRight: 6 }}>Toolbox</span>
          {AVAILABLE_BLOCK_TYPES.map(type => (
            <button key={type} onClick={() => onAddBlock(type)} style={{ padding: "5px 11px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer" }}>+ {type}</button>
          ))}
        </div>

        {/* Toolbar Controls */}
        <div style={{ padding: "10px 16px", background: T.surf, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button disabled={history.length === 0} onClick={onUndo} style={{ padding: "6px 12px", background: history.length === 0 ? "none" : T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: history.length === 0 ? T.text3 : T.text1, fontSize: "0.74rem", cursor: history.length === 0 ? "default" : "pointer" }}>↩ Undo</button>
            <button disabled={redoStack.length === 0} onClick={onRedo} style={{ padding: "6px 12px", background: redoStack.length === 0 ? "none" : T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: redoStack.length === 0 ? T.text3 : T.text1, fontSize: "0.74rem", cursor: redoStack.length === 0 ? "default" : "pointer" }}>↪ Redo</button>
          </div>
          <div style={{ height: "16px", width: "1px", background: T.border2 }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setZoom(z => Math.min(1.8, z + 0.1))} style={{ padding: "4px 10px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", cursor: "pointer" }}>➕ Zoom In</button>
            <span style={{ fontSize: "0.74rem", color: T.text2, minWidth: "36px", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} style={{ padding: "4px 10px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", cursor: "pointer" }}>➖ Zoom Out</button>
            <button onClick={() => { setZoom(1.0); setPanX(0); setPanY(0); }} style={{ padding: "4px 10px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text2, fontSize: "0.74rem", cursor: "pointer" }}>⊙ Fit</button>
          </div>
          <div style={{ height: "16px", width: "1px", background: T.border2 }} />
          <button onClick={onAutoLayout} style={{ padding: "6px 12px", background: `${T.cyan}12`, border: `1px solid ${T.cyan}40`, borderRadius: 6, color: T.cyan, fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}>🪄 Auto Layout</button>
          <button onClick={onDeleteSelected} disabled={!selectedBlockId && !selectedConnectionId} style={{ padding: "6px 12px", background: (!selectedBlockId && !selectedConnectionId) ? "none" : `${T.red}18`, border: `1px solid ${(!selectedBlockId && !selectedConnectionId) ? T.border2 : T.red + "40"}`, borderRadius: 6, color: (!selectedBlockId && !selectedConnectionId) ? T.text3 : T.red, fontSize: "0.74rem", fontWeight: 700, cursor: (!selectedBlockId && !selectedConnectionId) ? "default" : "pointer", marginLeft: "auto" }}>🗑 Delete Selected</button>
        </div>

        {/* Workspace Canvas */}
        <div ref={canvasRef} onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} style={{ flex: 1, position: "relative", overflow: "hidden", cursor: isPanning ? "grabbing" : "default", userSelect: "none" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${T.border2} 1px, transparent 1px)`, backgroundSize: "24px 24px", opacity: 0.8 }} />
          <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, transformOrigin: "top left", transition: isPanning ? "none" : "transform 0.1s ease" }}>
            <svg style={{ position: "absolute", width: "3000px", height: "2000px", pointerEvents: "none", overflow: "visible", zIndex: 1 }}>
              <defs>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill={T.cyan} /></marker>
              </defs>
              {connections.map(conn => {
                const fromNode = blocks.find(b => b.id === conn.from);
                const toNode = blocks.find(b => b.id === conn.to);
                if (!fromNode || !toNode) return null;
                const x1 = fromNode.x + 160;
                const y1 = fromNode.y + 40;
                const x2 = toNode.x;
                const y2 = toNode.y + 40;
                const dx = Math.abs(x2 - x1) * 0.5;
                const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                const isSelected = selectedConnectionId === conn.id;
                return (
                  <g key={conn.id} style={{ pointerEvents: "all" }}>
                    <path d={pathD} stroke="transparent" strokeWidth={12} fill="none" cursor="pointer" onClick={(e) => { e.stopPropagation(); setSelectedConnectionId(conn.id); setSelectedFormulaBlockId(null); }} />
                    <path d={pathD} stroke={isSelected ? T.cyan : `${T.cyan}99`} strokeWidth={isSelected ? 4 : 2} fill="none" markerEnd="url(#arrowhead)" />
                  </g>
                );
              })}
            </svg>

            {blocks.map(block => {
              const isSelected = selectedBlockId === block.id;
              return (
                <div key={block.id} style={{ position: "absolute", left: block.x, top: block.y, width: "160px", height: "80px", background: isSelected ? T.surf2 : T.surf, border: `2px solid ${isSelected ? T.cyan : T.border2}`, borderRadius: "10px", zIndex: isSelected ? 10 : 5, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: isSelected ? `0 0 16px ${T.cyan}25` : "0 4px 12px rgba(0,0,0,0.5)" }} onMouseDown={(e) => handleBlockMouseDown(e, block.id)}>
                  <div style={{ background: `${T.border}b0`, padding: "6px 10px", borderBottom: `1px solid ${T.border2}`, fontWeight: 700, fontSize: "0.72rem", color: isSelected ? T.cyan : T.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{block.type}</div>
                  <div style={{ flex: 1, padding: "6px 10px", fontSize: "0.64rem", color: T.text3, display: "flex", alignItems: "center" }}>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      ID: {block.id.slice(0, 5)}...
                      {block.params && <div style={{ color: T.text2, marginTop: 2, fontSize: "0.6rem" }}>{block.params.split("\n")[0]}</div>}
                    </div>
                  </div>
                  <div onMouseUp={(e) => handlePortMouseUp(e, block.id)} style={{ position: "absolute", left: "-6px", top: "34px", width: "12px", height: "12px", borderRadius: "50%", background: T.surf2, border: `2px solid ${T.cyan}`, zIndex: 20, cursor: "pointer" }} />
                  <div onMouseDown={(e) => handlePortMouseDown(e, block.id)} style={{ position: "absolute", right: "-6px", top: "34px", width: "12px", height: "12px", borderRadius: "50%", background: T.cyan, border: `2px solid ${T.surf}`, zIndex: 20, cursor: "pointer" }} />
                </div>
              );
            })}
          </div>

          {/* Mini Map */}
          <div style={{ position: "absolute", bottom: 16, right: 16, width: "120px", height: "80px", background: T.glass, border: `1px solid ${T.border2}`, borderRadius: 8, overflow: "hidden", pointerEvents: "none", zIndex: 30, backdropFilter: "blur(6px)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${T.border} 1px, transparent 1px)`, backgroundSize: "8px 8px" }} />
            {blocks.map(b => (
              <div key={b.id} style={{ position: "absolute", left: `${Math.max(2, Math.min(100, b.x * 0.12 + 20))}%`, top: `${Math.max(2, Math.min(70, b.y * 0.12 + 20))}%`, width: "16px", height: "8px", background: selectedBlockId === b.id ? T.cyan : T.text3, borderRadius: "1px", opacity: 0.8 }} />
            ))}
            <div style={{ position: "absolute", bottom: 4, left: 6, fontSize: "0.58rem", color: T.text3, fontWeight: 700 }}>MINI MAP</div>
          </div>
        </div>

        {/* Validation Panel */}
        <div style={{ height: "72px", background: T.surf, borderTop: `1px solid ${T.border}`, padding: "12px 18px", display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: validation.color, boxShadow: `0 0 10px ${validation.color}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.72rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{validation.status}</div>
            <div style={{ fontSize: "0.8rem", color: T.text1, marginTop: 2, fontWeight: 500 }}>{validation.message}</div>
          </div>
          <div style={{ fontSize: "0.68rem", color: T.text3, textAlign: "right" }}>SYSTEM NOMINAL<br />Pipeline Validation Engine v1.0</div>
        </div>
      </div>

      {/* Right Sidebar Block Properties */}
      <aside style={{ width: "300px", background: T.surf, padding: "20px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 800, color: T.text1 }}>⚙️ Block Properties</h3>
        {selectedBlock ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Type</div>
              <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.cyan, marginTop: 2 }}>{selectedBlock.type}</div>
              <div style={{ fontSize: "0.62rem", color: T.text3, marginTop: 4 }}>ID: {selectedBlock.id}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, marginBottom: 4 }}>Block Description</div>
              <div style={{ fontSize: "0.78rem", color: T.text2, lineHeight: 1.5 }}>{BLOCK_DESCRIPTIONS[selectedBlock.type] || "No description available."}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, display: "block", marginBottom: 6 }}>Block Parameters</label>
              <textarea rows={4} value={selectedBlock.params} onChange={(e) => onUpdateBlockMeta("params", e.target.value)} placeholder="e.g. key: value" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.8rem", fontFamily: "monospace", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, display: "block", marginBottom: 6 }}>Design Notes</label>
              <textarea rows={5} value={selectedBlock.notes} onChange={(e) => onUpdateBlockMeta("notes", e.target.value)} placeholder="Add modeling/design notes here..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text2, fontSize: "0.8rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 10px", color: T.text3, fontSize: "0.8rem", border: `1px dashed ${T.border2}`, borderRadius: 10 }}>Select a node module on the canvas to inspect or edit its properties.</div>
        )}
      </aside>
    </div>
  );
}

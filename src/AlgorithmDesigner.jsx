import React, { useState, useEffect, useRef } from "react";

// Design tokens matching App.jsx and ResearchLab.jsx
const T = {
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

const DEFAULT_ALGORITHMS = [
  {
    id: "alg_1",
    name: "Base Aligner v1.0",
    objective: "Perform high-fidelity nucleobase alignment for biological structures.",
    problemStatement: "Current alignments are too slow and fail to identify complex structural transitions in sequence reads.",
    researchNotes: "Integrated basic dynamic programming alignments with Smith-Waterman heuristics. Memory footprint optimized.",
    favorite: true,
    recent: true,
    category: "DNA Sequencing",
    formulas: [
      {
        id: "f_1_1",
        name: "Alignment Match Score Ratio",
        expression: "S_r = (M * c_m - G * c_g) / L",
        description: "Normalizes matches and gap penalty coefficients over the total read length.",
        variables: "M = number of matches\nc_m = match reward constant (e.g. 2.0)\nG = number of gaps\nc_g = gap open penalty constant (e.g. 3.0)\nL = total alignment length",
        units: "Dimensionless ratio (Score/Length)"
      },
      {
        id: "f_1_2",
        name: "Gap Extension Scaling",
        expression: "P_gap = o + e * (k - 1)",
        description: "Calculates the affine gap penalty for continuous sequence read gaps of length k.",
        variables: "o = gap open cost\ne = gap extension cost\nk = length of the gap",
        units: "Heuristic score units"
      }
    ],
    pipeline: {
      blocks: [
        { id: "b1", type: "Input Data", x: 60, y: 160, params: "Format: FASTA\nSize: 4.8 MB", notes: "Primary genome raw sequence reads." },
        { id: "b2", type: "Data Validation", x: 250, y: 160, params: "PhredThreshold: Q30", notes: "Filters out low-quality sequence reads." },
        { id: "b3", type: "DNA Encoding", x: 440, y: 160, params: "Algorithm: Huffman-Bio\nBitsPerBase: 2", notes: "Compiles binary blocks into nucleobase sequences." },
        { id: "b4", type: "Output", x: 630, y: 160, params: "SynthesisTarget: OligoArc", notes: "Synthesized product ready for physical chemical assembly." }
      ],
      connections: [
        { id: "c1", from: "b1", to: "b2" },
        { id: "c2", from: "b2", to: "b3" },
        { id: "c3", from: "b3", to: "b4" }
      ]
    },
    versions: [
      {
        id: "v_1_1_0",
        number: "v1.1.0",
        date: "2026-07-13",
        author: "Sarah Kim",
        description: "Added affine gap extension coefficient calculations and validated mismatch weights.",
        status: "Draft"
      },
      {
        id: "v_1_0_1",
        number: "v1.0.1",
        date: "2026-07-10",
        author: "Alex Chen",
        description: "Fixed local traceback pointer indexing issue for high-throughput fasta files.",
        status: "Review"
      },
      {
        id: "v_1_0_0",
        number: "v1.0.0",
        date: "2026-07-01",
        author: "Sarah Kim",
        description: "Initial release of base aligner featuring primary score matrices and standard dynamic routing.",
        status: "Approved"
      }
    ]
  },
  {
    id: "alg_2",
    name: "CRISPR PAM Searcher",
    objective: "Locate and evaluate optimal PAM guide-RNA match coordinates in target genomes.",
    problemStatement: "High occurrence of off-target edits when mismatch parameters are set manually.",
    researchNotes: "Mapped off-target alignment frequencies against standard genome databases. Working on guides compatibility index.",
    favorite: false,
    recent: true,
    category: "Gene Editing",
    formulas: [
      {
        id: "f_2_1",
        name: "PAM Binding Probability",
        expression: "P_bind = \u03c0 * \u03b7 * e^(- \u0394G / (R * T))",
        description: "Thermodynamic model estimating guide-RNA guide coordination with targeted PAM sequences.",
        variables: "\u03c0 = guide access factor\n\u03b7 = nuclear concentration factor\n\u0394G = structural free energy binding state\nR = universal gas constant\nT = temperature in Kelvin",
        units: "Probability coefficient (0 - 1)"
      }
    ],
    pipeline: {
      blocks: [
        { id: "b2_1", type: "Input Data", x: 80, y: 120, params: "Format: FASTA\nTarget: Cas9-sgRNA", notes: "Guide RNA match profiles." },
        { id: "b2_2", type: "DNA Encoding", x: 280, y: 120, params: "Format: PAM-Custom", notes: "Translate matching coordinates." },
        { id: "b2_3", type: "Storage Layer", x: 480, y: 120, params: "Format: Physical DNA", notes: "Storage sequence alignment parameters." }
      ],
      connections: [
        { id: "c2_1", from: "b2_1", to: "b2_2" },
        { id: "c2_2", from: "b2_2", to: "b2_3" }
      ]
    },
    versions: [
      {
        id: "v_2_0_0",
        number: "v2.0.0",
        date: "2026-07-08",
        author: "Dr. Mei Lin",
        description: "First production release of Cas9 matching model with coordinate indices.",
        status: "Approved"
      }
    ]
  },
  {
    id: "alg_3",
    name: "Double Helix 3D Simulator",
    objective: "Simulate and visualize structural conformation variations under enzymatic friction.",
    problemStatement: "Molecular simulation software lacks realistic force-vector feedback for complex DNA-enzyme complexes.",
    researchNotes: "Calibrated dynamic constraints to use spatial force vectors. Need to test with bigger enzyme samples.",
    favorite: true,
    recent: false,
    category: "Structural Biology",
    formulas: [
      {
        id: "f_3_1",
        name: "Torsional Shear Stress",
        expression: "\u03c4 = (16 * T_m) / (\u03c0 * d^3)",
        description: "Determines torsional shear limits of double-stranded DNA undergoing enzyme-driven unwinding.",
        variables: "T_m = mechanical torque from enzyme translation\nd = outer helix cylinder diameter (e.g. 2.0 nm)",
        units: "Pascals (Pa) or Newtons/m\u00b2"
      }
    ],
    pipeline: {
      blocks: [
        { id: "b3_1", type: "Input Data", x: 100, y: 150, params: "ForceProfile: Active", notes: "Simulation parameters input." }
      ],
      connections: []
    },
    versions: []
  }
];

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

const FLOWCHART_PLACEHOLDER_BLOCKS = [
  { id: "f_start", type: "Start", x: 180, y: 50, description: "Entry coordinate: Initializes alignment parameter values." },
  { id: "f_process", type: "Process", x: 140, y: 150, description: "Applies dynamic programming heuristics (Smith-Waterman score iteration)." },
  { id: "f_decision", type: "Decision", x: 130, y: 260, description: "Evaluates score boundary limits against target parameters." },
  { id: "f_end", type: "End", x: 180, y: 390, description: "Saves finalized alignment results and returns metadata map." }
];

export default function AlgorithmDesigner() {
  const [algorithms, setAlgorithms] = useState(DEFAULT_ALGORITHMS);
  const [selectedId, setSelectedId] = useState("alg_1");
  const [toastMessage, setToastMessage] = useState(null);

  // Workspace active tab: "version_history", "flowchart", "pipeline", "formulas", "metadata"
  const [activeTab, setActiveTab] = useState("version_history");

  // ── 1. ALGORITHM METADATA STATE ──
  const [algName, setAlgName] = useState("");
  const [objective, setObjective] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [researchNotes, setResearchNotes] = useState("");

  // ── 2. FORMULA EDITOR STATE ──
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [formulaName, setFormulaName] = useState("");
  const [formulaExpression, setFormulaExpression] = useState("");
  const [formulaDescription, setFormulaDescription] = useState("");
  const [formulaVariables, setFormulaVariables] = useState("");
  const [formulaUnits, setFormulaUnits] = useState("");

  // ── 3. VISUAL PIPELINE BUILDER STATE ──
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedBlockId, setSelectedFormulaBlockId] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);

  // Canvas Viewport transform (Zoom & Pan)
  const [zoom, setZoom] = useState(1.0);

  const handleZoomIn = () => setZoom(z => Math.min(1.8, z + 0.1));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.1));
  const handleZoomReset = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    showToast("Canvas viewport reset.", "info");
  };
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Connecting ports state
  const [connectingFromBlockId, setConnectingFromBlockId] = useState(null);

  // Undo/Redo Stacks
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // ── 4. VISUAL FLOWCHART STATE (STEP 7D - DISPLAY ONLY) ──
  const [flowchartZoom, setFlowchartZoom] = useState(1.0);
  const [selectedFlowchartBlockId, setSelectedFlowchartBlockId] = useState(null);

  // ── 5. VERSION HISTORY FILTERS STATE (STEP 7E) ──
  const [versionSearch, setVersionSearch] = useState("");
  const [versionStatusFilter, setVersionStatusFilter] = useState("All");

  // Refs
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── DYNAMIC SYNC WHEN ALGORITHM SELECTION CHANGES ──
  useEffect(() => {
    const active = algorithms.find(a => a.id === selectedId);
    if (active) {
      setAlgName(active.name || "");
      setObjective(active.objective || "");
      setProblemStatement(active.problemStatement || "");
      setResearchNotes(active.researchNotes || "");

      // Load formulas
      const activeFormulas = active.formulas || [];
      if (activeFormulas.length > 0) {
        handleLoadFormula(activeFormulas[0]);
      } else {
        handleClearFormulaFields();
      }

      // Load pipeline
      const p = active.pipeline || { blocks: [], connections: [] };
      setBlocks(p.blocks || []);
      setConnections(p.connections || []);
      setSelectedFormulaBlockId(null);
      setSelectedConnectionId(null);
      setSelectedFlowchartBlockId(null);
      setHistory([]);
      setRedoStack([]);
      setZoom(1.0);
      setPanX(0);
      setPanY(0);
      setFlowchartZoom(1.0);
      setVersionSearch("");
      setVersionStatusFilter("All");
    } else {
      setAlgName("");
      setObjective("");
      setProblemStatement("");
      setResearchNotes("");
      handleClearFormulaFields();
      setBlocks([]);
      setConnections([]);
      setSelectedFlowchartBlockId(null);
    }
  }, [selectedId, algorithms]);

  const handleSelectAlgorithm = (alg) => {
    setSelectedId(alg.id);
    showToast(`Loaded ${alg.name}`, "info");
  };

  const handleCreateNewAlgorithm = () => {
    setSelectedId(null);
    setAlgName("");
    setObjective("");
    setProblemStatement("");
    setResearchNotes("");
    handleClearFormulaFields();
    setBlocks([]);
    setConnections([]);
    setSelectedFlowchartBlockId(null);
    showToast("Cleared fields for new algorithm", "info");
  };

  // Save metadata changes back to the algorithms array
  const handleSaveAlgorithmDraft = (e) => {
    if (e) e.preventDefault();
    if (!algName.trim()) {
      showToast("Algorithm Name is required", "error");
      return;
    }

    if (selectedId) {
      setAlgorithms(prev => prev.map(alg => {
        if (alg.id === selectedId) {
          return {
            ...alg,
            name: algName,
            objective,
            problemStatement,
            researchNotes,
            recent: true,
            pipeline: { blocks, connections }
          };
        }
        return alg;
      }));
      showToast("Algorithm draft saved successfully!", "success");
    } else {
      const newAlg = {
        id: `alg_${Date.now()}`,
        name: algName,
        objective,
        problemStatement,
        researchNotes,
        favorite: false,
        recent: true,
        category: "Custom DNA",
        formulas: [],
        pipeline: { blocks, connections },
        versions: []
      };
      setAlgorithms(prev => [newAlg, ...prev]);
      setSelectedId(newAlg.id);
      showToast("New algorithm draft created!", "success");
    }
  };

  const handleCancelAlgorithm = () => {
    if (selectedId) {
      const current = algorithms.find(a => a.id === selectedId);
      if (current) {
        setAlgName(current.name || "");
        setObjective(current.objective || "");
        setProblemStatement(current.problemStatement || "");
        setResearchNotes(current.researchNotes || "");
        showToast("Reverted algorithm changes", "info");
      }
    } else {
      setAlgName("");
      setObjective("");
      setProblemStatement("");
      setResearchNotes("");
      showToast("Cleared unsaved draft", "info");
    }
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === id) {
        const nextFav = !alg.favorite;
        showToast(nextFav ? "Added to Favorites" : "Removed from Favorites", "info");
        return { ...alg, favorite: nextFav };
      }
      return alg;
    }));
  };

  // ── FORMULA EDITOR OPERATIONS ──
  const handleLoadFormula = (formula) => {
    setSelectedFormulaId(formula.id);
    setFormulaName(formula.name || "");
    setFormulaExpression(formula.expression || "");
    setFormulaDescription(formula.description || "");
    setFormulaVariables(formula.variables || "");
    setFormulaUnits(formula.units || "");
  };

  const handleClearFormulaFields = () => {
    setSelectedFormulaId("");
    setFormulaName("");
    setFormulaExpression("");
    setFormulaDescription("");
    setFormulaVariables("");
    setFormulaUnits("");
  };

  const handleNewFormula = () => {
    if (!selectedId) {
      showToast("Please select or save an algorithm before adding formulas.", "error");
      return;
    }
    handleClearFormulaFields();
    showToast("Editor cleared. Create your new formula below.", "info");
  };

  const handleSaveFormula = () => {
    if (!selectedId) {
      showToast("Please select an active algorithm first.", "error");
      return;
    }
    if (!formulaName.trim()) {
      showToast("Formula Name is required", "error");
      return;
    }
    if (!formulaExpression.trim()) {
      showToast("Mathematical Expression is required", "error");
      return;
    }

    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === selectedId) {
        const formulas = alg.formulas || [];
        if (selectedFormulaId) {
          return {
            ...alg,
            formulas: formulas.map(f => {
              if (f.id === selectedFormulaId) {
                return {
                  ...f,
                  name: formulaName,
                  expression: formulaExpression,
                  description: formulaDescription,
                  variables: formulaVariables,
                  units: formulaUnits
                };
              }
              return f;
            })
          };
        } else {
          const newFormula = {
            id: `f_${Date.now()}`,
            name: formulaName,
            expression: formulaExpression,
            description: formulaDescription,
            variables: formulaVariables,
            units: formulaUnits
          };
          setSelectedFormulaId(newFormula.id);
          return {
            ...alg,
            formulas: [...formulas, newFormula]
          };
        }
      }
      return alg;
    }));
    showToast("Formula saved successfully!", "success");
  };

  const handleDuplicateFormula = () => {
    if (!selectedFormulaId) {
      showToast("No active formula selected to duplicate.", "error");
      return;
    }

    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === selectedId) {
        const formulas = alg.formulas || [];
        const active = formulas.find(f => f.id === selectedFormulaId);
        if (active) {
          const duplicated = {
            ...active,
            id: `f_${Date.now()}`,
            name: `${active.name} (Copy)`
          };
          setSelectedFormulaId(duplicated.id);
          setFormulaName(duplicated.name);
          showToast(`Duplicated "${active.name}"`, "success");
          return {
            ...alg,
            formulas: [...formulas, duplicated]
          };
        }
      }
      return alg;
    }));
  };

  const handleDeleteFormula = () => {
    if (!selectedFormulaId) {
      showToast("No active formula selected to delete.", "error");
      return;
    }

    setAlgorithms(prev => prev.map(alg => {
      if (alg.id === selectedId) {
        const formulas = alg.formulas || [];
        const nextFormulas = formulas.filter(f => f.id !== selectedFormulaId);
        if (nextFormulas.length > 0) {
          handleLoadFormula(nextFormulas[0]);
        } else {
          handleClearFormulaFields();
        }
        showToast("Formula removed successfully.", "success");
        return {
          ...alg,
          formulas: nextFormulas
        };
      }
      return alg;
    }));
  };

  // ── VISUAL PIPELINE BUILDER OPERATIONS ──
  const pushToHistory = (newBlocks, newConns) => {
    setHistory(prev => [...prev, { blocks, connections }]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, { blocks, connections }]);
    setBlocks(previous.blocks);
    setConnections(previous.connections);
    setHistory(prev => prev.slice(0, -1));
    showToast("Undo action completed.", "info");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, { blocks, connections }]);
    setBlocks(next.blocks);
    setConnections(next.connections);
    setRedoStack(prev => prev.slice(0, -1));
    showToast("Redo action completed.", "info");
  };

  const handleAddBlock = (type) => {
    if (!selectedId) {
      showToast("Please select or create an algorithm first.", "error");
      return;
    }
    pushToHistory(blocks, connections);

    const newBlock = {
      id: `b_${Date.now()}`,
      type,
      x: Math.max(80, 200 - panX),
      y: Math.max(80, 180 - panY),
      params: `Block: ${type}\nParameters: Ready`,
      notes: BLOCK_DESCRIPTIONS[type] || "No notes."
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedFormulaBlockId(newBlock.id);
    showToast(`Added ${type} block.`, "success");
  };

  // Block dragging & Pan interactions
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

    pushToHistory(blocks, connections);

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
    if (dragRef.current && !dragRef.current.hasMoved) {
      setHistory(prev => prev.slice(0, -1));
    }
    dragRef.current = null;
  };

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
      if (exists) {
        showToast("Connection already exists.", "error");
      } else {
        pushToHistory(blocks, connections);
        const newConn = {
          id: `c_${Date.now()}`,
          from: connectingFromBlockId,
          to: targetBlockId
        };
        setConnections(prev => [...prev, newConn]);
        showToast("Blocks connected successfully.", "success");
      }
    }
    setConnectingFromBlockId(null);
    document.removeEventListener("mouseup", handleGlobalMouseUpForConnection);
  };

  const handleGlobalMouseUpForConnection = () => {
    setConnectingFromBlockId(null);
    document.removeEventListener("mouseup", handleGlobalMouseUpForConnection);
  };

  const handleAutoLayout = () => {
    if (blocks.length === 0) return;
    pushToHistory(blocks, connections);

    const mappedX = {};
    const processed = new Set();
    let currentRank = 0;

    let sources = blocks.filter(b => !connections.some(c => c.to === b.id));
    if (sources.length === 0 && blocks.length > 0) {
      sources = [blocks[0]];
    }

    let queue = [...sources];
    while (queue.length > 0) {
      const nextLevel = [];
      queue.forEach(b => {
        if (!processed.has(b.id)) {
          processed.add(b.id);
          mappedX[b.id] = 120 + currentRank * 210;
          const targets = connections.filter(c => c.from === b.id).map(c => c.to);
          targets.forEach(tid => {
            const targetBlock = blocks.find(node => node.id === tid);
            if (targetBlock) nextLevel.push(targetBlock);
          });
        }
      });
      queue = nextLevel;
      currentRank++;
    }

    setBlocks(prev => prev.map((b, idx) => {
      const x = mappedX[b.id] || (120 + idx * 150);
      const y = 180 + (idx % 2 === 0 ? 0 : 40);
      return { ...b, x, y };
    }));

    showToast("Auto Layout executed.", "info");
  };

  const handleDeleteSelectedElement = () => {
    if (selectedBlockId) {
      pushToHistory(blocks, connections);
      setBlocks(prev => prev.filter(b => b.id !== selectedBlockId));
      setConnections(prev => prev.filter(c => c.from !== selectedBlockId && c.to !== selectedBlockId));
      setSelectedFormulaBlockId(null);
      showToast("Block and its connections deleted.", "success");
    } else if (selectedConnectionId) {
      pushToHistory(blocks, connections);
      setConnections(prev => prev.filter(c => c.id !== selectedConnectionId));
      setSelectedConnectionId(null);
      showToast("Connection deleted.", "success");
    } else {
      showToast("Select a block or arrow to delete.", "error");
    }
  };

  const handleUpdateBlockMeta = (key, value) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === selectedBlockId) {
        return { ...b, [key]: value };
      }
      return b;
    }));
  };

  // ── PIPELINE VALIDATION ENGINE (Bottom Panel) ──
  const getPipelineValidation = () => {
    if (blocks.length === 0) {
      return {
        status: "Empty Workspace",
        message: "No blocks placed. Add elements from the toolbox to start modeling.",
        color: T.text3
      };
    }

    const hasInput = blocks.some(b => b.type === "Input Data");
    const hasOutput = blocks.some(b => b.type === "Output");

    if (!hasInput) {
      return { status: "Warning Status", message: "Missing 'Input Data' block. Valid pipeline flows must originate from an Input Data source.", color: T.yellow };
    }
    if (!hasOutput) {
      return { status: "Warning Status", message: "Missing 'Output' terminal block. Set up a Storage Layer or Output block.", color: T.yellow };
    }

    const startBlocks = blocks.filter(b => b.type === "Input Data");
    let reachable = false;

    const visited = new Set();
    const queue = startBlocks.map(b => b.id);
    while (queue.length > 0) {
      const curr = queue.shift();
      visited.add(curr);
      const currBlock = blocks.find(b => b.id === curr);
      if (currBlock?.type === "Output") {
        reachable = true;
        break;
      }
      const outbound = connections.filter(c => c.from === curr).map(c => c.to);
      outbound.forEach(toId => {
        if (!visited.has(toId)) {
          queue.push(toId);
        }
      });
    }

    if (!reachable) {
      return { status: "Invalid Routing", message: "Input Data blocks do not connect to any Output terminals. Draw connections between node ports.", color: T.red };
    }

    return { status: "Pipeline Verified", message: `System validation complete. Connected workflow path verified with ${blocks.length} active node modules.`, color: T.green };
  };

  const validation = getPipelineValidation();

  // Active elements derived
  const activeAlgorithm = algorithms.find(a => a.id === selectedId) || null;
  const activeFormulas = activeAlgorithm?.formulas || [];
  const activeVersions = activeAlgorithm?.versions || [];
  const selectedFlowchartBlock = FLOWCHART_PLACEHOLDER_BLOCKS.find(b => b.id === selectedFlowchartBlockId) || null;
  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  // Filter version history list based on search and status filters
  const filteredVersions = activeVersions.filter(v => {
    const matchesSearch = v.number.toLowerCase().includes(versionSearch.toLowerCase()) ||
                          v.author.toLowerCase().includes(versionSearch.toLowerCase()) ||
                          v.description.toLowerCase().includes(versionSearch.toLowerCase());
    const matchesStatus = versionStatusFilter === "All" || v.status === versionStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{
      background: T.bg,
      color: T.text1,
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Dynamic Tab Switcher Bar */}
      <div style={{
        background: T.surf,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 24px",
        display: "flex",
        gap: 16,
        alignItems: "center",
        height: "50px",
        flexShrink: 0
      }}>
        {[
          { id: "version_history", label: "📋 Version History", color: T.accent2 },
          { id: "flowchart", label: "📊 Flowchart UI", color: T.yellow },
          { id: "pipeline", label: "🎨 Visual Pipeline Builder", color: T.cyan },
          { id: "formulas", label: "🧬 Mathematical Formulas", color: T.pink },
          { id: "metadata", label: "📝 Metadata Draft Editor", color: T.accent }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "0 16px",
              height: "100%",
              background: "none",
              border: "none",
              borderBottom: activeTab === t.id ? `3px solid ${t.color}` : "3px solid transparent",
              color: activeTab === t.id ? T.text1 : T.text2,
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Workspace Wrapper */}
      <div style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: "calc(100vh - 110px)"
      }}>
        {/* ── ALGORITHM SIDEBAR SELECTOR ── */}
        <aside style={{
          width: "280px",
          background: T.surf,
          borderRight: `1px solid ${T.border}`,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          boxSizing: "border-box",
          flexShrink: 0
        }}>
          <button
            onClick={handleCreateNewAlgorithm}
            style={{
              width: "100%",
              padding: "11px",
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "opacity 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            + Create New Draft
          </button>

          {/* Section: My Algorithms */}
          <div>
            <h4 style={{ fontSize: "0.74rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>
              My Algorithms ({algorithms.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {algorithms.map(alg => (
                <div
                  key={alg.id}
                  onClick={() => handleSelectAlgorithm(alg)}
                  style={{
                    background: selectedId === alg.id ? `${T.accent}15` : T.surf2,
                    border: `1px solid ${selectedId === alg.id ? T.accent : T.border2}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: 8 }}>
                    <div style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: selectedId === alg.id ? T.accent : T.text1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>{alg.name || "Untitled Draft"}</div>
                    <div style={{ fontSize: "0.66rem", color: T.text3 }}>{alg.category}</div>
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(alg.id, e)}
                    style={{ background: "none", border: "none", color: alg.favorite ? T.yellow : T.text3, cursor: "pointer", fontSize: "1rem", padding: 0 }}
                  >
                    ★
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recent */}
          <div>
            <h4 style={{ fontSize: "0.74rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>Recent</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {algorithms.filter(a => a.recent).map(alg => (
                <div
                  key={alg.id}
                  onClick={() => handleSelectAlgorithm(alg)}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${selectedId === alg.id ? T.accent : T.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ fontSize: "0.78rem", fontWeight: 500, color: T.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{alg.name || "Untitled Draft"}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── TAB DYNAMIC CONTENTS ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: T.bg
        }}>

          {/* ═══ TAB 1: METADATA DRAFT EDITOR ═══ */}
          {activeTab === "metadata" && (
            <main style={{ padding: "24px", boxSizing: "border-box", maxWidth: "800px", width: "100%", margin: "0 auto" }}>
              <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 12, padding: "20px", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: T.text1 }}>📝 Metadata Editor</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: T.text2 }}>Specify high-level specifications and research parameters.</p>
              </div>

              <form onSubmit={handleSaveAlgorithmDraft} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Algorithm Name *</label>
                  <input
                    type="text"
                    value={algName}
                    onChange={e => setAlgName(e.target.value)}
                    placeholder="e.g. DNA Alignment Model v1.0"
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Objective</label>
                  <input
                    type="text"
                    value={objective}
                    onChange={e => setObjective(e.target.value)}
                    placeholder="Describe design objectives..."
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Problem Statement</label>
                  <textarea
                    rows={4}
                    value={problemStatement}
                    onChange={e => setProblemStatement(e.target.value)}
                    placeholder="State the challenge being solved..."
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 600 }}>Research Notes</label>
                  <textarea
                    rows={5}
                    value={researchNotes}
                    onChange={e => setResearchNotes(e.target.value)}
                    placeholder="Literature citations..."
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 14px", color: T.text1, fontSize: "0.88rem", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button type="submit" style={{ padding: "11px 24px", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Save Draft</button>
                  <button type="button" onClick={handleCancelAlgorithm} style={{ padding: "11px 24px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.text2, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </main>
          )}

          {/* ═══ TAB 2: MATHEMATICAL FORMULAS ═══ */}
          {activeTab === "formulas" && (
            <main style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 12, padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: T.text1 }}>🧬 Mathematical Formula Editor</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem", color: T.text2 }}>Design analytical modeling expressions.</p>
                    </div>
                    {activeAlgorithm && (
                      <select
                        value={selectedFormulaId}
                        onChange={e => {
                          const f = activeFormulas.find(fo => fo.id === e.target.value);
                          if (f) handleLoadFormula(f);
                          else handleClearFormulaFields();
                        }}
                        style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, padding: "6px 12px", color: T.text1, fontSize: "0.78rem", outline: "none", cursor: "pointer" }}
                      >
                        <option value="">-- Select Formula --</option>
                        {activeFormulas.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    )}
                  </div>
                </div>

                <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 12, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", borderBottom: `1px solid ${T.border2}`, paddingBottom: "14px" }}>
                    <button onClick={handleNewFormula} style={{ padding: "7px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.cyan, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}>+ New Formula</button>
                    <button onClick={handleSaveFormula} style={{ padding: "7px 12px", background: `${T.green}18`, border: `1px solid ${T.green}40`, borderRadius: 6, color: T.green, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}>✓ Save Formula</button>
                    <button onClick={handleDuplicateFormula} style={{ padding: "7px 12px", background: `${T.accent}18`, border: `1px solid ${T.accent}40`, borderRadius: 6, color: T.text1, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}>📋 Duplicate</button>
                    <button onClick={handleDeleteFormula} style={{ padding: "7px 12px", background: `${T.red}18`, border: `1px solid ${T.red}40`, borderRadius: 6, color: T.red, fontWeight: 700, fontSize: "0.74rem", cursor: "pointer", marginLeft: "auto" }}>🗑 Delete</button>
                  </div>

                  <div>
                    <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Formula Name *</label>
                    <input type="text" value={formulaName} onChange={e => setFormulaName(e.target.value)} placeholder="e.g. Affinity Score" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none" }} />
                  </div>

                  <div>
                    <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Mathematical Expression *</label>
                    <input type="text" value={formulaExpression} onChange={e => setFormulaExpression(e.target.value)} placeholder="e.g. S = Matches / Length" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.cyan, fontSize: "0.95rem", fontFamily: "monospace", outline: "none" }} />
                  </div>

                  <div>
                    <label style={{ color: T.text3, fontSize: "0.68rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Formula Expression Live Preview</label>
                    <div style={{ background: "#02020a", border: `1px solid ${T.border2}`, borderRadius: 8, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "56px", fontFamily: "monospace", fontSize: "1.1rem", color: formulaExpression ? T.cyan : T.text3, boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)" }}>
                      {formulaExpression || "Awaiting mathematical expression input..."}
                    </div>
                  </div>

                  <div>
                    <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Description</label>
                    <textarea rows={2} value={formulaDescription} onChange={e => setFormulaDescription(e.target.value)} placeholder="Description of biological mechanism..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none", resize: "none", fontFamily: "inherit" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Variables</label>
                      <textarea rows={3} value={formulaVariables} onChange={e => setFormulaVariables(e.target.value)} placeholder="M = match count..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.82rem", outline: "none", resize: "vertical", fontFamily: "monospace" }} />
                    </div>
                    <div>
                      <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Units</label>
                      <input type="text" value={formulaUnits} onChange={e => setFormulaUnits(e.target.value)} placeholder="e.g. score ratio" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.84rem", outline: "none" }} />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* ═══ TAB 3: VISUAL WORKFLOW CANVAS (PIPELINE BUILDER) ═══ */}
          {activeTab === "pipeline" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden", position: "relative" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", borderRight: `1px solid ${T.border}` }}>
                <div style={{ padding: "10px 16px", background: T.surf, borderBottom: `1px solid ${T.border2}`, display: "flex", gap: 8, overflowX: "auto", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.72rem", color: T.text3, fontWeight: 700, textTransform: "uppercase", marginRight: 6 }}>Toolbox</span>
                  {AVAILABLE_BLOCK_TYPES.map(type => (
                    <button key={type} onClick={() => handleAddBlock(type)} style={{ padding: "5px 11px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer" }}>+ {type}</button>
                  ))}
                </div>

                <div style={{ padding: "10px 16px", background: T.surf, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button disabled={history.length === 0} onClick={handleUndo} style={{ padding: "6px 12px", background: history.length === 0 ? "none" : T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: history.length === 0 ? T.text3 : T.text1, fontSize: "0.74rem", cursor: history.length === 0 ? "default" : "pointer" }}>↩ Undo</button>
                    <button disabled={redoStack.length === 0} onClick={handleRedo} style={{ padding: "6px 12px", background: redoStack.length === 0 ? "none" : T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: redoStack.length === 0 ? T.text3 : T.text1, fontSize: "0.74rem", cursor: redoStack.length === 0 ? "default" : "pointer" }}>↪ Redo</button>
                  </div>
                  <div style={{ height: "16px", width: "1px", background: T.border2 }} />
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button onClick={handleZoomIn} style={{ padding: "4px 10px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", cursor: "pointer" }}>➕ Zoom In</button>
                    <span style={{ fontSize: "0.74rem", color: T.text2, minWidth: "36px", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
                    <button onClick={handleZoomOut} style={{ padding: "4px 10px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", cursor: "pointer" }}>➖ Zoom Out</button>
                    <button onClick={handleZoomReset} style={{ padding: "4px 10px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text2, fontSize: "0.74rem", cursor: "pointer" }}>⊙ Fit</button>
                  </div>
                  <div style={{ height: "16px", width: "1px", background: T.border2 }} />
                  <button onClick={handleAutoLayout} style={{ padding: "6px 12px", background: `${T.cyan}12`, border: `1px solid ${T.cyan}40`, borderRadius: 6, color: T.cyan, fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}>🪄 Auto Layout</button>
                  <button onClick={handleDeleteSelectedElement} disabled={!selectedBlockId && !selectedConnectionId} style={{ padding: "6px 12px", background: (!selectedBlockId && !selectedConnectionId) ? "none" : `${T.red}18`, border: `1px solid ${(!selectedBlockId && !selectedConnectionId) ? T.border2 : T.red + "40"}`, borderRadius: 6, color: (!selectedBlockId && !selectedConnectionId) ? T.text3 : T.red, fontSize: "0.74rem", fontWeight: 700, cursor: (!selectedBlockId && !selectedConnectionId) ? "default" : "pointer", marginLeft: "auto" }}>🗑 Delete Selected</button>
                </div>

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

                  <div style={{ position: "absolute", bottom: 16, right: 16, width: "120px", height: "80px", background: T.glass, border: `1px solid ${T.border2}`, borderRadius: 8, overflow: "hidden", pointerEvents: "none", zIndex: 30, backdropFilter: "blur(6px)" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${T.border} 1px, transparent 1px)`, backgroundSize: "8px 8px" }} />
                    {blocks.map(b => (
                      <div key={b.id} style={{ position: "absolute", left: `${Math.max(2, Math.min(100, b.x * 0.12 + 20))}%`, top: `${Math.max(2, Math.min(70, b.y * 0.12 + 20))}%`, width: "16px", height: "8px", background: selectedBlockId === b.id ? T.cyan : T.text3, borderRadius: "1px", opacity: 0.8 }} />
                    ))}
                    <div style={{ position: "absolute", bottom: 4, left: 6, fontSize: "0.58rem", color: T.text3, fontWeight: 700 }}>MINI MAP</div>
                  </div>
                </div>

                <div style={{ height: "72px", background: T.surf, borderTop: `1px solid ${T.border}`, padding: "12px 18px", display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: validation.color, boxShadow: `0 0 10px ${validation.color}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.72rem", color: T.text3, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{validation.status}</div>
                    <div style={{ fontSize: "0.8rem", color: T.text1, marginTop: 2, fontWeight: 500 }}>{validation.message}</div>
                  </div>
                  <div style={{ fontSize: "0.68rem", color: T.text3, textAlign: "right" }}>SYSTEM NOMINAL<br />Pipeline Validation Engine v1.0</div>
                </div>
              </div>

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
                      <textarea rows={4} value={selectedBlock.params} onChange={(e) => handleUpdateBlockMeta("params", e.target.value)} placeholder="e.g. key: value" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text1, fontSize: "0.8rem", fontFamily: "monospace", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.66rem", color: T.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, display: "block", marginBottom: 6 }}>Design Notes</label>
                      <textarea rows={5} value={selectedBlock.notes} onChange={(e) => handleUpdateBlockMeta("notes", e.target.value)} placeholder="Add modeling/design notes here..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 12px", color: T.text2, fontSize: "0.8rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 10px", color: T.text3, fontSize: "0.8rem", border: `1px dashed ${T.border2}`, borderRadius: 10 }}>Select a node module on the canvas to inspect or edit its properties.</div>
                )}
              </aside>
            </div>
          )}

          {/* ═══ TAB 4: VISUAL FLOWCHART BUILDER ═══ */}
          {activeTab === "flowchart" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden", position: "relative" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", borderRight: `1px solid ${T.border}` }}>
                <div style={{ padding: "12px 20px", background: T.surf, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: T.green, letterSpacing: "0.5px" }}>Flowchart Builder Ready</span>
                  </div>
                  <div style={{ height: "16px", width: "1px", background: T.border2 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => showToast("Add Block action triggered (Placeholder only)", "info")} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Add Block</button>
                    <button onClick={() => showToast("Delete Block action triggered (Placeholder only)", "info")} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Delete Block</button>
                    <button onClick={() => { setFlowchartZoom(z => Math.min(1.5, z + 0.1)); showToast("Zoomed In", "info"); }} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Zoom In</button>
                    <button onClick={() => { setFlowchartZoom(z => Math.max(0.6, z - 0.1)); showToast("Zoomed Out", "info"); }} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text1, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Zoom Out</button>
                    <button onClick={() => { setFlowchartZoom(1.0); showToast("Reset Flowchart View", "info"); }} style={{ padding: "6px 12px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 6, color: T.text2, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>Reset View</button>
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
          )}

          {/* ═══ TAB 5: VERSION HISTORY PANEL (STEP 7E) ═══ */}
          {activeTab === "version_history" && (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              boxSizing: "border-box",
              overflowY: "auto"
            }}>
              {/* Toolbar & Filters Header */}
              <div style={{
                background: T.surf,
                border: `1px solid ${T.border2}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: T.text1 }}>
                    📋 Version History Timeline
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.76rem", color: T.text2 }}>
                    Audit trail of all finalized sequence model releases and active drafts.
                  </p>
                </div>

                {/* Filters */}
                <div style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap"
                }}>
                  {/* Search box */}
                  <input
                    type="text"
                    value={versionSearch}
                    onChange={e => setVersionSearch(e.target.value)}
                    placeholder="🔍 Search versions..."
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: 8,
                      padding: "8px 14px",
                      color: T.text1,
                      fontSize: "0.82rem",
                      outline: "none",
                      width: "180px"
                    }}
                  />

                  {/* Status Filter */}
                  <select
                    value={versionStatusFilter}
                    onChange={e => setVersionStatusFilter(e.target.value)}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: 8,
                      padding: "8px 14px",
                      color: T.text1,
                      fontSize: "0.82rem",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              {/* TIMELINE LIST */}
              {filteredVersions.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: T.text3,
                  background: T.surf,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 12
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: 10 }}>📋</div>
                  <div>No version history items match the active filters for this algorithm.</div>
                </div>
              ) : (
                <div style={{
                  position: "relative",
                  paddingLeft: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px"
                }}>
                  {/* Timeline connecting vertical vertical line */}
                  <div style={{
                    position: "absolute",
                    left: "7px",
                    top: "14px",
                    bottom: "14px",
                    width: "2px",
                    background: T.border2
                  }} />

                  {/* Render version cards */}
                  {filteredVersions.map(v => {
                    // Match colors depending on status
                    const statusColor = v.status === "Approved" ? T.green : v.status === "Review" ? T.cyan : T.yellow;

                    return (
                      <div
                        key={v.id}
                        style={{
                          position: "relative",
                          background: T.surf,
                          border: `1px solid ${T.border2}`,
                          borderRadius: 12,
                          padding: "18px 20px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 16
                        }}
                      >
                        {/* Timeline circle point */}
                        <div style={{
                          position: "absolute",
                          left: "-21px",
                          top: "22px",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: statusColor,
                          boxShadow: `0 0 8px ${statusColor}`,
                          zIndex: 5
                        }} />

                        {/* Version details column */}
                        <div style={{ flex: 1, minWidth: "260px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                            <span style={{
                              fontSize: "1rem",
                              fontWeight: 800,
                              color: T.text1
                            }}>{v.number}</span>

                            {/* Status badge */}
                            <span style={{
                              fontSize: "0.66rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: `${statusColor}15`,
                              border: `1px solid ${statusColor}40`,
                              color: statusColor
                            }}>{v.status}</span>
                          </div>

                          {/* Date and Author */}
                          <div style={{ fontSize: "0.74rem", color: T.text3, marginBottom: 8 }}>
                            Released on <strong style={{ color: T.text2 }}>{v.date}</strong> by <strong style={{ color: T.text2 }}>{v.author}</strong>
                          </div>

                          {/* Description */}
                          <p style={{ margin: 0, fontSize: "0.82rem", color: T.text2, lineHeight: 1.5 }}>
                            {v.description}
                          </p>
                        </div>

                        {/* Timeline Card Action Buttons */}
                        <div style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center"
                        }}>
                          <button
                            onClick={() => showToast(`View details for release: ${v.number}`, "info")}
                            style={{
                              padding: "6px 12px",
                              background: T.surf2,
                              border: `1px solid ${T.border2}`,
                              borderRadius: 6,
                              color: T.text1,
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => showToast(`Compare current draft with release: ${v.number}`, "info")}
                            style={{
                              padding: "6px 12px",
                              background: T.surf2,
                              border: `1px solid ${T.border2}`,
                              borderRadius: 6,
                              color: T.text1,
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            Compare
                          </button>
                          <button
                            onClick={() => showToast(`Restore operation simulated: ${v.number} parameters loaded.`, "success")}
                            style={{
                              padding: "6px 12px",
                              background: `${T.accent}12`,
                              border: `1px solid ${T.accent}40`,
                              borderRadius: 6,
                              color: T.text1,
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

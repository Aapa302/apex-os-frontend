import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AlgorithmHeader from "./components/AlgorithmHeader";
import WorkspacePanel from "./components/WorkspacePanel";
import FormulaEditor from "./components/FormulaEditor";
import PipelineCanvas from "./components/PipelineCanvas";
import FlowchartCanvas from "./components/FlowchartCanvas";
import VersionHistory from "./components/VersionHistory";
import ReviewValidation from "./components/ReviewValidation";

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
    description: "Our flagship high-fidelity sequence alignment algorithm designed for DNA-digital conversion.",
    binaryMapping: "00=A, 01=C, 10=G, 11=T",
    dnaMapping: "A=00, C=01, G=10, T=11",
    gcRules: "40-60",
    homopolymerRules: "Max run length 3",
    errorDetection: "CRC-32 Checksum",
    errorCorrection: "Reed-Solomon (255, 223)",
    version: "v1.0.0",
    createdDate: "2026-07-01",
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
    ],
    review: {
      completeness: 92,
      readability: "Excellent",
      innovationScore: 94,
      validationStatus: "Verified",
      notes: "The alignment scoring ratios and dynamic programming heuristics conform fully to standard FASTQ/FASTA sequence definitions.",
      recommendation: "Deploy in optimization environments. Ensure memory bounds are checked against > 10 GB sequence reads.",
      approvalStatus: "Approved"
    }
  },
  {
    id: "alg_2",
    name: "CRISPR PAM Searcher",
    objective: "Locate and evaluate optimal PAM guide-RNA match coordinates in target genomes.",
    description: "Thermodynamic guide-RNA selector with standard matching and PAM identifier configurations.",
    binaryMapping: "00=A, 01=C, 10=G, 11=T",
    dnaMapping: "A=00, C=01, G=10, T=11",
    gcRules: "40-60",
    homopolymerRules: "Max run length 3",
    errorDetection: "Hamming Distance Check",
    errorCorrection: "Reed-Solomon Codes",
    version: "v2.0.0",
    createdDate: "2026-07-08",
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
    ],
    review: {
      completeness: 85,
      readability: "Good",
      innovationScore: 89,
      validationStatus: "Verified",
      notes: "Off-target frequency mapping operates with standard precision indices. Thermodynamics coefficients are fully verified.",
      recommendation: "Provide literature references for free energy state constants. Run benchmark matches.",
      approvalStatus: "Approved"
    }
  },
  {
    id: "alg_3",
    name: "Double Helix 3D Simulator",
    objective: "Simulate and visualize structural conformation variations under enzymatic friction.",
    description: "Force-vector mechanics visualization model mapping double-stranded unwinding shear thresholds.",
    binaryMapping: "00=A, 01=C, 10=G, 11=T",
    dnaMapping: "A=00, C=01, G=10, T=11",
    gcRules: "40-60",
    homopolymerRules: "Max run length 3",
    errorDetection: "None",
    errorCorrection: "None",
    version: "v1.0.0",
    createdDate: "2026-07-15",
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
    versions: [],
    review: {
      completeness: 45,
      readability: "Excellent",
      innovationScore: 95,
      validationStatus: "Pending",
      notes: "Torsional stress math formulas are added, but the simulation workflow pipeline blocks are currently incomplete.",
      recommendation: "Complete pipeline blocks (DNA encoding/decoding and storage/retrieval layers) to allow full topological analysis.",
      approvalStatus: "Needs Work"
    }
  }
];

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

export default function AlgorithmDesigner() {
  const [algorithms, setAlgorithms] = useState(() => {
    try {
      // Verified localStorage persistence key: 'apex_os_algorithms'
      const saved = localStorage.getItem("apex_os_algorithms");
      return saved ? JSON.parse(saved) : DEFAULT_ALGORITHMS;
    } catch (e) {
      console.error("Error reading algorithms from localStorage", e);
      return DEFAULT_ALGORITHMS;
    }
  });
  const [selectedId, setSelectedId] = useState(() => {
    return localStorage.getItem("apex_os_selected_algorithm_id") || "alg_1";
  });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (selectedId) {
      localStorage.setItem("apex_os_selected_algorithm_id", selectedId);
    }
  }, [selectedId]);

  const syncAlgorithmToResearchMemory = (alg) => {
    try {
      const cached = localStorage.getItem("apex_os_v4_research_memories");
      let memories = [];
      if (cached) {
        memories = JSON.parse(cached);
      }
      const memId = `mem_alg_${alg.id}`;
      // Remove existing
      memories = memories.filter(m => m.id !== memId);
      // Add new
      memories.unshift({
        id: memId,
        title: `[Algorithm] ${alg.name}`,
        type: "AI Observation",
        content: `Objective: ${alg.objective}\nDescription: ${alg.description || ""}\nBinary Mapping: ${alg.binaryMapping || ""}\nDNA Mapping: ${alg.dnaMapping || ""}\nGC Rules: ${alg.gcRules || ""}\nHomopolymer Rules: ${alg.homopolymerRules || ""}\nError Detection: ${alg.errorDetection || ""}\nError Correction: ${alg.errorCorrection || ""}\nVersion: ${alg.version || ""}\nCreated Date: ${alg.createdDate || ""}\nProblem Statement: ${alg.problemStatement || ""}\nResearch Notes: ${alg.researchNotes || ""}`,
        tags: [alg.category || "Custom DNA", "Algorithm"],
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        severity: "Medium"
      });
      localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
    } catch (err) {
      console.error("Error syncing algorithm to research memory:", err);
    }
  };

  const removeAlgorithmFromResearchMemory = (algId) => {
    try {
      const cached = localStorage.getItem("apex_os_v4_research_memories");
      if (cached) {
        let memories = JSON.parse(cached);
        memories = memories.filter(m => m.id !== `mem_alg_${algId}`);
        localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
      }
    } catch (err) {
      console.error("Error removing algorithm from research memory:", err);
    }
  };

  // Workspace active tab: "review", "version_history", "flowchart", "pipeline", "formulas", "metadata"
  const [activeTab, setActiveTab] = useState("review");

  // ── 1. ALGORITHM METADATA STATE ──
  const [algName, setAlgName] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [binaryMapping, setBinaryMapping] = useState("");
  const [dnaMapping, setDnaMapping] = useState("");
  const [gcRules, setGcRules] = useState("");
  const [homopolymerRules, setHomopolymerRules] = useState("");
  const [errorDetection, setErrorDetection] = useState("");
  const [errorCorrection, setErrorCorrection] = useState("");
  const [version, setVersion] = useState("");
  const [createdDate, setCreatedDate] = useState("");
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

  // ── 6. REVIEW & VALIDATION STATE (STEP 7F) ──
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewRecommendation, setReviewRecommendation] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Approved");

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Zoom handlers definition
  const handleZoomIn = () => setZoom(z => Math.min(1.8, z + 0.1));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.1));
  const handleZoomReset = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    showToast("Canvas viewport reset.", "info");
  };

  // Save algorithms to localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem("apex_os_algorithms", JSON.stringify(algorithms));
    } catch (e) {
      console.error("Error writing algorithms to localStorage", e);
    }
  }, [algorithms]);

  // ── DYNAMIC SYNC WHEN ALGORITHM SELECTION CHANGES ──
  useEffect(() => {
    const active = algorithms.find(a => a.id === selectedId);
    if (active) {
      setAlgName(active.name || "");
      setObjective(active.objective || "");
      setDescription(active.description || "");
      setBinaryMapping(active.binaryMapping || "00=A, 01=C, 10=G, 11=T");
      setDnaMapping(active.dnaMapping || "A=00, C=01, G=10, T=11");
      setGcRules(active.gcRules || "40-60");
      setHomopolymerRules(active.homopolymerRules || "Max run length 3");
      setErrorDetection(active.errorDetection || "CRC-32 Checksum");
      setErrorCorrection(active.errorCorrection || "Reed-Solomon (255, 223)");
      setVersion(active.version || "v1.0.0");
      setCreatedDate(active.createdDate || "2026-07-01");
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

      // Load review details (STEP 7F)
      const rev = active.review || { notes: "", recommendation: "", approvalStatus: "Approved" };
      setReviewNotes(rev.notes || "");
      setReviewRecommendation(rev.recommendation || "");
      setApprovalStatus(rev.approvalStatus || "Approved");
    } else {
      setAlgName("");
      setObjective("");
      setDescription("");
      setBinaryMapping("");
      setDnaMapping("");
      setGcRules("");
      setHomopolymerRules("");
      setErrorDetection("");
      setErrorCorrection("");
      setVersion("");
      setCreatedDate("");
      setProblemStatement("");
      setResearchNotes("");
      handleClearFormulaFields();
      setBlocks([]);
      setConnections([]);
      setSelectedFlowchartBlockId(null);
      setReviewNotes("");
      setReviewRecommendation("");
      setApprovalStatus("Approved");
    }
  }, [selectedId, algorithms]);

  const handleSelectAlgorithm = (alg) => {
    setSelectedId(alg.id);
    showToast(`Loaded ${alg.name}`, "info");
  };

  const handleCreateNewAlgorithm = () => {
    const newId = `alg_${Date.now()}`;
    const newAlg = {
      id: newId,
      name: "New Untangled Sequence Draft",
      objective: "Enter objective...",
      description: "Enter description...",
      binaryMapping: "00=A, 01=C, 10=G, 11=T",
      dnaMapping: "A=00, C=01, G=10, T=11",
      gcRules: "40-60",
      homopolymerRules: "Max run length 3",
      errorDetection: "CRC-32 Checksum",
      errorCorrection: "Reed-Solomon (255, 223)",
      version: "v1.0.0",
      createdDate: new Date().toISOString().split("T")[0],
      problemStatement: "",
      researchNotes: "",
      favorite: false,
      recent: true,
      category: "Custom DNA",
      formulas: [],
      pipeline: { blocks: [], connections: [] },
      versions: [],
      review: {
        completeness: 10,
        readability: "Pending",
        innovationScore: 50,
        validationStatus: "Pending",
        notes: "",
        recommendation: "",
        approvalStatus: "Needs Work"
      }
    };
    setAlgorithms(prev => [newAlg, ...prev]);
    setSelectedId(newId);
    syncAlgorithmToResearchMemory(newAlg);
    showToast("Created a new DNA algorithm draft", "success");
  };

  const handleDuplicateAlgorithm = (id, e) => {
    if (e) e.stopPropagation();
    const active = algorithms.find(a => a.id === id);
    if (!active) return;
    const duplicatedId = `alg_${Date.now()}`;
    const duplicated = {
      ...JSON.parse(JSON.stringify(active)),
      id: duplicatedId,
      name: `${active.name} (Copy)`,
      createdDate: new Date().toISOString().split("T")[0],
      favorite: false,
      recent: true
    };
    setAlgorithms(prev => [duplicated, ...prev]);
    setSelectedId(duplicatedId);
    syncAlgorithmToResearchMemory(duplicated);
    showToast(`Duplicated "${active.name}" successfully`, "success");
  };

  const handleDeleteAlgorithm = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this algorithm?")) {
      setAlgorithms(prev => {
        const nextAlgs = prev.filter(alg => alg.id !== id);
        if (nextAlgs.length === 0) {
          const defaultAlg = {
            id: "alg_1",
            name: "Base Aligner v1.0",
            objective: "Perform high-fidelity nucleobase alignment for biological structures.",
            description: "Our flagship high-fidelity sequence alignment algorithm designed for DNA-digital conversion.",
            binaryMapping: "00=A, 01=C, 10=G, 11=T",
            dnaMapping: "A=00, C=01, G=10, T=11",
            gcRules: "40-60",
            homopolymerRules: "Max run length 3",
            errorDetection: "CRC-32 Checksum",
            errorCorrection: "Reed-Solomon (255, 223)",
            version: "v1.0.0",
            createdDate: "2026-07-01",
            problemStatement: "Current alignments are too slow and fail to identify complex structural transitions in sequence reads.",
            researchNotes: "Integrated basic dynamic programming alignments with Smith-Waterman heuristics. Memory footprint optimized.",
            favorite: true,
            recent: true,
            category: "DNA Sequencing",
            formulas: [],
            pipeline: { blocks: [], connections: [] },
            versions: []
          };
          setSelectedId("alg_1");
          syncAlgorithmToResearchMemory(defaultAlg);
          return [defaultAlg];
        }
        if (selectedId === id) {
          setSelectedId(nextAlgs[0].id);
        }
        return nextAlgs;
      });
      removeAlgorithmFromResearchMemory(id);
      showToast("Algorithm deleted successfully", "success");
    }
  };

  // Save metadata changes back to the algorithms array
  const handleSaveAlgorithmDraft = (e) => {
    if (e) e.preventDefault();
    if (!algName.trim()) {
      showToast("Algorithm Name is required", "error");
      return;
    }

    if (selectedId) {
      const active = algorithms.find(a => a.id === selectedId) || {};
      const updatedAlg = {
        ...active,
        id: selectedId,
        name: algName,
        objective,
        description,
        binaryMapping,
        dnaMapping,
        gcRules,
        homopolymerRules,
        errorDetection,
        errorCorrection,
        version,
        createdDate,
        problemStatement,
        researchNotes,
        recent: true,
        pipeline: { blocks, connections },
        review: {
          ...active.review,
          notes: reviewNotes,
          recommendation: reviewRecommendation,
          approvalStatus
        }
      };
      setAlgorithms(prev => prev.map(alg => (alg.id === selectedId ? updatedAlg : alg)));
      syncAlgorithmToResearchMemory(updatedAlg);
      showToast("Algorithm draft saved successfully!", "success");
    } else {
      const newAlg = {
        id: `alg_${Date.now()}`,
        name: algName,
        objective,
        description,
        binaryMapping,
        dnaMapping,
        gcRules,
        homopolymerRules,
        errorDetection,
        errorCorrection,
        version,
        createdDate: new Date().toISOString().split("T")[0],
        problemStatement,
        researchNotes,
        favorite: false,
        recent: true,
        category: "Custom DNA",
        formulas: [],
        pipeline: { blocks, connections },
        versions: [],
        review: {
          completeness: 50,
          readability: "Good",
          innovationScore: 80,
          validationStatus: "Pending",
          notes: reviewNotes,
          recommendation: reviewRecommendation,
          approvalStatus
        }
      };
      setAlgorithms(prev => [newAlg, ...prev]);
      setSelectedId(newAlg.id);
      syncAlgorithmToResearchMemory(newAlg);
      showToast("New algorithm draft created!", "success");
    }
  };

  const handleValidateAlgorithm = () => {
    // 1. Check name
    if (!algName.trim()) {
      showToast("Validation Failed: Algorithm Name is required.", "error");
      return;
    }
    // 2. Check binaryMapping and dnaMapping
    if (!binaryMapping.trim() || !dnaMapping.trim()) {
      showToast("Validation Failed: Mappings cannot be empty.", "error");
      return;
    }
    // Parse binary mapping entries
    const bEntries = binaryMapping.split(/[,\s;\n]+/).filter(Boolean);
    const dEntries = dnaMapping.split(/[,\s;\n]+/).filter(Boolean);
    if (bEntries.length === 0 || dEntries.length === 0) {
      showToast("Validation Failed: Invalid mapping definitions.", "error");
      return;
    }
    // Check if mappings are valid
    let validMappings = true;
    bEntries.forEach(entry => {
      const parts = entry.split("=");
      if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
        validMappings = false;
      }
    });
    if (!validMappings) {
      showToast("Validation Failed: Binary mapping must be formatted as key=value (e.g. 00=A).", "error");
      return;
    }
    // 3. Check GC rules format (should be numeric range e.g. 40-60)
    const gcParts = gcRules.split("-");
    if (gcParts.length === 2) {
      const min = parseInt(gcParts[0]);
      const max = parseInt(gcParts[1]);
      if (isNaN(min) || isNaN(max) || min < 0 || max > 100 || min > max) {
        showToast("Validation Failed: GC Content range must be valid percentages (e.g. 40-60).", "error");
        return;
      }
    } else {
      showToast("Validation Failed: GC Content Rule must be formatted as min-max (e.g. 40-60).", "error");
      return;
    }

    showToast("Validation Passed: Algorithm specifications are clean and compliant!", "success");
  };

  const handleCancelAlgorithm = () => {
    if (selectedId) {
      const current = algorithms.find(a => a.id === selectedId);
      if (current) {
        setAlgName(current.name || "");
        setObjective(current.objective || "");
        setDescription(current.description || "");
        setBinaryMapping(current.binaryMapping || "00=A, 01=C, 10=G, 11=T");
        setDnaMapping(current.dnaMapping || "A=00, C=01, G=10, T=11");
        setGcRules(current.gcRules || "40-60");
        setHomopolymerRules(current.homopolymerRules || "Max run length 3");
        setErrorDetection(current.errorDetection || "CRC-32 Checksum");
        setErrorCorrection(current.errorCorrection || "Reed-Solomon (255, 223)");
        setVersion(current.version || "v1.0.0");
        setCreatedDate(current.createdDate || "2026-07-01");
        setProblemStatement(current.problemStatement || "");
        setResearchNotes(current.researchNotes || "");
        showToast("Reverted algorithm changes", "info");
      }
    } else {
      setAlgName("");
      setObjective("");
      setDescription("");
      setBinaryMapping("");
      setDnaMapping("");
      setGcRules("");
      setHomopolymerRules("");
      setErrorDetection("");
      setErrorCorrection("");
      setVersion("");
      setCreatedDate("");
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

  // Auto Layout algorithm (Simple Horizontal Rank positioning)
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

  const handleUpdateBlockMeta = (key, value) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === selectedBlockId) {
        return { ...b, [key]: value };
      }
      return b;
    }));
  };

  // ── PIPELINE VALIDATION ENGINE ──
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

  // Selected algorithm review details
  const reviewMeta = activeAlgorithm?.review || {
    completeness: 50,
    readability: "Good",
    innovationScore: 80,
    validationStatus: "Pending"
  };

  // Mockup save review notes
  const handleSaveReviewNotes = () => {
    if (selectedId) {
      setAlgorithms(prev => prev.map(alg => {
        if (alg.id === selectedId) {
          return {
            ...alg,
            review: {
              ...alg.review,
              notes: reviewNotes,
              recommendation: reviewRecommendation,
              approvalStatus
            }
          };
        }
        return alg;
      }));
      showToast("Audit review notes saved!", "success");
    } else {
      showToast("Please save algorithm draft first.", "error");
    }
  };

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
          { id: "review", label: "🔍 Review & Validation", color: T.accent },
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
        {/* REUSABLE SIDEBAR COMPONENT */}
        <Sidebar
          algorithms={algorithms}
          selectedId={selectedId}
          onSelectAlgorithm={handleSelectAlgorithm}
          onCreateNewAlgorithm={handleCreateNewAlgorithm}
          onToggleFavorite={toggleFavorite}
          onDeleteAlgorithm={handleDeleteAlgorithm}
          onDuplicateAlgorithm={handleDuplicateAlgorithm}
          T={T}
        />

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
              {/* REUSABLE HEADER COMPONENT */}
              <AlgorithmHeader selectedId={selectedId} T={T} />
              <div style={{ height: "20px" }} />

              {/* REUSABLE WORKSPACEPANEL COMPONENT */}
              <WorkspacePanel
                algName={algName}
                setAlgName={setAlgName}
                objective={objective}
                setObjective={setObjective}
                description={description}
                setDescription={setDescription}
                binaryMapping={binaryMapping}
                setBinaryMapping={setBinaryMapping}
                dnaMapping={dnaMapping}
                setDnaMapping={setDnaMapping}
                gcRules={gcRules}
                setGcRules={setGcRules}
                homopolymerRules={homopolymerRules}
                setHomopolymerRules={setHomopolymerRules}
                errorDetection={errorDetection}
                setErrorDetection={setErrorDetection}
                errorCorrection={errorCorrection}
                setErrorCorrection={setErrorCorrection}
                version={version}
                setVersion={setVersion}
                createdDate={createdDate}
                setCreatedDate={setCreatedDate}
                problemStatement={problemStatement}
                setProblemStatement={setProblemStatement}
                researchNotes={researchNotes}
                setResearchNotes={setResearchNotes}
                onSave={handleSaveAlgorithmDraft}
                onCancel={handleCancelAlgorithm}
                onValidate={handleValidateAlgorithm}
                T={T}
              />
            </main>
          )}

          {/* ═══ TAB 2: MATHEMATICAL FORMULAS ═══ */}
          {activeTab === "formulas" && (
            <FormulaEditor
              activeAlgorithm={activeAlgorithm}
              selectedFormulaId={selectedFormulaId}
              setSelectedFormulaId={setSelectedFormulaId}
              formulaName={formulaName}
              setFormulaName={setFormulaName}
              formulaExpression={formulaExpression}
              setFormulaExpression={setFormulaExpression}
              formulaDescription={formulaDescription}
              setFormulaDescription={setFormulaDescription}
              formulaVariables={formulaVariables}
              setFormulaVariables={setFormulaVariables}
              formulaUnits={formulaUnits}
              setFormulaUnits={setFormulaUnits}
              onNewFormula={handleNewFormula}
              onSaveFormula={handleSaveFormula}
              onDuplicateFormula={handleDuplicateFormula}
              onDeleteFormula={handleDeleteFormula}
              onLoadFormula={handleLoadFormula}
              onClearFormulaFields={handleClearFormulaFields}
              T={T}
            />
          )}

          {/* ═══ TAB 3: VISUAL WORKFLOW CANVAS (PIPELINE BUILDER) ═══ */}
          {activeTab === "pipeline" && (
            <PipelineCanvas
              blocks={blocks}
              setBlocks={setBlocks}
              connections={connections}
              setConnections={setConnections}
              selectedBlockId={selectedBlockId}
              setSelectedFormulaBlockId={setSelectedFormulaBlockId}
              selectedConnectionId={selectedConnectionId}
              setSelectedConnectionId={setSelectedConnectionId}
              zoom={zoom}
              setZoom={setZoom}
              panX={panX}
              setPanX={setPanX}
              panY={panY}
              setPanY={setPanY}
              isPanning={isPanning}
              setIsPanning={setIsPanning}
              panStart={panStart}
              setPanStart={setPanStart}
              connectingFromBlockId={connectingFromBlockId}
              setConnectingFromBlockId={setConnectingFromBlockId}
              history={history}
              redoStack={redoStack}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onAddBlock={handleAddBlock}
              onDeleteSelected={handleDeleteSelectedElement}
              onAutoLayout={handleAutoLayout}
              onUpdateBlockMeta={handleUpdateBlockMeta}
              validation={validation}
              T={T}
            />
          )}

          {/* ═══ TAB 4: VISUAL FLOWCHART BUILDER ═══ */}
          {activeTab === "flowchart" && (
            <FlowchartCanvas
              flowchartZoom={flowchartZoom}
              setFlowchartZoom={setFlowchartZoom}
              selectedFlowchartBlockId={selectedFlowchartBlockId}
              setSelectedFlowchartBlockId={setSelectedFlowchartBlockId}
              onShowToast={showToast}
              T={T}
            />
          )}

          {/* ═══ TAB 5: VERSION HISTORY PANEL ═══ */}
          {activeTab === "version_history" && (
            <VersionHistory
              activeAlgorithm={activeAlgorithm}
              versionSearch={versionSearch}
              setVersionSearch={setVersionSearch}
              versionStatusFilter={versionStatusFilter}
              setVersionStatusFilter={setVersionStatusFilter}
              onShowToast={showToast}
              T={T}
            />
          )}

          {/* ═══ TAB 6: ALGORITHM REVIEW & VALIDATION PANEL ═══ */}
          {activeTab === "review" && (
            <ReviewValidation
              algName={algName}
              objective={objective}
              activeFormulas={activeFormulas}
              blocks={blocks}
              researchNotes={researchNotes}
              problemStatement={problemStatement}
              reviewNotes={reviewNotes}
              setReviewNotes={setReviewNotes}
              reviewRecommendation={reviewRecommendation}
              setReviewRecommendation={setReviewRecommendation}
              approvalStatus={approvalStatus}
              setApprovalStatus={setApprovalStatus}
              selectedId={selectedId}
              onSaveReview={handleSaveReviewNotes}
              onShowToast={showToast}
              reviewMeta={reviewMeta}
              T={T}
            />
          )}

        </div>
      </div>
    </div>
  );
}

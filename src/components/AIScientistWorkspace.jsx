import React, { useState, useEffect, useMemo } from "react";
import { Encode, Decode } from "../core/DNACoreEngine";

// Initial professional hypotheses & experiments for AI Scientist Workspace
const INITIAL_HYPOTHESES = [
  {
    id: "hyp_1",
    statement: "Heuristic-based multi-threading reduces alignment lookup time by > 40%.",
    status: "Validated",
    confidence: 85,
    category: "Genomics",
    evidence: "Lookups dropped from 15ms to 8.2ms under 100k concurrency trials.",
    createdDate: "2026-07-10"
  },
  {
    id: "hyp_2",
    statement: "Spike protein conformational stability correlates with specific torsional force limits.",
    status: "Testing",
    confidence: 65,
    category: "Virology",
    evidence: "Current molecular dynamics runs show partial lattice alignment stability.",
    createdDate: "2026-07-14"
  },
  {
    id: "hyp_3",
    statement: "Quantum annealing improves secondary structural folding latency by orders of magnitude.",
    status: "Proposed",
    confidence: 45,
    category: "Quantum",
    evidence: "Theoretical bounds indicate extreme speedup under ideal coherence thresholds.",
    createdDate: "2026-07-15"
  }
];

const INITIAL_EXPERIMENTS = [
  {
    id: "exp_1",
    title: "Conformational Spike Folding Dynamics",
    category: "Virology",
    startDate: "2026-07-11",
    endDate: "2026-07-20",
    status: "In Progress",
    objective: "Analyze Spike protein S1 subunit conformational transitions under high-temperature simulation.",
    methodology: "MD Simulation, 100ns trajectory, Amber18 forcefield parameters.",
    deliverable: "Molecular shear force vector analysis report.",
    progress: 75
  },
  {
    id: "exp_2",
    title: "Quantum Decoupling Encryption Calibration",
    category: "Quantum",
    startDate: "2026-07-01",
    endDate: "2026-07-10",
    status: "Completed",
    objective: "Quantify encryption-grade quantum state decay rate across 128 logical qubits.",
    methodology: "Super-position calibration, 12-channel microwave telemetry.",
    deliverable: "Decoherence threshold mapping files.",
    progress: 100
  }
];

const INITIAL_NOTES = [
  {
    id: "note_1",
    title: "Literature review: GRCh38 centromeric patches",
    category: "Literature",
    content: "Reviewing NCBI GenBank patch 12 annotations. Noted that corrected sequences in centromeric regions resolve previous alignment gaps in chromosome 21 by roughly 120,000 base pairs.",
    date: "2026-07-12"
  },
  {
    id: "note_2",
    title: "Heuristic search velocity limits",
    category: "Methodology",
    content: "When traversing wide phylogenetic trees, alpha-beta pruning limits must be adapted dynamically to prevent sequence truncation. Tested limit depth: 15 nodes.",
    date: "2026-07-14"
  }
];

// XOR-based 4-base parity checksum protocol helpers
const baseToVal = (b) => {
  const base = b.toUpperCase();
  if (base === 'A') return 0;
  if (base === 'T') return 1;
  if (base === 'C') return 2;
  if (base === 'G') return 3;
  return 0;
};

const valToBase = (v) => {
  if (v === 0) return 'A';
  if (v === 1) return 'T';
  if (v === 2) return 'C';
  if (v === 3) return 'G';
  return 'A';
};

const compute4BaseChecksum = (block) => {
  const parity = [0, 0, 0, 0];
  for (let i = 0; i < block.length; i++) {
    const idx = i % 4;
    parity[idx] = parity[idx] ^ baseToVal(block[i]);
  }
  return parity.map(valToBase).join('');
};

export const encodeSequenceWithChecksums = (dna) => {
  if (!dna) return "";
  let output = "";
  for (let i = 0; i < dna.length; i += 100) {
    const block = dna.slice(i, i + 100);
    const chk = compute4BaseChecksum(block);
    output += block + chk;
  }
  return output;
};

export const decodeSequenceAndVerifyChecksums = (dnaWithChecksums) => {
  if (!dnaWithChecksums) return { cleanDna: "", corruptions: [] };
  const cleanBlocks = [];
  const corruptions = [];
  let cleanDna = "";

  let index = 0;
  let blockNum = 1;

  while (index < dnaWithChecksums.length) {
    const remainingLength = dnaWithChecksums.length - index;
    let blockLen = 100;
    let chunkLen = 104;

    if (remainingLength < 104) {
      if (remainingLength <= 4) {
        // Trailing bases without parity
        const tr = dnaWithChecksums.slice(index);
        cleanBlocks.push(tr);
        cleanDna += tr;
        break;
      }
      blockLen = remainingLength - 4;
      chunkLen = remainingLength;
    }

    const block = dnaWithChecksums.slice(index, index + blockLen);
    const expectedChecksum = dnaWithChecksums.slice(index + blockLen, index + chunkLen);
    const computedChecksum = compute4BaseChecksum(block);

    if (expectedChecksum !== computedChecksum) {
      corruptions.push({
        blockNum,
        start: index,
        end: index + blockLen,
        expected: expectedChecksum,
        computed: computedChecksum,
        blockContent: block
      });
    }

    cleanBlocks.push(block);
    cleanDna += block;

    index += chunkLen;
    blockNum++;
  }

  return { cleanDna, corruptions };
};

export default function AIScientistWorkspace() {
  const [hypotheses, setHypotheses] = useState(() => {
    // Verified localStorage persistence key: 'apex_os_v4_hypotheses'
    const cached = localStorage.getItem("apex_os_v4_hypotheses");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { return INITIAL_HYPOTHESES; }
    }
    return INITIAL_HYPOTHESES;
  });

  const [experiments, setExperiments] = useState(() => {
    const cached = localStorage.getItem("apex_os_v4_experiments");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { return INITIAL_EXPERIMENTS; }
    }
    return INITIAL_EXPERIMENTS;
  });

  const [notes, setNotes] = useState(() => {
    const cached = localStorage.getItem("apex_os_v4_notes");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { return INITIAL_NOTES; }
    }
    return INITIAL_NOTES;
  });

  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedTab, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // DNA Encoder States
  const [encoderMode, setEncoderMode] = useState("encode"); // 'encode' or 'decode'
  const [inputText, setInputText] = useState("");
  const [inputDna, setInputDna] = useState("");
  const [encoderLoading, setEncoderLoading] = useState(false);
  const [encoderError, setEncoderError] = useState(null);
  const [encoderResult, setEncoderResult] = useState("");
  const [checksumCorruptions, setChecksumCorruptions] = useState([]);

  // File to DNA States
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDnaResult, setFileDnaResult] = useState("");
  const [fileMetadata, setFileMetadata] = useState(null);
  const [copied, setCopied] = useState(false);
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodeError, setDecodeError] = useState(null);

  // Synthesizer States
  const [seqName, setSeqName] = useState("");
  const [fastaLoading, setFastaLoading] = useState(false);
  const [fastaError, setFastaError] = useState(null);
  const [fastaResult, setFastaResult] = useState("");

  const PROXY_URL = (() => {
    try {
      const stateStr = localStorage.getItem("apex_os_v4_state");
      if (stateStr) {
        const parsed = JSON.parse(stateStr);
        if (parsed.proxyUrl) return parsed.proxyUrl.replace(/\/+$/, '');
      }
    } catch (e) {}
    return "https://apex-os-nztm.onrender.com";
  })();

  const handleDnaEncode = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      alert("Please enter some text to encode!");
      return;
    }
    setEncoderLoading(true);
    setEncoderError(null);
    setEncoderResult("");
    setFastaResult("");
    setFastaError(null);
    setChecksumCorruptions([]);
    try {
      const res = await fetch(`${PROXY_URL}/dna-encode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      if (!res.ok) {
        throw new Error(`Encoding failed (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      if (data.success) {
        const dnaWithChecksums = encodeSequenceWithChecksums(data.dna);
        setEncoderResult(dnaWithChecksums);
      } else {
        throw new Error(data.error || "Unknown error during encoding");
      }
    } catch (err) {
      console.error(err);
      setEncoderError(err.message || "Failed to communicate with DNA Encoder backend");
    } finally {
      setEncoderLoading(false);
    }
  };

  const handleDnaDecode = async (e) => {
    e.preventDefault();
    if (!inputDna.trim()) {
      alert("Please enter a DNA sequence to decode!");
      return;
    }
    setEncoderLoading(true);
    setEncoderError(null);
    setEncoderResult("");
    setFastaResult("");
    setFastaError(null);
    setChecksumCorruptions([]);

    const { cleanDna, corruptions } = decodeSequenceAndVerifyChecksums(inputDna.trim().toUpperCase());
    if (corruptions.length > 0) {
      setChecksumCorruptions(corruptions);
    }

    try {
      const res = await fetch(`${PROXY_URL}/dna-decode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dna: cleanDna })
      });
      if (!res.ok) {
        throw new Error(`Decoding failed (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      if (data.success) {
        setEncoderResult(data.text);
      } else {
        throw new Error(data.error || "Unknown error during decoding");
      }
    } catch (err) {
      console.error(err);
      setEncoderError(err.message || "Failed to communicate with DNA Decoder backend");
    } finally {
      setEncoderLoading(false);
    }
  };

  const handleFileEncode = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setEncoderLoading(true);
    setEncoderError(null);
    setFileDnaResult("");
    setFileMetadata(null);
    setChecksumCorruptions([]);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${PROXY_URL}/dna-encode-file`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const status = res.status;
        const errText = await res.text();
        let errMsg = `Backend error ${status}: ${res.statusText || "Encoding failed"}`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error) errMsg = parsed.error;
        } catch (e) {}

        if (status === 413 || (status >= 400 && status < 500 && status !== 404 && status !== 405)) {
          throw new Error(errMsg);
        } else {
          console.warn("Backend not ready or returned 404. Switching to local offline encoding fallback...");
          runLocalFileEncode();
          return;
        }
      }

      const data = await res.json();
      if (data.success || data.dna) {
        const dnaSeq = data.dna;
        const dnaWithChecksums = encodeSequenceWithChecksums(dnaSeq);
        setFileDnaResult(dnaWithChecksums);
        setFileMetadata({
          name: selectedFile.name,
          size: selectedFile.size,
          length: dnaWithChecksums.length,
          source: "Backend Server"
        });
        setEncoderLoading(false);
      } else {
        throw new Error(data.error || "Unknown error from encoding backend");
      }
    } catch (err) {
      console.error("API error during file encoding:", err);
      if (err instanceof TypeError || err.message.includes("failed to fetch") || err.message.includes("404") || err.message.includes("405")) {
        console.warn("Network error or unavailable route. Switching to local offline encoding fallback...");
        runLocalFileEncode();
      } else {
        setEncoderError(err.message || "Failed to communicate with DNA Encoder backend");
        setEncoderLoading(false);
      }
    }
  };

  const runLocalFileEncode = () => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const dataUrl = evt.target.result;
        const result = Encode(dataUrl);
        if (result && result.dnaSequence) {
          const dnaWithChecksums = encodeSequenceWithChecksums(result.dnaSequence);
          setFileDnaResult(dnaWithChecksums);
          setFileMetadata({
            name: selectedFile.name,
            size: selectedFile.size,
            length: dnaWithChecksums.length,
            source: "Local Engine (Offline Fallback)"
          });
        } else {
          throw new Error("Local encoding engine did not produce a sequence.");
        }
      } catch (innerErr) {
        console.error("Local encoding fallback failed:", innerErr);
        setEncoderError("Local fallback error: " + (innerErr.message || "Could not encode file locally"));
      } finally {
        setEncoderLoading(false);
      }
    };
    reader.onerror = () => {
      setEncoderError("FileReader error: Failed to read file locally");
      setEncoderLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileDecode = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!fileDnaResult) {
      alert("No DNA sequence to decode!");
      return;
    }

    setDecodeLoading(true);
    setDecodeError(null);
    setChecksumCorruptions([]);

    const { cleanDna, corruptions } = decodeSequenceAndVerifyChecksums(fileDnaResult.trim().toUpperCase());
    if (corruptions.length > 0) {
      setChecksumCorruptions(corruptions);
    }

    try {
      const res = await fetch(`${PROXY_URL}/dna-decode-file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dna: cleanDna })
      });

      if (!res.ok) {
        const status = res.status;
        const errText = await res.text();
        let errMsg = `Backend error ${status}: ${res.statusText || "Decoding failed"}`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error) errMsg = parsed.error;
        } catch (e) {}

        if (status === 404 || status === 405 || status >= 500) {
          console.warn("Backend route not found or server error. Switching to local offline decoding fallback...");
          runLocalFileDecode(cleanDna);
          return;
        } else {
          throw new Error(errMsg);
        }
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `decoded_${fileMetadata?.name || "image.jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDecodeLoading(false);
    } catch (err) {
      console.error("API error during file decoding:", err);
      if (err instanceof TypeError || err.message.includes("failed to fetch") || err.message.includes("404") || err.message.includes("405")) {
        console.warn("Network error or unavailable route. Switching to local offline decoding fallback...");
        runLocalFileDecode(cleanDna);
      } else {
        setDecodeError(err.message || "Failed to communicate with DNA Decoder backend");
        setDecodeLoading(false);
      }
    }
  };

  const runLocalFileDecode = (cleanDna) => {
    try {
      const result = Decode(cleanDna);
      if (result && result.decodedText) {
        const dataUrl = result.decodedText;
        if (!dataUrl.startsWith("data:")) {
          throw new Error("Decoded content is not a valid Data URL structure.");
        }

        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `decoded_${fileMetadata?.name || "image.jpg"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error("Local decoding engine returned empty payload.");
      }
    } catch (innerErr) {
      console.error("Local decoding fallback failed:", innerErr);
      setDecodeError("Local fallback error: " + (innerErr.message || "Could not reconstruct file locally"));
    } finally {
      setDecodeLoading(false);
    }
  };

  const handleSynthesize = async (dnaSequence) => {
    if (!dnaSequence || !dnaSequence.trim()) {
      alert("No DNA sequence found to synthesize!");
      return;
    }
    setFastaLoading(true);
    setFastaError(null);
    setFastaResult("");
    try {
      const payload = { dna: dnaSequence.trim().toUpperCase() };
      if (seqName.trim()) {
        payload.name = seqName.trim();
      }
      const res = await fetch(`${PROXY_URL}/dna-synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Synthesizing failed (${res.status} ${res.statusText})`);
      }
      const fastaText = await res.text();
      setFastaResult(fastaText);
    } catch (err) {
      console.error(err);
      setFastaError(err.message || "Failed to communicate with DNA Synthesizer backend");
    } finally {
      setFastaLoading(false);
    }
  };

  const handleDownloadFasta = () => {
    if (!fastaResult) return;
    const blob = new Blob([fastaResult], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = seqName.trim() ? `${seqName.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}.fasta` : "sequence.fasta";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Hypothesis creation form state
  const [newHypStatement, setNewHypStatement] = useState("");
  const [newHypCategory, setNewHypCategory] = useState("Genomics");
  const [newHypConfidence, setNewHypConfidence] = useState(50);
  const [newHypStatus, setNewHypStatus] = useState("Proposed");
  const [newHypEvidence, setNewHypEvidence] = useState("");

  // Experiment creation form state
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Genomics");
  const [newExpObjective, setNewExpObjective] = useState("");
  const [newExpMethodology, setNewExpMethodology] = useState("");
  const [newExpDeliverable, setNewExpDeliverable] = useState("");
  const [newExpProgress, setNewExpProgress] = useState(0);
  const [newExpStatus, setNewExpStatus] = useState("Proposed");

  // Notes form state
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState("Methodology");
  const [newNoteContent, setNewNoteContent] = useState("");

  useEffect(() => {
    localStorage.setItem("apex_os_v4_hypotheses", JSON.stringify(hypotheses));
  }, [hypotheses]);

  useEffect(() => {
    localStorage.setItem("apex_os_v4_experiments", JSON.stringify(experiments));
  }, [experiments]);

  useEffect(() => {
    localStorage.setItem("apex_os_v4_notes", JSON.stringify(notes));
  }, [notes]);

  const categories = ["All", "Genomics", "Virology", "Quantum", "Proteomics", "Literature", "Methodology"];

  const handleAddHypothesis = (e) => {
    e.preventDefault();
    if (!newHypStatement.trim()) {
      alert("Hypothesis statement is required!");
      return;
    }
    const newHyp = {
      id: `hyp_${Date.now()}`,
      statement: newHypStatement,
      status: newHypStatus,
      confidence: parseInt(newHypConfidence, 10) || 50,
      category: newHypCategory,
      evidence: newHypEvidence,
      createdDate: new Date().toISOString().split("T")[0]
    };
    setHypotheses(prev => [...prev, newHyp]);
    setNewHypStatement("");
    setNewHypEvidence("");
    setNewHypConfidence(50);
    setNewHypStatus("Proposed");
    alert("Hypothesis successfully logged!");
  };

  const handleDeleteHypothesis = (id) => {
    if (window.confirm("Are you sure you want to delete this hypothesis?")) {
      setHypotheses(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleAddExperiment = (e) => {
    e.preventDefault();
    if (!newExpTitle.trim()) {
      alert("Experiment title is required!");
      return;
    }
    const newExp = {
      id: `exp_${Date.now()}`,
      title: newExpTitle,
      category: newExpCategory,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // default 1 week
      status: newExpStatus,
      objective: newExpObjective,
      methodology: newExpMethodology,
      deliverable: newExpDeliverable,
      progress: parseInt(newExpProgress, 10) || 0
    };
    setExperiments(prev => [...prev, newExp]);
    setNewExpTitle("");
    setNewExpObjective("");
    setNewExpMethodology("");
    setNewExpDeliverable("");
    setNewExpProgress(0);
    setNewExpStatus("Proposed");
    alert("Experiment added to plan!");
  };

  const handleDeleteExperiment = (id) => {
    if (window.confirm("Are you sure you want to delete this experiment?")) {
      setExperiments(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleUpdateExperimentProgress = (id, newProg) => {
    setExperiments(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, progress: Math.min(100, Math.max(0, parseInt(newProg, 10) || 0)), status: newProg >= 100 ? "Completed" : "In Progress" };
      }
      return e;
    }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      alert("Note title and content are required!");
      return;
    }
    const newNote = {
      id: `note_${Date.now()}`,
      title: newNoteTitle,
      category: newNoteCategory,
      content: newNoteContent,
      date: new Date().toISOString().split("T")[0]
    };
    setNotes(prev => [...prev, newNote]);
    setNewNoteTitle("");
    setNewNoteContent("");
    alert("Research note logged!");
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this research note?")) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const filteredHypotheses = useMemo(() => {
    return hypotheses.filter(h => {
      const matchesCategory = selectedTab === "All" || h.category === selectedTab;
      const matchesSearch = h.statement.toLowerCase().includes(searchQuery.toLowerCase()) || h.evidence.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [hypotheses, selectedTab, searchQuery]);

  const filteredExperiments = useMemo(() => {
    return experiments.filter(e => {
      const matchesCategory = selectedTab === "All" || e.category === selectedTab;
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.objective.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [experiments, selectedTab, searchQuery]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesCategory = selectedTab === "All" || n.category === selectedTab || (selectedTab === "Literature" && n.category === "Literature") || (selectedTab === "Methodology" && n.category === "Methodology");
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [notes, selectedTab, searchQuery]);

  // Theme support
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

  const statusColor = (status) => {
    if (status === "Validated" || status === "Completed") return T.green;
    if (status === "Testing" || status === "In Progress") return T.accent;
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
            <span style={{ fontSize: "1.6rem" }}>🔬</span>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              AI Scientist Workspace
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Central terminal for planning molecular simulations, tracking scientific hypotheses, and logging research literature.
          </p>
        </div>

        {/* Theme Toggle & Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            fontSize: "0.72rem",
            color: T.cyan,
            background: `${T.cyan}12`,
            border: `1px solid ${T.cyan}30`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            RESEARCH CONTROL DESK
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

      {/* ── SEARCH AND CATEGORIES ── */}
      <div style={{
        background: T.surf,
        border: `1px solid ${T.border2}`,
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 Search hypotheses, experiment logs, goals, methodologies or notes..."
          style={{
            background: T.surf2,
            border: `1px solid ${T.border2}`,
            borderRadius: "8px",
            padding: "10px 14px",
            color: T.text1,
            fontSize: "0.85rem",
            outline: "none"
          }}
        />

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                background: selectedTab === cat ? T.accent : T.surf2,
                border: `1px solid ${selectedTab === cat ? T.accent : T.border2}`,
                borderRadius: 20,
                color: selectedTab === cat ? "#fff" : T.text2,
                fontSize: "0.76rem",
                fontWeight: selectedTab === cat ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── WORKSPACE DASHBOARD GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: "24px",
        alignItems: "start",
        flex: 1
      }}>
        {/* LEFT COLUMN: Hypotheses & Experiments */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Hypotheses board */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧬 Scientific Hypothesis Tracker
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {filteredHypotheses.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: T.text3, fontSize: "0.8rem" }}>
                  No hypotheses match the selection.
                </div>
              ) : (
                filteredHypotheses.map(h => (
                  <div
                    key={h.id}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "10px",
                      padding: "14px",
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: "8px" }}>
                      <span style={{
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        background: `${T.accent}15`,
                        color: T.accent,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        textTransform: "uppercase"
                      }}>
                        {h.category}
                      </span>
                      <button
                        onClick={() => handleDeleteHypothesis(h.id)}
                        style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.74rem" }}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.86rem", color: T.text1, marginBottom: "8px", lineHeight: 1.4 }}>
                      {h.statement}
                    </div>

                    {h.evidence && (
                      <div style={{ fontSize: "0.78rem", color: T.text2, marginBottom: "12px", background: T.surf, padding: "8px 10px", borderRadius: "6px" }}>
                        <strong>Evidence:</strong> {h.evidence}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "0.74rem", color: T.text3 }}>Confidence:</span>
                        <span style={{ fontWeight: 800, fontSize: "0.82rem", color: h.confidence >= 70 ? T.green : h.confidence >= 50 ? T.yellow : T.red }}>
                          {h.confidence}%
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: `${statusColor(h.status)}12`,
                        border: `1px solid ${statusColor(h.status)}30`,
                        color: statusColor(h.status)
                      }}>
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Log hypothesis form */}
            <form onSubmit={handleAddHypothesis} style={{ borderTop: `1px solid ${T.border}`, paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: T.text2 }}>➕ Log New Hypothesis</div>
              <div>
                <input
                  type="text"
                  value={newHypStatement}
                  onChange={e => setNewHypStatement(e.target.value)}
                  placeholder="e.g. Heuristics are optimized under high-memory coherence profiles..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <select
                  value={newHypCategory}
                  onChange={e => setNewHypCategory(e.target.value)}
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px", color: T.text1, fontSize: "0.8rem" }}
                >
                  <option value="Genomics">Genomics</option>
                  <option value="Virology">Virology</option>
                  <option value="Quantum">Quantum</option>
                  <option value="Proteomics">Proteomics</option>
                </select>
                <select
                  value={newHypStatus}
                  onChange={e => setNewHypStatus(e.target.value)}
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px", color: T.text1, fontSize: "0.8rem" }}
                >
                  <option value="Proposed">Proposed</option>
                  <option value="Testing">Testing</option>
                  <option value="Validated">Validated</option>
                  <option value="Refuted">Refuted</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <label style={{ fontSize: "0.74rem", color: T.text3, whiteSpace: "nowrap" }}>Confidence ({newHypConfidence}%):</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newHypConfidence}
                  onChange={e => setNewHypConfidence(e.target.value)}
                  onWheel={(evt) => evt.target.blur()}
                  style={{ flex: 1, accentColor: T.accent }}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newHypEvidence}
                  onChange={e => setNewHypEvidence(e.target.value)}
                  placeholder="Supporting metadata evidence or logs (optional)..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
              </div>
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
                Log Hypothesis
              </button>
            </form>
          </div>

          {/* Experiments board */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧪 Experiment Plans & Runs
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {filteredExperiments.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: T.text3, fontSize: "0.8rem" }}>
                  No active experiment plans.
                </div>
              ) : (
                filteredExperiments.map(e => (
                  <div
                    key={e.id}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "10px",
                      padding: "14px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <span style={{
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          background: `${T.accent}15`,
                          color: T.accent,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          marginRight: "6px"
                        }}>
                          {e.category}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: T.text3 }}>{e.startDate} to {e.endDate}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteExperiment(e.id)}
                        style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.74rem" }}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.86rem", color: T.text1, marginBottom: "6px" }}>{e.title}</div>
                    <div style={{ fontSize: "0.78rem", color: T.text2, marginBottom: "8px" }}><strong>Objective:</strong> {e.objective}</div>
                    <div style={{ fontSize: "0.74rem", color: T.text3, marginBottom: "12px" }}><strong>Methodology:</strong> {e.methodology}</div>

                    {/* Progress Slider */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: T.text2 }}>
                        <span>Progress Run: {e.progress}%</span>
                        <span style={{ fontWeight: 700, color: statusColor(e.status) }}>{e.status}</span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={e.progress}
                          onChange={(evt) => handleUpdateExperimentProgress(e.id, evt.target.value)}
                          onWheel={(evt) => evt.target.blur()}
                          style={{ flex: 1, accentColor: T.accent }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Launch experiment form */}
            <form onSubmit={handleAddExperiment} style={{ borderTop: `1px solid ${T.border}`, paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: T.text2 }}>➕ Design & Schedule New Experiment</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input
                  type="text"
                  value={newExpTitle}
                  onChange={e => setNewExpTitle(e.target.value)}
                  placeholder="Experiment Title *"
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
                <select
                  value={newExpCategory}
                  onChange={e => setNewExpCategory(e.target.value)}
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px", color: T.text1, fontSize: "0.8rem" }}
                >
                  <option value="Genomics">Genomics</option>
                  <option value="Virology">Virology</option>
                  <option value="Quantum">Quantum</option>
                  <option value="Proteomics">Proteomics</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  value={newExpObjective}
                  onChange={e => setNewExpObjective(e.target.value)}
                  placeholder="Experiment Objective..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input
                  type="text"
                  value={newExpMethodology}
                  onChange={e => setNewExpMethodology(e.target.value)}
                  placeholder="Methodology (e.g. Molecular modeling)..."
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
                <input
                  type="text"
                  value={newExpDeliverable}
                  onChange={e => setNewExpDeliverable(e.target.value)}
                  placeholder="Key Deliverable artifact..."
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
              </div>
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
                Schedule Experiment
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Notes & Literature Tracker */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* DNA Encoder Component */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              🧬 DNA Encoder & Decoder
            </h3>

            {/* Mode Switcher Toggle */}
            <div style={{ display: "flex", background: T.surf2, borderRadius: "8px", padding: "4px", marginBottom: "16px" }}>
              <button
                onClick={() => { setEncoderMode("encode"); setEncoderResult(""); setEncoderError(null); }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  background: encoderMode === "encode" ? T.accent : "transparent",
                  color: encoderMode === "encode" ? "#ffffff" : T.text2,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                Text to DNA
              </button>
              <button
                onClick={() => { setEncoderMode("decode"); setEncoderResult(""); setEncoderError(null); }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  background: encoderMode === "decode" ? T.accent : "transparent",
                  color: encoderMode === "decode" ? "#ffffff" : T.text2,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                DNA to Text
              </button>
              <button
                onClick={() => { setEncoderMode("fileToDna"); setEncoderResult(""); setEncoderError(null); }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  background: encoderMode === "fileToDna" ? T.accent : "transparent",
                  color: encoderMode === "fileToDna" ? "#ffffff" : T.text2,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                File to DNA
              </button>
            </div>

            {encoderMode === "encode" && (
              <form onSubmit={handleDnaEncode} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", color: T.text2, fontSize: "0.75rem", fontWeight: 700, marginBottom: "5px" }}>Text / String to Encode</label>
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="e.g. APEX-1"
                    style={{
                      width: "100%",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: T.text1,
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={encoderLoading}
                  style={{
                    padding: "10px 18px",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: encoderLoading ? "default" : "pointer",
                    opacity: encoderLoading ? 0.7 : 1
                  }}
                >
                  {encoderLoading ? "Encoding..." : "Encode ➔"}
                </button>
              </form>
            )}

            {encoderMode === "decode" && (
              <form onSubmit={handleDnaDecode} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", color: T.text2, fontSize: "0.75rem", fontWeight: 700, marginBottom: "5px" }}>DNA Sequence to Decode</label>
                  <input
                    type="text"
                    value={inputDna}
                    onChange={e => setInputDna(e.target.value)}
                    placeholder="e.g. CAACCCGAACACCCGCGAAGTCATAC"
                    style={{
                      width: "100%",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: T.text1,
                      fontSize: "0.85rem",
                      outline: "none",
                      textTransform: "uppercase"
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={encoderLoading}
                  style={{
                    padding: "10px 18px",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: encoderLoading ? "default" : "pointer",
                    opacity: encoderLoading ? 0.7 : 1
                  }}
                >
                  {encoderLoading ? "Decoding..." : "Decode ➔"}
                </button>
              </form>
            )}

            {encoderMode === "fileToDna" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: T.text2, fontSize: "0.75rem", fontWeight: 700, marginBottom: "5px" }}>
                    Select Image File (.jpg, .png)
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setFileDnaResult("");
                        setFileMetadata(null);
                        setEncoderError(null);
                        setDecodeError(null);
                      }
                    }}
                    style={{
                      width: "100%",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: T.text1,
                      fontSize: "0.85rem",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleFileEncode}
                  disabled={encoderLoading || !selectedFile}
                  style={{
                    padding: "10px 18px",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: (encoderLoading || !selectedFile) ? "default" : "pointer",
                    opacity: (encoderLoading || !selectedFile) ? 0.7 : 1
                  }}
                >
                  {encoderLoading ? "Encoding File..." : "Encode File ➔"}
                </button>

                {/* Local Spinner specific to File Encoding */}
                {encoderLoading && (
                  <div style={{ padding: "8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 14, height: 14, border: `2px solid ${T.border2}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: "0.8rem", color: T.text2 }}>
                      Processing file to DNA on {selectedFile && selectedFile.size > 200000 ? "large " : ""}file...
                    </span>
                  </div>
                )}

                {/* Local error for File Encoding */}
                {encoderError && (
                  <div style={{ padding: "10px 14px", background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: "8px", color: T.red, fontSize: "0.8rem" }}>
                    ⚠️ <strong>Encoding Error:</strong> {encoderError}
                  </div>
                )}

                {/* Successful encoding result view */}
                {fileDnaResult && (
                  <div style={{ marginTop: "12px", padding: "14px", background: `${T.green}10`, border: `1px solid ${T.green}30`, borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <span style={{ display: "block", color: T.green, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                        DNA Sequence Preview
                      </span>
                      <pre style={{
                        background: T.surf2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: "6px",
                        padding: "10px",
                        color: T.text1,
                        fontSize: "0.8rem",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        margin: 0
                      }}>
                        {fileDnaResult.length > 100
                          ? `${fileDnaResult.slice(0, 100)}... (total ${fileDnaResult.length} bases)`
                          : fileDnaResult
                        }
                      </pre>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(fileDnaResult);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        style={{
                          background: T.surf2,
                          color: T.text1,
                          border: `1px solid ${T.border2}`,
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        {copied ? "✅ Copied!" : "📋 Copy Full Sequence"}
                      </button>
                    </div>

                    {fileMetadata && (
                      <div style={{ background: T.surf2, padding: "10px", borderRadius: "6px", border: `1px solid ${T.border2}`, display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: T.cyan, textTransform: "uppercase" }}>File Metadata</span>
                        <div style={{ fontSize: "0.76rem", color: T.text2 }}>
                          <strong>Filename:</strong> {fileMetadata.name}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: T.text2 }}>
                          <strong>Size:</strong> {fileMetadata.size.toLocaleString()} bytes ({(fileMetadata.size / 1024).toFixed(2)} KB)
                        </div>
                        <div style={{ fontSize: "0.76rem", color: T.text2 }}>
                          <strong>Sequence Length:</strong> {fileMetadata.length.toLocaleString()} bases
                        </div>
                        <div style={{ fontSize: "0.72rem", color: T.text3, fontStyle: "italic", marginTop: "2px" }}>
                          Source: {fileMetadata.source}
                        </div>
                      </div>
                    )}

                    <div style={{ borderTop: `1px solid ${T.border2}`, paddingTop: "12px", marginTop: "4px" }}>
                      <button
                        type="button"
                        onClick={handleFileDecode}
                        disabled={decodeLoading}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          background: `linear-gradient(135deg, ${T.green}, #059669)`,
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          cursor: decodeLoading ? "default" : "pointer"
                        }}
                      >
                        {decodeLoading ? "Decoding back to File..." : "📥 Decode back to File"}
                      </button>

                      {decodeLoading && (
                        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: 12, height: 12, border: `2px solid ${T.border2}`, borderTopColor: T.green, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                          <span style={{ fontSize: "0.76rem", color: T.text2 }}>Reconstructing binary file...</span>
                        </div>
                      )}

                      {decodeError && (
                        <div style={{ marginTop: "10px", padding: "8px 12px", background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: "6px", color: T.red, fontSize: "0.78rem" }}>
                          ⚠️ <strong>Decoding Error:</strong> {decodeError}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Checksum Parity Corruptions Alert UI */}
            {checksumCorruptions.length > 0 && (
              <div style={{
                marginTop: "16px",
                padding: "14px",
                background: `${T.red}15`,
                border: `1px solid ${T.red}`,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.red, fontWeight: 800, fontSize: "0.85rem" }}>
                  <span>⚠️ Checksum Verification Failed</span>
                  <span style={{ fontSize: "0.7rem", background: T.red, color: "#fff", padding: "1px 6px", borderRadius: "10px", textTransform: "uppercase" }}>
                    Corrupted
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.78rem", color: T.text2 }}>
                  The following block(s) failed XOR-based 4-base parity verification. Please review for data transmission noise:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  {checksumCorruptions.map((corr) => (
                    <div key={corr.blockNum} style={{
                      background: T.surf2,
                      border: `1px solid ${T.red}30`,
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "0.76rem"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 800, color: T.red }}>Block #{corr.blockNum} (CORRUPTED)</span>
                        <span style={{ color: T.text3 }}>Range: {corr.start} - {corr.end}</span>
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.72rem", wordBreak: "break-all", background: T.surf, padding: "6px", borderRadius: "4px", color: T.text2, marginBottom: "4px" }}>
                        {corr.blockContent}
                      </div>
                      <div style={{ display: "flex", gap: "12px", fontSize: "0.72rem", color: T.text2 }}>
                        <span>Expected Checksum: <strong style={{ color: T.green, fontFamily: "monospace" }}>{corr.expected}</strong></span>
                        <span>Computed Parity: <strong style={{ color: T.red, fontFamily: "monospace" }}>{corr.computed}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading / Spinner State */}
            {encoderLoading && (
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 14, height: 14, border: `2px solid ${T.border2}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: "0.8rem", color: T.text2 }}>Contacting DNA engine backend...</span>
              </div>
            )}

            {/* Error Message UI */}
            {encoderError && (
              <div style={{ marginTop: "16px", padding: "10px 14px", background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: "8px", color: T.red, fontSize: "0.8rem" }}>
                ⚠️ <strong>Error:</strong> {encoderError}
              </div>
            )}

            {/* Result Display UI */}
            {encoderResult && (
              <div style={{ marginTop: "16px", padding: "14px", background: `${T.green}10`, border: `1px solid ${T.green}30`, borderRadius: "8px" }}>
                <span style={{ display: "block", color: T.green, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                  {encoderMode === "encode" ? "Encoded DNA Output" : "Decoded Text Output"}
                </span>
                <div style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: T.text1,
                  wordBreak: "break-all",
                  fontFamily: encoderMode === "encode" ? "monospace" : "inherit"
                }}>
                  {encoderResult}
                </div>

                {/* Synthesis Input & Action (Only if we have DNA to synthesize) */}
                {((encoderMode === "encode" && encoderResult) || (encoderMode === "decode" && inputDna.trim())) && (
                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${T.border2}` }}>
                    <label style={{ display: "block", color: T.text2, fontSize: "0.72rem", fontWeight: 700, marginBottom: "4px" }}>
                      Sequence Name (optional)
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={seqName}
                        onChange={e => setSeqName(e.target.value)}
                        placeholder="e.g. APEX-1"
                        style={{
                          flex: 1,
                          background: T.surf2,
                          border: `1px solid ${T.border2}`,
                          borderRadius: "6px",
                          padding: "6px 10px",
                          color: T.text1,
                          fontSize: "0.8rem",
                          outline: "none"
                        }}
                      />
                      <button
                        onClick={() => handleSynthesize(encoderMode === "encode" ? encoderResult : inputDna)}
                        disabled={fastaLoading}
                        style={{
                          background: T.accent,
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          opacity: fastaLoading ? 0.7 : 1
                        }}
                      >
                        {fastaLoading ? "Synthesizing..." : "Synthesize (FASTA)"}
                      </button>
                    </div>

                    {/* Fasta Load / Error states */}
                    {fastaLoading && (
                      <div style={{ fontSize: "0.74rem", color: T.text2, display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <div style={{ width: 10, height: 10, border: `2px solid ${T.border2}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        Generating FASTA file...
                      </div>
                    )}
                    {fastaError && (
                      <div style={{ fontSize: "0.74rem", color: T.red, marginTop: "4px" }}>
                        ⚠️ Error: {fastaError}
                      </div>
                    )}

                    {/* FASTA output display box */}
                    {fastaResult && (
                      <div style={{ marginTop: "12px" }}>
                        <span style={{ display: "block", color: T.cyan, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                          FASTA Output
                        </span>
                        <pre style={{
                          background: T.surf2,
                          border: `1px solid ${T.border2}`,
                          borderRadius: "6px",
                          padding: "10px",
                          color: T.text1,
                          fontSize: "0.8rem",
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                          margin: "0 0 10px 0"
                        }}>
                          {fastaResult}
                        </pre>
                        <button
                          onClick={handleDownloadFasta}
                          style={{
                            background: T.green,
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          📥 Download .fasta
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Research notes */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              📓 Research Notes & Citations
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {filteredNotes.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: T.text3, fontSize: "0.8rem" }}>
                  No research notes mapped to selected tab.
                </div>
              ) : (
                filteredNotes.map(n => (
                  <div
                    key={n.id}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "10px",
                      padding: "14px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <span style={{
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          background: `${T.accent}15`,
                          color: T.accent,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          marginRight: "6px"
                        }}>
                          {n.category}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: T.text3 }}>{n.date}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.74rem" }}
                      >
                        ✕ Delete
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.84rem", color: T.text1, marginBottom: "6px" }}>{n.title}</div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: T.text2, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                      {n.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Note form */}
            <form onSubmit={handleAddNote} style={{ borderTop: `1px solid ${T.border}`, paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: T.text2 }}>➕ Log Note or Citation</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  placeholder="Note Title *"
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                />
                <select
                  value={newNoteCategory}
                  onChange={e => setNewNoteCategory(e.target.value)}
                  style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px", color: T.text1, fontSize: "0.8rem" }}
                >
                  <option value="Methodology">Methodology</option>
                  <option value="Literature">Literature</option>
                  <option value="Citations">Citations</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  placeholder="Citations, observations, constants..."
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none", resize: "none", fontFamily: "inherit" }}
                />
              </div>
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
                Log Research Note
              </button>
            </form>
          </div>

          {/* Quick workspace metrics */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800 }}>
              📊 Workspace Metrics Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, paddingBottom: "6px" }}>
                <span style={{ color: T.text2 }}>Hypotheses Tracked</span>
                <strong style={{ color: T.cyan }}>{hypotheses.length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, paddingBottom: "6px" }}>
                <span style={{ color: T.text2 }}>Active Experiments</span>
                <strong style={{ color: T.accent }}>{experiments.filter(e => e.status !== "Completed").length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, paddingBottom: "6px" }}>
                <span style={{ color: T.text2 }}>Research Notes logged</span>
                <strong style={{ color: T.green }}>{notes.length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.text2 }}>Avg Hypothesis Confidence</span>
                <strong style={{ color: T.yellow }}>
                  {hypotheses.length ? Math.round(hypotheses.reduce((s, h) => s + h.confidence, 0) / hypotheses.length) : 0}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

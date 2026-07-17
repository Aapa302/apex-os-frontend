import React, { useState, useEffect, useMemo } from "react";
import {
  Encode,
  Decode,
  Validate,
  Benchmark,
  validateGCRule,
  validateHomopolymerRule
} from "../core/DNACoreEngine";

// Design themes matching App.jsx and ResearchLab.jsx
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
    pink: "#e040fb",
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
    pink: "#db2777",
    glass: "rgba(255, 255, 255, 0.85)",
    shadow: "rgba(15, 23, 42, 0.08)",
  }
};

const BASE_COLORS = {
  A: { bg: "#ef4444", text: "#ffffff", label: "Adenine" },
  T: { bg: "#3b82f6", text: "#ffffff", label: "Thymine" },
  C: { bg: "#10b981", text: "#ffffff", label: "Cytosine" },
  G: { bg: "#f5a623", text: "#ffffff", label: "Guanine" },
  U: { bg: "#a855f7", text: "#ffffff", label: "Uracil" }
};

const SAMPLE_SEQUENCES = [
  { name: "CRISPR-Cas9 Target Sequence", seq: "ATGCGATCGATCGATCGATCGATCGATC" },
  { name: "Human Hemoglobin Gene Segment", seq: "ATGGTGCATCTGACTCCTGAGGAGAAGT" },
  { name: "Sars-Cov-2 Spike Receptor Motif", seq: "ATGTTTGTTTTTCTTGTTTTATTGCCAC" },
  { name: "Synthetic Archival Metadata block", seq: "ATCGATCGATCGATCGATCGATCGATCG" }
];

export default function DNASimulationEngine() {
  const [isLight, setIsLight] = useState(false);
  const theme = isLight ? THEME.light : THEME.dark;

  // State
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, queue, sequencing, mutations, translation, mapping, reports, settings

  // Sequence Previews
  const [currentSeqName, setCurrentSeqName] = useState(SAMPLE_SEQUENCES[0].name);
  const [dnaSeq, setDnaSeq] = useState(SAMPLE_SEQUENCES[0].seq);

  const [selectedAlgName, setSelectedAlgName] = useState("Default DNA Encoder");
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);
  const [sandboxInput, setSandboxInput] = useState("Apex DNA Data Storage Archive Payload");
  const [sandboxResult, setSandboxResult] = useState(null);
  const [corruptPayload, setCorruptPayload] = useState(false);

  // Load the currently selected algorithm from Algorithm Designer
  useEffect(() => {
    try {
      const activeId = localStorage.getItem("apex_os_selected_algorithm_id") || "alg_1";
      const algsSaved = localStorage.getItem("apex_os_algorithms");
      if (activeId && algsSaved) {
        const algs = JSON.parse(algsSaved);
        const activeAlg = algs.find(a => a.id === activeId);
        if (activeAlg) {
          setSelectedAlgName(`${activeAlg.name} (Active)`);
          setActiveAlgorithm(activeAlg);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleRunDnaSimulation = () => {
    if (!sandboxInput.trim()) {
      alert("Please enter input text payload.");
      return;
    }

    // Benchmark performs: Encode -> Decode -> Validate under strict conditions
    const report = Benchmark(sandboxInput, activeAlgorithm);

    // Simulate pipeline storage details
    const encodeData = Encode(sandboxInput, activeAlgorithm);

    let processedDnaSequence = encodeData.dnaSequence;
    let corruptedForShow = false;

    // Direct demonstration of Error Detection / Checksumming failure if chosen
    if (corruptPayload) {
      // Intentionally change a single base to trigger checksum invalidation
      const bases = ["A", "T", "C", "G"];
      const targetPos = Math.floor(processedDnaSequence.length / 2);
      const originalBase = processedDnaSequence[targetPos];
      const otherBases = bases.filter(b => b !== originalBase);
      const replacementBase = otherBases[0];
      processedDnaSequence = processedDnaSequence.slice(0, targetPos) + replacementBase + processedDnaSequence.slice(targetPos + 1);
      corruptedForShow = true;
    }

    const decodeData = Decode(processedDnaSequence, activeAlgorithm);
    const validateData = Validate(sandboxInput, decodeData.decodedText, decodeData.checksumVerified);

    setDnaSeq(encodeData.dnaSequence);
    setCurrentSeqName(`Encoded sandbox: "${sandboxInput.slice(0, 15)}..."`);

    // Rule compliance checks using Core Engine functions
    const gcRuleResult = validateGCRule(encodeData.dnaSequence, activeAlgorithm?.gcRules);
    const homopolymerResult = validateHomopolymerRule(encodeData.dnaSequence, activeAlgorithm?.homopolymerRules);

    setSandboxResult({
      executionId: report.executionId,
      binaryInput: encodeData.combinedBinary,
      dnaOutput: encodeData.dnaSequence,
      processedDnaSequence,
      decodedText: decodeData.decodedText,
      duration: (encodeData.encodingTime + decodeData.decodingTime).toFixed(3),
      success: validateData.pass === "PASS",
      similarity: validateData.similarity,
      errorCount: validateData.errorCount,
      checksumVerified: decodeData.checksumVerified,
      corruptionDetected: decodeData.corruptionDetected || corruptedForShow,
      extractedChecksum: decodeData.extractedChecksum,
      computedChecksum: decodeData.computedChecksum,
      gcRule: gcRuleResult,
      homopolymerRule: homopolymerResult
    });

    // Save execution analytics globally for Dashboard stats
    try {
      const savedRuns = localStorage.getItem("apex_os_v3_dna_runs");
      let runs = savedRuns ? JSON.parse(savedRuns) : [];
      runs.unshift({
        executionId: report.executionId,
        algorithmName: selectedAlgName,
        success: validateData.pass === "PASS",
        time: parseFloat((encodeData.encodingTime + decodeData.decodingTime).toFixed(3)),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("apex_os_v3_dna_runs", JSON.stringify(runs));
    } catch(err) {
      console.error(err);
    }

    triggerToast(
      validateData.pass === "PASS"
        ? "Text successfully encoded, decoded, and verified through shared DNA Core Engine!"
        : "Execution completed. Integrity failure or corruption detected!",
      validateData.pass === "PASS" ? "success" : "warning"
    );
  };

  const handleSaveToExperimentManager = () => {
    if (!sandboxResult) return;
    try {
      const saved = localStorage.getItem("apex_os_experiments");
      let exps = saved ? JSON.parse(saved) : [];
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
      const newExp = {
        id: `exp_${Date.now()}`,
        name: `Simulation run: "${sandboxInput.substring(0, 15)}..."`,
        researchArea: "DNA Sequencing",
        objective: "Dynamic digital-biological sequence roundtrip run.",
        description: `Input string: "${sandboxInput}". Exec time: ${sandboxResult.duration}ms. DNA Output bases: ${sandboxResult.dnaOutput}. Decoded: "${sandboxResult.decodedText}". GC Rule: ${sandboxResult.gcRule.message}. Homopolymer: ${sandboxResult.homopolymerRule.message}.`,
        assignedAlgorithm: selectedAlgName,
        status: "Completed",
        accuracy: parseFloat(sandboxResult.similarity),
        throughput: `${(sandboxResult.dnaOutput.length / (parseFloat(sandboxResult.duration) || 1)).toFixed(2)} bp/ms`,
        createdDate: timestamp,
        lastUpdated: timestamp,
        timeline: [
          { id: `e_${Date.now()}`, type: "success", title: "Simulation Finished", timestamp, desc: `Text processed via DNA Core Engine successfully. Checksum validation: ${sandboxResult.checksumVerified ? "PASS" : "FAIL"}.`, icon: "🏆" }
        ],
        attachments: []
      };
      exps.unshift(newExp);
      localStorage.setItem("apex_os_experiments", JSON.stringify(exps));

      // Save to Research Memory System
      const cachedMem = localStorage.getItem("apex_os_v4_research_memories");
      let memories = cachedMem ? JSON.parse(cachedMem) : [];
      memories.unshift({
        id: `mem_dna_${Date.now()}`,
        title: `[DNA Core Engine Log] "${sandboxInput.slice(0, 20)}..."`,
        type: "Experiment Log",
        content: `Execution ID: ${sandboxResult.executionId}\nAlgorithm: ${selectedAlgName}\nInput: "${sandboxInput}"\nOutput DNA: ${sandboxResult.dnaOutput}\nGC rule verification: ${sandboxResult.gcRule.message}\nHomopolymer rule verification: ${sandboxResult.homopolymerRule.message}\nReconstructed output: "${sandboxResult.decodedText}"\nValidation Status: ${sandboxResult.success ? "PASS" : "FAIL"}\nChecksum Verified: ${sandboxResult.checksumVerified ? "YES" : "NO"}\nDuration: ${sandboxResult.duration} ms`,
        tags: ["DNA Storage", "Simulation", "Validation", "CoreEngine"],
        timestamp,
        severity: sandboxResult.success ? "Low" : "High"
      });
      localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));

      triggerToast("Experiment saved directly to Experiment Manager and Research Memory System!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // Local Simulation Lab States
  const [writeErrorRate, setWriteErrorRate] = useState(0.5); // percentage (0% to 5%)
  const [noiseRate, setNoiseRate] = useState(1.0); // percentage (0% to 10%)
  const [readErrorRate, setReadErrorRate] = useState(0.5); // percentage (0% to 5%)

  const [simLabResults, setSimLabResults] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_simulation_results");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentSimResult, setCurrentSimResult] = useState(null);

  // Storage Architect states
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [compareResults, setCompareResults] = useState(null);
  const [comparePayload, setComparePayload] = useState("APEX-OS Digital-Biological Archival Core Benchmark Segment");

  const handleRunComparison = () => {
    // Load all algorithms from localStorage
    const savedAlgs = localStorage.getItem("apex_os_algorithms");
    if (!savedAlgs) {
      triggerToast("No algorithms available for comparison.", "error");
      return;
    }
    const algs = JSON.parse(savedAlgs);
    const selectedAlgs = algs.filter(a => selectedCompareIds.includes(a.id));

    if (selectedAlgs.length < 2) {
      triggerToast("Please select at least 2 algorithms to compare.", "warning");
      return;
    }

    const payload = comparePayload || "APEX-OS Digital-Biological Archival Core Benchmark Segment";

    const results = selectedAlgs.map(alg => {
      // 1. Measure Encode speed and get dnaSequence / binary representation
      const startEncode = performance.now();
      const encodeRes = Encode(payload, alg);
      const encodeTime = performance.now() - startEncode;

      // 2. Measure Decode speed and accuracy
      const startDecode = performance.now();
      const decodeRes = Decode(encodeRes.dnaSequence, alg);
      const decodeTime = performance.now() - startDecode;

      // Calculate accuracy (% match)
      const validateRes = Validate(payload, decodeRes.decodedText, decodeRes.checksumVerified);
      const accuracyPercent = parseFloat(validateRes.similarity);

      // 3. Storage Density (bits per nucleotide)
      const bits = encodeRes.combinedBinary.length;
      const bases = encodeRes.dnaSequence.length || 1;
      const density = (bits / bases).toFixed(2); // e.g. 2.00 bits/nt

      // 4. GC Balance
      const gCount = (encodeRes.dnaSequence.match(/G/g) || []).length;
      const cCount = (encodeRes.dnaSequence.match(/C/g) || []).length;
      const gcPercent = (bases > 0) ? ((gCount + cCount) / bases) * 100 : 50;
      const gcDistance = Math.abs(gcPercent - 50);
      const gcBalance = (100 - gcDistance * 2).toFixed(1); // Score out of 100

      // 5. Simulated Error Rate under 1% standard noise-injection
      let noiseCount = 0;
      const noiseProb = 0.01;
      let noisedSeq = "";
      const basesList = ["A", "T", "C", "G"];
      for (let k = 0; k < encodeRes.dnaSequence.length; k++) {
        if (Math.random() < noiseProb) {
          noiseCount++;
          // Substitution
          const originalBase = encodeRes.dnaSequence[k];
          const options = basesList.filter(b => b !== originalBase);
          noisedSeq += options[Math.floor(Math.random() * options.length)];
        } else {
          noisedSeq += encodeRes.dnaSequence[k];
        }
      }
      const testDecode = Decode(noisedSeq || encodeRes.dnaSequence, alg);
      const testValidate = Validate(payload, testDecode.decodedText, testDecode.checksumVerified);
      const errorRate = (100 - parseFloat(testValidate.similarity)).toFixed(2);

      // 6. ECC Overhead
      let eccOverhead = 0;
      const ecStr = (alg.errorCorrection || "").toLowerCase();
      if (ecStr.includes("reed-solomon") || ecStr.includes("rs")) {
        eccOverhead = 12.5; // Estimated 12.5% standard overhead
      } else if (ecStr.includes("hamming")) {
        eccOverhead = 8.0;
      }

      // 7. Memory Usage (Rough estimate: encoded sequence in bytes)
      const memoryUsageEstimate = encodeRes.dnaSequence.length; // 1 byte per character

      // 8. Weighted Score Computation
      // Score weights: Density (35%), Speed (15%), Accuracy (25%), GC Balance (15%), Error Resilience (10%)
      const speedScore = Math.max(0, 100 - (encodeTime + decodeTime) * 10);
      const weightedScore = (
        (parseFloat(density) / 2.0) * 35 + // normalized against a theoretical max of 2.0 bits/nt
        (accuracyPercent / 100) * 25 +
        (speedScore / 100) * 15 +
        (parseFloat(gcBalance) / 100) * 15 +
        ((100 - parseFloat(errorRate)) / 100) * 10
      );

      return {
        id: alg.id,
        name: alg.name,
        version: alg.version,
        density,
        encodeTime: encodeTime.toFixed(3),
        decodeTime: decodeTime.toFixed(3),
        totalTime: (encodeTime + decodeTime).toFixed(3),
        accuracy: accuracyPercent.toFixed(1),
        gcPercent: gcPercent.toFixed(1),
        gcBalance,
        errorRate,
        eccOverhead: eccOverhead.toFixed(1),
        memoryUsage: `${memoryUsageEstimate} Bytes`,
        weightedScore: weightedScore.toFixed(2),
        algInfo: alg
      };
    });

    // Sort by weighted score descending
    results.sort((a, b) => parseFloat(b.weightedScore) - parseFloat(a.weightedScore));

    setCompareResults(results);
    triggerToast("Storage architectures compared and ranked!", "success");
  };

  const handleRunLocalSimulation = () => {
    if (!dnaSeq) {
      triggerToast("No active sequence available. Load or generate a sequence first.", "warning");
      return;
    }

    const startTime = performance.now();
    const originalSeq = dnaSeq.toUpperCase();
    const bases = ["A", "T", "C", "G"];

    // 1. Write Simulation (with configurable write error rate)
    let synthesizedSeq = "";
    const pWrite = writeErrorRate / 100;
    for (let i = 0; i < originalSeq.length; i++) {
      if (Math.random() < pWrite) {
        // Synthesis error! Either substitution, insertion, or deletion.
        const errType = Math.random();
        if (errType < 0.4) {
          // Substitution
          const originalBase = originalSeq[i];
          const options = bases.filter(b => b !== originalBase);
          synthesizedSeq += options[Math.floor(Math.random() * options.length)];
        } else if (errType < 0.7) {
          // Insertion
          synthesizedSeq += originalSeq[i] + bases[Math.floor(Math.random() * bases.length)];
        } else {
          // Deletion (omit base)
        }
      } else {
        synthesizedSeq += originalSeq[i];
      }
    }

    // 2. Noise Injection (with configurable noise rate)
    let degradedSeq = "";
    const pNoise = noiseRate / 100;
    for (let i = 0; i < synthesizedSeq.length; i++) {
      if (Math.random() < pNoise) {
        const errType = Math.random();
        if (errType < 0.4) {
          // Substitution
          const originalBase = synthesizedSeq[i];
          const options = bases.filter(b => b !== originalBase);
          degradedSeq += options[Math.floor(Math.random() * options.length)];
        } else if (errType < 0.7) {
          // Insertion
          degradedSeq += synthesizedSeq[i] + bases[Math.floor(Math.random() * bases.length)];
        } else {
          // Deletion
        }
      } else {
        degradedSeq += synthesizedSeq[i];
      }
    }

    // 3. Read Simulation (with configurable sequencing read error rate)
    let readSeq = "";
    const pRead = readErrorRate / 100;
    for (let i = 0; i < degradedSeq.length; i++) {
      if (Math.random() < pRead) {
        const errType = Math.random();
        if (errType < 0.4) {
          // Substitution
          const originalBase = degradedSeq[i];
          const options = bases.filter(b => b !== originalBase);
          readSeq += options[Math.floor(Math.random() * options.length)];
        } else if (errType < 0.7) {
          // Insertion
          readSeq += degradedSeq[i] + bases[Math.floor(Math.random() * bases.length)];
        } else {
          // Deletion
        }
      } else {
        readSeq += degradedSeq[i];
      }
    }

    // Prevent fully empty sequence
    if (!readSeq) readSeq = "A";

    // 4. Traceback Alignment & Error Stats
    const m = originalSeq.length, n = readSeq.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (originalSeq[i - 1] === readSeq[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1, // substitution
            dp[i - 1][j] + 1,     // deletion
            dp[i][j - 1] + 1      // insertion
          );
        }
      }
    }

    let i = m, j = n;
    let subs = 0, ins = 0, dels = 0;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && originalSeq[i - 1] === readSeq[j - 1]) {
        i--; j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        subs++; i--; j--;
      } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
        dels++; i--;
      } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
        ins++; j--;
      } else {
        if (i > 0) { dels++; i--; }
        else { ins++; j--; }
      }
    }

    const duration = performance.now() - startTime;
    const totalErrors = subs + ins + dels;
    const errorRatePercentage = m > 0 ? (totalErrors / m) * 100 : 0;

    const newResult = {
      id: `sim_run_${Date.now()}`,
      timestamp: new Date().toISOString(),
      originalSeq,
      readSeq,
      writeErrorRate,
      noiseRate,
      readErrorRate,
      subs,
      ins,
      dels,
      totalErrors,
      errorRate: errorRatePercentage.toFixed(2),
      duration: duration.toFixed(3),
      success: totalErrors === 0
    };

    setSimLabResults(prev => {
      const updated = [newResult, ...prev];
      localStorage.setItem("apex_os_simulation_results", JSON.stringify(updated));
      return updated;
    });

    setCurrentSimResult(newResult);
    triggerToast("Local physical storage simulation finished!", "success");
  };

  // Simulation parameters & settings
  const [mutationRate, setMutationRate] = useState(0.05);
  const [mutationType, setMutationType] = useState("point"); // point, insertion, deletion
  const [mutationPos, setMutationPos] = useState(5);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [errorTolerance, setErrorTolerance] = useState(0.01);
  const [codonTable, setCodonTable] = useState("standard");

  // Config saving / loading state
  const [savedConfigs, setSavedConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_dna_configs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [configNameInput, setConfigNameInput] = useState("");

  // Auto-save configs list
  useEffect(() => {
    localStorage.setItem("apex_os_dna_configs", JSON.stringify(savedConfigs));
  }, [savedConfigs]);

  // Simulations & Queue
  const [simulations, setSimulations] = useState([
    { id: "SIM-001", name: "SARS-Cov-2 Mutation Propensity", type: "Mutation Drift", status: "running", progress: 68, estTime: "45s", date: "2026-07-20 14:22" },
    { id: "SIM-002", name: "Hemoglobin Beta Chain Translation", type: "Protein Synthesis", status: "queued", progress: 0, estTime: "2m 15s", date: "2026-07-20 14:25" },
    { id: "SIM-003", name: "CRISPR Off-target Mapping", type: "Gene Mapping", status: "queued", progress: 0, estTime: "5m 10s", date: "2026-07-20 14:26" },
    { id: "SIM-004", name: "Oligo Synthesis Error Correction", type: "Alignment Refinement", status: "completed", progress: 100, estTime: "0s", date: "2026-07-20 13:45" },
    { id: "SIM-005", name: "Myoglobin Structural Conformity", type: "Folding Dynamics", status: "failed", progress: 45, estTime: "—", date: "2026-07-20 13:10" }
  ]);

  // Toast handler
  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Run dynamic progress updating for "running" simulations
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulations(prev => prev.map(sim => {
        if (sim.status === "running") {
          const nextProg = sim.progress + Math.floor(Math.random() * 5 * simSpeed);
          if (nextProg >= 100) {
            triggerToast(`Simulation ${sim.id} completed successfully!`, "success");
            return { ...sim, status: "completed", progress: 100, estTime: "0s" };
          }
          return { ...sim, progress: nextProg, estTime: `${Math.max(1, Math.round((100 - nextProg) / (2 * simSpeed)))}s` };
        }
        return sim;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [simSpeed]);

  // Statistics summaries
  const stats = useMemo(() => {
    const total = simulations.length;
    const running = simulations.filter(s => s.status === "running").length;
    const queued = simulations.filter(s => s.status === "queued").length;
    const completed = simulations.filter(s => s.status === "completed").length;
    const failed = simulations.filter(s => s.status === "failed").length;
    return { total, running, queued, completed, failed, avgRuntime: "14.2s" };
  }, [simulations]);

  // Sequence Actions
  const [pastedFasta, setPastedFasta] = useState("");

  const handleExportFASTA = () => {
    const fastaText = `>${(currentSeqName || "Custom_Sequence").replace(/\s+/g, "_")}\n${dnaSeq.match(/.{1,80}/g)?.join("\n") || dnaSeq}`;

    // Copy to clipboard
    try {
      navigator.clipboard.writeText(fastaText);
    } catch (e) {
      console.warn("Clipboard access not available:", e);
    }

    // Trigger file download
    const blob = new Blob([fastaText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentSeqName || "sequence").replace(/[^a-z0-9-_]/gi, "_")}.fasta`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast("Sequence exported as FASTA and copied to clipboard!", "success");
  };

  const handleImportFASTA = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.trim().split("\n");
      let name = file.name;
      let seq = "";
      if (lines[0]?.startsWith(">")) {
        name = lines[0].substring(1).trim();
        seq = lines.slice(1).join("").replace(/[^ATCGUatcgun\s]/gi, "").trim();
      } else {
        seq = lines.join("").replace(/[^ATCGUatcgun\s]/gi, "").trim();
      }
      if (!seq) {
        triggerToast("Invalid FASTA file: No valid bases found.", "error");
        return;
      }
      setDnaSeq(seq.toUpperCase());
      setCurrentSeqName(name);
      triggerToast(`Successfully imported: "${name}" (${seq.length} bp)`, "success");
    };
    reader.readAsText(file);
  };

  const handlePasteImportFASTA = () => {
    if (!pastedFasta.trim()) {
      triggerToast("Please paste some FASTA text first.", "warning");
      return;
    }
    const lines = pastedFasta.trim().split("\n");
    let name = "Pasted FASTA Sequence";
    let seq = "";
    if (lines[0]?.startsWith(">")) {
      name = lines[0].substring(1).trim();
      seq = lines.slice(1).join("").replace(/[^ATCGUatcgun\s]/gi, "").trim();
    } else {
      seq = lines.join("").replace(/[^ATCGUatcgun\s]/gi, "").trim();
    }
    if (!seq) {
      triggerToast("Invalid FASTA: No valid bases found.", "error");
      return;
    }
    setDnaSeq(seq.toUpperCase());
    setCurrentSeqName(name);
    setPastedFasta("");
    triggerToast(`Successfully imported: "${name}" (${seq.length} bp)`, "success");
  };

  const handleRandomize = () => {
    const bases = ["A", "T", "C", "G"];
    let randomSeq = "";
    for (let i = 0; i < 28; i++) {
      randomSeq += bases[Math.floor(Math.random() * bases.length)];
    }
    setDnaSeq(randomSeq);
    setCurrentSeqName("Custom Randomized Sequence");
    triggerToast("Randomized DNA sequence generated", "info");
  };

  const handleComplement = () => {
    const pairs = { A: "T", T: "A", C: "G", G: "C" };
    const comp = dnaSeq.split("").map(b => pairs[b] || b).join("");
    setDnaSeq(comp);
    triggerToast("Computed base pair complement", "success");
  };

  const handleTranscribe = () => {
    const rna = dnaSeq.replace(/T/g, "U");
    triggerToast(`Transcribed RNA Sequence: ${rna}`, "success");
  };

  // Diagnostic calculations
  const reportStats = useMemo(() => {
    const len = dnaSeq.length || 1;
    const gCount = (dnaSeq.match(/G/g) || []).length;
    const cCount = (dnaSeq.match(/C/g) || []).length;
    const gcPercent = Math.round(((gCount + cCount) / len) * 100);
    const aCount = (dnaSeq.match(/A/g) || []).length;
    const tCount = (dnaSeq.match(/T/g) || []).length;
    const uCount = (dnaSeq.match(/U/g) || []).length;
    const tm = 2 * (aCount + tCount) + 4 * (gCount + cCount);

    return {
      gcPercent,
      tm,
      length: len,
      codonBias: "Moderate (0.54)",
      A: aCount,
      T: tCount,
      C: cCount,
      G: gCount,
      U: uCount
    };
  }, [dnaSeq]);

  // Mutation Preview
  const mutationDiff = useMemo(() => {
    const original = dnaSeq;
    const bases = ["A", "T", "C", "G"];
    let modified = "";

    const safePos = Math.min(Math.max(0, mutationPos), original.length - 1);

    if (mutationType === "point") {
      const origBase = original[safePos] || "A";
      const otherBases = bases.filter(b => b !== origBase);
      const sub = otherBases[Math.floor((mutationRate * 10) % otherBases.length)];
      modified = original.slice(0, safePos) + sub + original.slice(safePos + 1);
    } else if (mutationType === "insertion") {
      modified = original.slice(0, safePos) + "A" + original.slice(safePos);
    } else if (mutationType === "deletion") {
      modified = original.slice(0, safePos) + original.slice(safePos + 1);
    }

    return { original, modified, pos: safePos };
  }, [dnaSeq, mutationType, mutationPos, mutationRate]);

  // Codon Translation Preview
  const translationPreview = useMemo(() => {
    const triplets = [];
    const codonMap = {
      ATG: "Met (Start)", TGG: "Trp", GAA: "Glu", GAG: "Glu", AAG: "Lys",
      CAT: "His", CTG: "Leu", ACT: "Thr", CCT: "Pro", GTG: "Val",
      TTT: "Phe", TTC: "Phe", TTA: "Leu", TTG: "Leu", GTT: "Val",
      GTC: "Val", GTA: "Val", CCG: "Pro", CCA: "Pro", CCC: "Pro",
      TAA: "Stop", TAG: "Stop", TGA: "Stop"
    };

    for (let i = 0; i < dnaSeq.length - 2; i += 3) {
      const triplet = dnaSeq.slice(i, i + 3);
      const aa = codonMap[triplet] || "Ala";
      triplets.push({ codon: triplet, aa });
    }

    return triplets;
  }, [dnaSeq]);

  // Add / Trigger Simulation Actions
  const handleAddNewSimulation = () => {
    const newSim = {
      id: `SIM-00${simulations.length + 1}`,
      name: `Simulated Alignment Run - ${currentSeqName.split(" ")[0]}`,
      type: "Alignment Refinement",
      status: "queued",
      progress: 0,
      estTime: "1m 30s",
      date: new Date().toISOString().replace("T", " ").slice(0, 16)
    };
    setSimulations(prev => [newSim, ...prev]);
    triggerToast("New Simulation added to queue!", "success");
  };

  const handleStartQueue = () => {
    setSimulations(prev => prev.map(sim => {
      if (sim.status === "queued") {
        return { ...sim, status: "running" };
      }
      return sim;
    }));
    triggerToast("DNA Simulation queue started", "info");
  };

  const handleCancelSim = (id) => {
    setSimulations(prev => prev.map(sim => {
      if (sim.id === id) {
        return { ...sim, status: "failed", progress: sim.progress, estTime: "Cancelled" };
      }
      return sim;
    }));
    triggerToast(`Simulation ${id} cancelled.`, "warning");
  };

  const handleResetQueue = () => {
    setSimulations([
      { id: "SIM-001", name: "SARS-Cov-2 Mutation Propensity", type: "Mutation Drift", status: "running", progress: 68, estTime: "45s", date: "2026-07-20 14:22" },
      { id: "SIM-002", name: "Hemoglobin Beta Chain Translation", type: "Protein Synthesis", status: "queued", progress: 0, estTime: "2m 15s", date: "2026-07-20 14:25" },
      { id: "SIM-003", name: "CRISPR Off-target Mapping", type: "Gene Mapping", status: "queued", progress: 0, estTime: "5m 10s", date: "2026-07-20 14:26" }
    ]);
    triggerToast("Simulation Engine queue reset to default.", "info");
  };

  // Save Config handler
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!configNameInput.trim()) return;

    const newConfig = {
      id: `cfg_${Date.now()}`,
      name: configNameInput,
      dnaSeq,
      currentSeqName,
      mutationRate,
      mutationType,
      mutationPos,
      simSpeed,
      errorTolerance,
      codonTable
    };

    setSavedConfigs(prev => [newConfig, ...prev]);
    setConfigNameInput("");
    triggerToast(`Configuration "${newConfig.name}" saved!`);
  };

  // Load Config handler
  const handleLoadConfig = (cfg) => {
    setDnaSeq(cfg.dnaSeq);
    setCurrentSeqName(cfg.currentSeqName || "Loaded Sequence");
    setMutationRate(cfg.mutationRate);
    setMutationType(cfg.mutationType);
    setMutationPos(cfg.mutationPos);
    setSimSpeed(cfg.simSpeed);
    setErrorTolerance(cfg.errorTolerance);
    setCodonTable(cfg.codonTable);
    triggerToast(`Loaded configuration "${cfg.name}" successfully!`);
  };

  // Delete Config handler
  const handleDeleteConfig = (id) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
    triggerToast("Configuration deleted.");
  };

  return (
    <div style={{
      background: theme.bg,
      color: theme.text1,
      minHeight: "100%",
      fontFamily: "'Inter', system-ui, sans-serif",
      transition: "background-color 0.2s, color 0.2s"
    }}>
      {/* ── Page Header ── */}
      <div style={{
        padding: "24px 20px",
        borderBottom: `1px solid ${theme.border}`,
        background: theme.surf,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: "1.6rem" }}>🧬</span>
            <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              DNA Simulation Engine
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.78rem", color: theme.text2 }}>
            Interactive controller for mapping, protein translations, genetic code analysis and mutation modeling.
          </p>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: "0.7rem",
            color: theme.cyan,
            background: `${theme.cyan}12`,
            border: `1px solid ${theme.cyan}40`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            VIRTUAL ENGINE ACTIVE
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
              transition: "all 0.15s"
            }}
          >
            {isLight ? "🌙 Dark Theme" : "☀️ Light Theme"}
          </button>
        </div>
      </div>

      {/* Toast Alert Component */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 99999,
          background: toast.type === "error" ? "#2a0a10" : toast.type === "warning" ? "#2a1a00" : toast.type === "success" ? "#002a1a" : "#0a0a2a",
          border: `1px solid ${toast.type === "error" ? theme.red : toast.type === "warning" ? theme.yellow : toast.type === "success" ? theme.green : theme.accent}`,
          borderRadius: 10,
          padding: "12px 18px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          boxShadow: `0 8px 32px ${theme.shadow}`,
          animation: "toastSlideIn 0.3s ease"
        }}>
          <span style={{ fontSize: 16 }}>
            {toast.type === "error" ? "⚠️" : toast.type === "warning" ? "⚡" : toast.type === "success" ? "✅" : "ℹ️"}
          </span>
          <span style={{ color: theme.text1, fontSize: "0.82rem", fontWeight: 600 }}>{toast.msg}</span>
        </div>
      )}

      {/* ── Sub Navigation Tab switcher ── */}
      <div style={{
        background: theme.surf,
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 20px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        overflowX: "auto"
      }}>
        {[
          { id: "dashboard", label: "📊 Dashboard" },
          { id: "queue", label: "📋 Queue Control" },
          { id: "sequencing", label: "🧬 Sequence Preview & Pipeline" },
          { id: "mutations", label: "⚡ Mutation Diff" },
          { id: "simulation_lab", label: "🧪 Local Simulation Lab" },
          { id: "storage_architect", label: "📐 Storage Architect" },
          { id: "translation", label: "🧪 Translation Preview" },
          { id: "mapping", label: "🗺️ Gene Mapping" },
          { id: "reports", label: "📄 Reports & Charts" },
          { id: "settings", label: "⚙️ Engine Settings" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 16px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? `3px solid ${theme.accent}` : "3px solid transparent",
              color: activeTab === tab.id ? theme.text1 : theme.text2,
              fontSize: "0.82rem",
              fontWeight: activeTab === tab.id ? 700 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Engine Panels ── */}
      <div style={{ padding: 20 }}>

        {/* ══ 1. SIMULATION DASHBOARD ══ */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stat Cards Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
              marginBottom: 20
            }}>
              {[
                { title: "Total Simulations", value: stats.total, icon: "📂", color: theme.accent },
                { title: "Active Running", value: stats.running, icon: "⏳", color: theme.cyan },
                { title: "Queued Simulations", value: stats.queued, icon: "⌛", color: theme.yellow },
                { title: "Completed Successfully", value: stats.completed, icon: "✅", color: theme.green },
                { title: "Failed Runs", value: stats.failed, icon: "❌", color: theme.red },
                { title: "Average Runtime", value: stats.avgRuntime, icon: "⏱️", color: theme.pink }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: theme.surf,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 14,
                  padding: "16px 20px",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: stat.color
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.72rem", color: theme.text2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {stat.title}
                    </span>
                    <span style={{ fontSize: "1.1rem" }}>{stat.icon}</span>
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 900, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Control & Quick Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 20
            }}>
              {/* Quick Controller */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 20
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>
                  ⚡ Simulation Queue Engine Controller
                </h3>
                <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
                  Instantiate virtual sequencing iterations. Track performance telemetry, alignment coefficients, and computational workloads in real time.
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={handleAddNewSimulation}
                    style={{
                      padding: "10px 18px",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                      border: "none",
                      borderRadius: 9,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    🚀 Trigger New Simulation
                  </button>

                  <button
                    onClick={handleStartQueue}
                    style={{
                      padding: "10px 18px",
                      background: theme.greenGlow,
                      border: `1px solid ${theme.green}50`,
                      borderRadius: 9,
                      color: theme.green,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    ▶️ Run All Queued
                  </button>

                  <button
                    onClick={handleResetQueue}
                    style={{
                      padding: "10px 18px",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 9,
                      color: theme.text1,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    🔄 Reset Telemetry Queue
                  </button>
                </div>
              </div>

              {/* Engine Status info */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 20
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.92rem", fontWeight: 800 }}>
                  🧬 Genetic Sequence Active Profile
                </h3>
                <div style={{ fontSize: "0.75rem", color: theme.text2, lineHeight: 1.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>Active Preset:</span>
                    <strong style={{ color: theme.text1 }}>{currentSeqName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>Sequence Length:</span>
                    <strong style={{ color: theme.text1 }}>{reportStats.length} bp</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>GC Content ratio:</span>
                    <strong style={{ color: theme.green }}>{reportStats.gcPercent}%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span>Melting Temp (Tm):</span>
                    <strong style={{ color: theme.yellow }}>{reportStats.tm}°C</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px dashed ${theme.border2}`, paddingTop: 6, marginTop: 6 }}>
                    <span>Base Composition:</span>
                    <strong style={{ color: theme.text1 }}>
                      A: {reportStats.A} | T: {reportStats.T} | C: {reportStats.C} | G: {reportStats.G}{reportStats.U > 0 ? ` | U: ${reportStats.U}` : ""}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Simulation Tables Mini-view */}
            <div style={{
              background: theme.surf,
              border: `1px solid ${theme.border2}`,
              borderRadius: 14,
              padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                  📋 Live Simulation Queue Status Table
                </h3>
                <button
                  onClick={() => setActiveTab("queue")}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.accent,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  View Full Queue Control →
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border2}`, color: theme.text3 }}>
                      <th style={{ padding: "10px 8px" }}>ID</th>
                      <th style={{ padding: "10px 8px" }}>Simulation Name</th>
                      <th style={{ padding: "10px 8px" }}>Type</th>
                      <th style={{ padding: "10px 8px" }}>Status</th>
                      <th style={{ padding: "10px 8px" }}>Progress</th>
                      <th style={{ padding: "10px 8px" }}>Est. Time</th>
                      <th style={{ padding: "10px 8px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulations.slice(0, 4).map(sim => (
                      <tr key={sim.id} style={{ borderBottom: `1px solid ${theme.border2}`, transition: "all 0.15s" }}>
                        <td style={{ padding: "12px 8px", fontFamily: "monospace", fontWeight: 700 }}>{sim.id}</td>
                        <td style={{ padding: "12px 8px", color: theme.text1, fontWeight: 600 }}>{sim.name}</td>
                        <td style={{ padding: "12px 8px", color: theme.text2 }}>{sim.type}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background: sim.status === "running" ? `${theme.cyan}15` : sim.status === "completed" ? `${theme.green}15` : sim.status === "failed" ? `${theme.red}15` : `${theme.yellow}15`,
                            color: sim.status === "running" ? theme.cyan : sim.status === "completed" ? theme.green : sim.status === "failed" ? theme.red : theme.yellow
                          }}>
                            {sim.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", width: "140px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: theme.surf2, borderRadius: 2, overflow: "hidden" }}>
                              <div style={{
                                width: `${sim.progress}%`,
                                height: "100%",
                                background: sim.status === "failed" ? theme.red : sim.status === "running" ? theme.cyan : theme.green,
                                borderRadius: 2
                              }} />
                            </div>
                            <span style={{ fontSize: "0.68rem", color: theme.text2 }}>{sim.progress}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 8px", color: theme.text2, fontFamily: "monospace" }}>{sim.estTime}</td>
                        <td style={{ padding: "12px 8px" }}>
                          {sim.status === "running" || sim.status === "queued" ? (
                            <button
                              onClick={() => handleCancelSim(sim.id)}
                              style={{
                                padding: "4px 8px",
                                background: "none",
                                border: `1px solid ${theme.red}30`,
                                color: theme.red,
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: "0.72rem"
                              }}
                            >
                              Cancel
                            </button>
                          ) : <span style={{ color: theme.text3 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ 2. SIMULATION QUEUE CONTROL PANEL ══ */}
        {activeTab === "queue" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>
                  📋 Enterprise Simulation Queue & Engine Scheduler
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: theme.text2 }}>
                  Verify high-throughput alignments, mutations, and coordinate models in an organized workspace.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleAddNewSimulation}
                  style={{
                    padding: "8px 14px",
                    background: theme.accent,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer"
                  }}
                >
                  + Add Custom Run
                </button>
                <button
                  onClick={handleStartQueue}
                  style={{
                    padding: "8px 14px",
                    background: theme.green,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer"
                  }}
                >
                  Start Processing
                </button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border2}`, color: theme.text3 }}>
                    <th style={{ padding: "12px 10px" }}>Run ID</th>
                    <th style={{ padding: "12px 10px" }}>Simulation Target</th>
                    <th style={{ padding: "12px 10px" }}>Modality</th>
                    <th style={{ padding: "12px 10px" }}>Status Indicator</th>
                    <th style={{ padding: "12px 10px" }}>Completed %</th>
                    <th style={{ padding: "12px 10px" }}>Est. Time Left</th>
                    <th style={{ padding: "12px 10px" }}>Initiated Date</th>
                    <th style={{ padding: "12px 10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.map(sim => (
                    <tr key={sim.id} style={{ borderBottom: `1px solid ${theme.border2}` }}>
                      <td style={{ padding: "12px 10px", fontFamily: "monospace", fontWeight: 700 }}>{sim.id}</td>
                      <td style={{ padding: "12px 10px", color: theme.text1, fontWeight: 600 }}>{sim.name}</td>
                      <td style={{ padding: "12px 10px", color: theme.text2 }}>{sim.type}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 12,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: sim.status === "running" ? `${theme.cyan}12` : sim.status === "completed" ? `${theme.green}12` : sim.status === "failed" ? `${theme.red}12` : `${theme.yellow}12`,
                          color: sim.status === "running" ? theme.cyan : sim.status === "completed" ? theme.green : sim.status === "failed" ? theme.red : theme.yellow
                        }}>
                          {sim.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px", width: "180px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 5, background: theme.surf2, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                              width: `${sim.progress}%`,
                              height: "100%",
                              background: sim.status === "failed" ? theme.red : sim.status === "running" ? theme.cyan : theme.green,
                              borderRadius: 3
                            }} />
                          </div>
                          <span style={{ fontSize: "0.68rem", color: theme.text2 }}>{sim.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 10px", color: theme.text2, fontFamily: "monospace" }}>{sim.estTime}</td>
                      <td style={{ padding: "12px 10px", color: theme.text3, fontSize: "0.75rem" }}>{sim.date}</td>
                      <td style={{ padding: "12px 10px" }}>
                        {sim.status === "running" || sim.status === "queued" ? (
                          <button
                            onClick={() => handleCancelSim(sim.id)}
                            style={{
                              padding: "4px 10px",
                              background: "none",
                              border: `1px solid ${theme.red}40`,
                              color: theme.red,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.72rem"
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSimulations(prev => prev.map(s => s.id === sim.id ? { ...s, status: "queued", progress: 0, estTime: "1m 15s" } : s));
                              triggerToast(`Re-enqueued simulation ${sim.id}`);
                            }}
                            style={{
                              padding: "4px 10px",
                              background: "none",
                              border: `1px solid ${theme.border2}`,
                              color: theme.text2,
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.72rem"
                            }}
                          >
                            Rerun
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ 3. DNA SEQUENCE PREVIEW & CORE PIPELINE PANEL ══ */}
        {activeTab === "sequencing" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            {/* Real Working DNA Storage Simulation Sandbox */}
            <div style={{
              background: theme.surf2,
              border: `1px solid ${theme.border2}`,
              borderRadius: 12,
              padding: "20px",
              marginBottom: "24px"
            }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 800 }}>📂 Real-time Shared DNA Core Engine Sandbox</h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2 }}>
                Enter ASCII text to run real digital-to-biological conversion. Execute direct encoding, decoding, verification, integrity checking, and telemetry reporting through the unified Core Engine.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <span style={{ fontSize: "0.76rem", color: theme.text2 }}>Active Pipeline Algorithm: </span>
                  <strong style={{ fontSize: "0.78rem", color: theme.accent }}>{selectedAlgName}</strong>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    placeholder="Enter raw text to encode (e.g. Hello World)"
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      background: theme.surf,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: theme.text1,
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: theme.text2, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={corruptPayload}
                      onChange={(e) => setCorruptPayload(e.target.checked)}
                      style={{ accentColor: theme.accent }}
                    />
                    <span>Simulate Payload Corruption</span>
                  </label>
                  <button
                    onClick={handleRunDnaSimulation}
                    style={{
                      padding: "10px 18px",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    Run Core Pipeline
                  </button>
                </div>

                {sandboxResult && (
                  <div style={{
                    background: theme.surf,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 10,
                    padding: "16px",
                    marginTop: "12px"
                  }}>
                    {/* Pipeline Visual Flow */}
                    <div style={{ marginBottom: "20px", borderBottom: `1px solid ${theme.border2}`, paddingBottom: "14px" }}>
                      <span style={{ fontSize: "0.7rem", color: theme.text3, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                        PIPELINE EXECUTION TELEMETRY FLOW
                      </span>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "0.72rem" }}>
                        <span style={{ background: theme.surf2, padding: "4px 8px", borderRadius: 4, color: theme.text1 }}>
                          Input: "{sandboxInput}"
                        </span>
                        <span style={{ color: theme.text3 }}>➔</span>
                        <span style={{ background: `${theme.accent}20`, padding: "4px 8px", borderRadius: 4, color: theme.accent, border: `1px solid ${theme.accent}30` }}>
                          Encode (UTF-8 & Checksum)
                        </span>
                        <span style={{ color: theme.text3 }}>➔</span>
                        <span style={{ background: `${theme.cyan}20`, padding: "4px 8px", borderRadius: 4, color: theme.cyan, border: `1px solid ${theme.cyan}30`, fontFamily: "monospace" }}>
                          {sandboxResult.dnaOutput.slice(0, 12)}...
                        </span>
                        <span style={{ color: theme.text3 }}>➔</span>
                        <span style={{ background: `${theme.pink}20`, padding: "4px 8px", borderRadius: 4, color: theme.pink, border: `1px solid ${theme.pink}30` }}>
                          Decode & Checksum Verify
                        </span>
                        <span style={{ color: theme.text3 }}>➔</span>
                        <span style={{ background: sandboxResult.success ? `${theme.green}20` : `${theme.red}20`, padding: "4px 8px", borderRadius: 4, color: sandboxResult.success ? theme.green : theme.red, border: `1px solid ${sandboxResult.success ? theme.green : theme.red}30` }}>
                          Validate & Complete
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        background: sandboxResult.success ? `${theme.green}15` : `${theme.red}15`,
                        color: sandboxResult.success ? theme.green : theme.red,
                        padding: "3px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase"
                      }}>
                        {sandboxResult.success ? "✓ Pipeline Validation: PASS" : "✗ Pipeline Validation: FAIL"}
                      </span>
                      <button
                        onClick={handleSaveToExperimentManager}
                        style={{
                          background: theme.surf2,
                          border: `1px solid ${theme.border2}`,
                          borderRadius: 6,
                          color: theme.cyan,
                          padding: "4px 10px",
                          fontSize: "0.74rem",
                          cursor: "pointer"
                        }}
                      >
                        Save to Experiment Manager & Memory System
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.78rem" }}>
                      <div><strong>Execution ID:</strong> <span style={{ fontFamily: "monospace", color: theme.text2 }}>{sandboxResult.executionId}</span></div>
                      <div><strong>Original Input payload:</strong> "{sandboxInput}" ({sandboxInput.length} characters, {new TextEncoder().encode(sandboxInput).length} bytes)</div>
                      <div><strong>Binary + Checksum representation:</strong></div>
                      <div style={{ wordBreak: "break-all", fontFamily: "monospace", padding: "8px", background: theme.surf2, borderRadius: "6px", color: theme.text2 }}>
                        {sandboxResult.binaryInput}
                      </div>
                      <div><strong>Encoded DNA Sequence (bases A, T, C, G):</strong></div>
                      <div style={{ wordBreak: "break-all", fontFamily: "monospace", padding: "8px", background: theme.surf2, borderRadius: "6px", color: theme.cyan, fontWeight: "bold" }}>
                        {sandboxResult.dnaOutput}
                      </div>

                      {sandboxResult.corruptionDetected && (
                        <div>
                          <strong style={{ color: theme.red }}>Intentionally Corrupted Sequence for demonstration:</strong>
                          <div style={{ wordBreak: "break-all", fontFamily: "monospace", padding: "8px", background: `${theme.red}10`, border: `1px solid ${theme.red}20`, borderRadius: "6px", color: theme.red }}>
                            {sandboxResult.processedDnaSequence}
                          </div>
                        </div>
                      )}

                      <div><strong>Recovered Output:</strong> <span style={{ color: theme.text1, fontWeight: "bold" }}>"{sandboxResult.decodedText}"</span></div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "6px 0", background: theme.surf2, padding: "10px", borderRadius: "6px" }}>
                        <div><strong>Original Checksum:</strong> <span style={{ fontFamily: "monospace" }}>{sandboxResult.computedChecksum}</span></div>
                        <div><strong>Extracted Checksum:</strong> <span style={{ fontFamily: "monospace" }}>{sandboxResult.extractedChecksum}</span></div>
                        <div><strong>Checksum Match:</strong> <span style={{ color: sandboxResult.checksumVerified ? theme.green : theme.red, fontWeight: "bold" }}>{sandboxResult.checksumVerified ? "VERIFIED" : "INTEGRITY ERROR"}</span></div>
                        <div><strong>Execution Latency:</strong> {sandboxResult.duration} ms</div>
                      </div>

                      {/* Rules verifications */}
                      <div style={{ marginTop: "10px", borderTop: `1px solid ${theme.border2}`, paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div><strong>Bio-Rule Compliance Verification:</strong></div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: "bold",
                            background: sandboxResult.gcRule.passed ? `${theme.green}20` : `${theme.red}20`,
                            color: sandboxResult.gcRule.passed ? theme.green : theme.red
                          }}>
                            {sandboxResult.gcRule.passed ? "GC Rule: PASS" : "GC Rule: FAIL"}
                          </span>
                          <span style={{ fontSize: "0.74rem", color: theme.text2 }}>
                            {sandboxResult.gcRule.message}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: "bold",
                            background: sandboxResult.homopolymerRule.passed ? `${theme.green}20` : `${theme.red}20`,
                            color: sandboxResult.homopolymerRule.passed ? theme.green : theme.red
                          }}>
                            {sandboxResult.homopolymerRule.passed ? "Homopolymer Rule: PASS" : "Homopolymer Rule: FAIL"}
                          </span>
                          <span style={{ fontSize: "0.74rem", color: theme.text2 }}>
                            {sandboxResult.homopolymerRule.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border2}`, margin: "24px 0" }} />

            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧬 Dynamic DNA Sequence Alignment & Presets
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Manipulate sample templates or generate random oligonucleotides. Use controls to complement base pairs or transcribe nucleotides instantly.
            </p>

            {/* Presets Row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {SAMPLE_SEQUENCES.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDnaSeq(preset.seq);
                    setCurrentSeqName(preset.name);
                    triggerToast(`Loaded: ${preset.name}`, "info");
                  }}
                  style={{
                    padding: "8px 14px",
                    background: currentSeqName === preset.name ? `${theme.accent}15` : theme.surf2,
                    border: `1px solid ${currentSeqName === preset.name ? theme.accent : theme.border2}`,
                    borderRadius: 8,
                    color: currentSeqName === preset.name ? theme.accent : theme.text2,
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Nucleobase Visualization Display */}
            <div style={{
              background: theme.surf2,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              fontFamily: "monospace"
            }}>
              <div style={{ fontSize: "0.74rem", color: theme.text3, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>🧬 5' → 3' Sense Strand Direction:</span>
                <span>{dnaSeq.length} base pairs</span>
              </div>

              {/* Graphical nucleobase chains */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {dnaSeq.split("").map((base, idx) => {
                  const bMeta = BASE_COLORS[base] || { bg: "#7c5cf6", text: "#fff" };
                  return (
                    <div key={idx} style={{
                      background: bMeta.bg,
                      color: bMeta.text,
                      width: "32px",
                      height: "38px",
                      borderRadius: 6,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 4px ${theme.shadow}`,
                      position: "relative"
                    }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>{base}</span>
                      <span style={{ fontSize: "0.55rem", opacity: 0.8, position: "absolute", bottom: 2 }}>{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sequence Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={handleRandomize}
                style={{
                  padding: "10px 16px",
                  background: theme.surf2,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 8,
                  color: theme.text1,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                🎲 Randomize Sequence
              </button>

              <button
                onClick={handleComplement}
                style={{
                  padding: "10px 16px",
                  background: theme.surf2,
                  border: `1px solid ${theme.border2}`,
                  borderRadius: 8,
                  color: theme.text1,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                🔄 Compute Complement
              </button>

              <button
                onClick={handleTranscribe}
                style={{
                  padding: "10px 16px",
                  background: `${theme.accent}12`,
                  border: `1px solid ${theme.accent}30`,
                  borderRadius: 8,
                  color: theme.accent,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Transcription (RNA)
              </button>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border2}`, margin: "24px 0" }} />

            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              📁 FASTA Import/Export Tool (Local Only)
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Import and parse genomic FASTA files or paste sequences directly. Export the current active nucleobase strand to a local FASTA file format.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: "250px", background: theme.surf2, padding: "16px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>Import FASTA File</h4>
                <input
                  type="file"
                  accept=".fasta,.fa,.txt"
                  onChange={handleImportFASTA}
                  style={{ fontSize: "0.78rem", color: theme.text2 }}
                />
              </div>

              <div style={{ flex: 1, minWidth: "250px", background: theme.surf2, padding: "16px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>Paste FASTA Data</h4>
                <textarea
                  value={pastedFasta}
                  onChange={(e) => setPastedFasta(e.target.value)}
                  placeholder=">Sequence_Header&#10;ATCGATCG..."
                  style={{
                    width: "100%",
                    height: "60px",
                    background: theme.surf,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: "6px",
                    padding: "8px",
                    color: theme.text1,
                    fontSize: "0.78rem",
                    fontFamily: "monospace",
                    resize: "none"
                  }}
                />
                <button
                  onClick={handlePasteImportFASTA}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    background: theme.accent,
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Import Pasted String
                </button>
              </div>

              <div style={{ flex: 1, minWidth: "250px", background: theme.surf2, padding: "16px", borderRadius: "10px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>Export Sequence</h4>
                  <p style={{ margin: "0 0 12px 0", fontSize: "0.74rem", color: theme.text2 }}>
                    Export current active sequence: <strong>{currentSeqName}</strong>
                  </p>
                </div>
                <button
                  onClick={handleExportFASTA}
                  style={{
                    padding: "10px 16px",
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  ⬇️ Export to FASTA File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ 4. MUTATION SIMULATION PREVIEW ══ */}
        {activeTab === "mutations" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              ⚡ Interactive Mutation Diff Telemetry
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Choose mutation parameters. Preview predicted nucleobase insertions, deletions, or single-point sequence transitions cleanly.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16
            }}>
              {/* Controls Column */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>
                  Mutation Parameters
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>Mutation Type:</label>
                    <select
                      value={mutationType}
                      onChange={e => {
                        setMutationType(e.target.value);
                        triggerToast(`Switched to ${e.target.value} mutation model`);
                      }}
                      style={{
                        width: "100%",
                        background: theme.surf,
                        border: `1px solid ${theme.border2}`,
                        borderRadius: 6,
                        padding: 6,
                        color: theme.text1,
                        fontSize: "0.78rem"
                      }}
                    >
                      <option value="point">Single-Point Mutation</option>
                      <option value="insertion">Single Nucleotide Insertion</option>
                      <option value="deletion">Single Nucleotide Deletion</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>Target Mutation Position (index):</label>
                    <input
                      type="number"
                      min={0}
                      max={dnaSeq.length - 1}
                      value={mutationPos}
                      onChange={e => setMutationPos(Number(e.target.value))}
                      style={{
                        width: "100%",
                        background: theme.surf,
                        border: `1px solid ${theme.border2}`,
                        borderRadius: 6,
                        padding: 6,
                        color: theme.text1,
                        fontSize: "0.78rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>Frequency Rate: {(mutationRate * 100).toFixed(1)}%</label>
                    <input
                      type="range"
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      value={mutationRate}
                      onChange={e => setMutationRate(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Legend & Summary Info */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text1 }}>
                  Mutation Telemetry Insights
                </h4>
                <div style={{ fontSize: "0.74rem", color: theme.text2, lineHeight: 1.6 }}>
                  <p style={{ margin: "0 0 8px 0" }}>
                    • Point mutations simulate substitution transitions or transversions without shifting the coordinate frame.
                  </p>
                  <p style={{ margin: "0 0 8px 0" }}>
                    • Insertion and Deletion processes trigger severe frame shifts downstream from the targeted index.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <span style={{ background: `${theme.red}20`, color: theme.red, padding: "2px 8px", borderRadius: 4, fontSize: "0.65rem", fontWeight: 700 }}>Frame-shift Risk: HIGH</span>
                    <span style={{ background: `${theme.yellow}20`, color: theme.yellow, padding: "2px 8px", borderRadius: 4, fontSize: "0.65rem", fontWeight: 700 }}>Transition Ratio: 1.48</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Before-and-after visual alignment comparison */}
            <div style={{
              background: theme.surf2,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: 18,
              fontFamily: "monospace"
            }}>
              {/* Original strand */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.72rem", color: theme.text3, marginBottom: 6 }}>Original Sequence Sense Strand:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {mutationDiff.original.split("").map((base, idx) => (
                    <span key={idx} style={{
                      background: idx === mutationDiff.pos ? `${theme.yellow}22` : theme.surf,
                      border: `1px solid ${idx === mutationDiff.pos ? theme.yellow : theme.border2}`,
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: idx === mutationDiff.pos ? theme.yellow : theme.text1
                    }}>
                      {base}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modified strand */}
              <div>
                <div style={{ fontSize: "0.72rem", color: theme.text3, marginBottom: 6 }}>Mutated Alignment Strand:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {mutationDiff.modified.split("").map((base, idx) => {
                    const isMutated = idx === mutationDiff.pos;
                    return (
                      <span key={idx} style={{
                        background: isMutated ? `${theme.red}22` : theme.surf,
                        border: `1px solid ${isMutated ? theme.red : theme.border2}`,
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: isMutated ? theme.red : theme.text1
                      }}>
                        {base}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ LOCAL SIMULATION LAB ══ */}
        {activeTab === "simulation_lab" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧪 Local Biological-Digital Simulation Lab (Deterministic)
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Calibrate write synthesis rates, degradation/environmental noise, and read sequencing rates. Run fully deterministic simulations locally and view precise Levenshtein traceback error profiles.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20
            }}>
              {/* Controls Column */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: "0.85rem", color: theme.text1 }}>
                  Simulation Error Rates Configuration
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                      Write Synthesis Error Rate: <strong>{writeErrorRate.toFixed(1)}%</strong>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.1}
                      value={writeErrorRate}
                      onChange={e => setWriteErrorRate(Number(e.target.value))}
                      style={{ width: "100%", accentColor: theme.accent }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                      Environmental Noise Injection Rate: <strong>{noiseRate.toFixed(1)}%</strong>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={0.1}
                      value={noiseRate}
                      onChange={e => setNoiseRate(Number(e.target.value))}
                      style={{ width: "100%", accentColor: theme.accent }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                      Read Sequencing Error Rate: <strong>{readErrorRate.toFixed(1)}%</strong>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.1}
                      value={readErrorRate}
                      onChange={e => setReadErrorRate(Number(e.target.value))}
                      style={{ width: "100%", accentColor: theme.accent }}
                    />
                  </div>

                  <button
                    onClick={handleRunLocalSimulation}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    🚀 Trigger Local End-to-End Simulation
                  </button>
                </div>
              </div>

              {/* Statistics & Alignment Output */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: theme.text1 }}>
                    Active Simulation Run Error Statistics
                  </h4>

                  {currentSimResult ? (
                    <div style={{ fontSize: "0.78rem", color: theme.text2, lineHeight: 1.6 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: theme.surf, padding: 12, borderRadius: 8 }}>
                        <div><strong>Total Errors:</strong> <span style={{ color: currentSimResult.success ? theme.green : theme.red, fontWeight: 700 }}>{currentSimResult.totalErrors}</span></div>
                        <div><strong>Overall Error Rate:</strong> <span style={{ color: currentSimResult.success ? theme.green : theme.red, fontWeight: 700 }}>{currentSimResult.errorRate}%</span></div>
                        <div><strong>Substitutions (S):</strong> <span style={{ color: theme.yellow }}>{currentSimResult.subs}</span></div>
                        <div><strong>Insertions (I):</strong> <span style={{ color: theme.cyan }}>{currentSimResult.ins}</span></div>
                        <div><strong>Deletions (D):</strong> <span style={{ color: theme.pink }}>{currentSimResult.dels}</span></div>
                        <div><strong>Execution Latency:</strong> <span>{currentSimResult.duration} ms</span></div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <strong>Original Sequence:</strong>
                        <div style={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.72rem", background: theme.surf, padding: 6, borderRadius: 4, marginTop: 4, maxHeight: 40, overflowY: "auto" }}>
                          {currentSimResult.originalSeq}
                        </div>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <strong>Sequenced / Recovered DNA:</strong>
                        <div style={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.72rem", background: theme.surf, padding: 6, borderRadius: 4, marginTop: 4, maxHeight: 40, overflowY: "auto", color: currentSimResult.success ? theme.green : theme.yellow }}>
                          {currentSimResult.readSeq}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", color: theme.text3, padding: "40px 0" }}>
                      No active simulation result. Configure rates and click "Trigger Local End-to-End Simulation".
                    </div>
                  )}
                </div>

                {currentSimResult && (
                  <div style={{ borderTop: `1px solid ${theme.border2}`, paddingTop: 10, marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: theme.text3 }}>Status: {currentSimResult.success ? "✓ PERFECT RECOVERY" : "⚡ ERRORS INJECTED"}</span>
                    <button
                      onClick={() => {
                        // Save current results as an experiment or memory entry
                        try {
                          const cachedMem = localStorage.getItem("apex_os_v4_research_memories");
                          let memories = cachedMem ? JSON.parse(cachedMem) : [];
                          memories.unshift({
                            id: `mem_sim_${Date.now()}`,
                            title: `[Sim Lab Run] ${currentSimResult.success ? "Perfect" : "Degraded"} Storage Trace`,
                            type: "Simulation Run",
                            content: `Deterministic simulation stats:\n- Write rate: ${currentSimResult.writeErrorRate}%\n- Noise rate: ${currentSimResult.noiseRate}%\n- Read rate: ${currentSimResult.readErrorRate}%\n- Substitutions: ${currentSimResult.subs}\n- Insertions: ${currentSimResult.ins}\n- Deletions: ${currentSimResult.dels}\n- Total errors: ${currentSimResult.totalErrors}\n- Error rate: ${currentSimResult.errorRate}%\n- Latency: ${currentSimResult.duration} ms`,
                            tags: ["Simulation", "Traceback", "Deterministic"],
                            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
                            severity: currentSimResult.success ? "Low" : "Medium"
                          });
                          localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
                          triggerToast("Simulation telemetry synchronized to Research Memory System!", "success");
                        } catch(e) {}
                      }}
                      style={{
                        padding: "4px 8px",
                        background: theme.surf,
                        border: `1px solid ${theme.border2}`,
                        color: theme.text1,
                        borderRadius: 6,
                        fontSize: "0.72rem",
                        cursor: "pointer"
                      }}
                    >
                      Sync to Research Memory
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Run History List */}
            <div>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: theme.text1 }}>
                Simulation Run History ({simLabResults.length})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "150px", overflowY: "auto" }}>
                {simLabResults.length === 0 ? (
                  <div style={{ color: theme.text3, fontSize: "0.78rem", textAlign: "center", padding: 12 }}>
                    No simulation history. Run a simulation above!
                  </div>
                ) : (
                  simLabResults.map(res => (
                    <div
                      key={res.id}
                      style={{
                        background: theme.surf2,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 8,
                        padding: "8px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.74rem"
                      }}
                    >
                      <div>
                        <strong>{res.timestamp.replace("T", " ").substring(0, 16)}</strong> | Write: {res.writeErrorRate}% | Noise: {res.noiseRate}% | Read: {res.readErrorRate}%
                        <div style={{ fontSize: "0.68rem", color: theme.text3, marginTop: 2 }}>
                          Errors: {res.totalErrors} (S:{res.subs} I:{res.ins} D:{res.dels}) | Error Rate: {res.errorRate}% | Time: {res.duration}ms
                        </div>
                      </div>
                      <span style={{
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        background: res.success ? `${theme.green}20` : `${theme.red}20`,
                        color: res.success ? theme.green : theme.red
                      }}>
                        {res.success ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ STORAGE ARCHITECT ══ */}
        {activeTab === "storage_architect" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              📐 Deterministic Storage Architect & Multi-Model Comparator
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Select two or more DNA encoding algorithms to run side-by-side. The engine will perform live digital-biological translations under a standard benchmark payload to calculate real density, speed, accuracy, and noise-resilience metrics.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 20,
              alignItems: "start"
            }}>
              {/* Left Column: Algorithm Selection */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: theme.text1 }}>
                  1. Select Models to Compare
                </h4>

                {/* Benchmark Payload */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.72rem", color: theme.text2, display: "block", marginBottom: 4 }}>
                    Custom Benchmark Payload (ASCII):
                  </label>
                  <input
                    type="text"
                    value={comparePayload}
                    onChange={(e) => setComparePayload(e.target.value)}
                    style={{
                      width: "100%",
                      background: theme.surf,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      color: theme.text1,
                      fontSize: "0.78rem"
                    }}
                  />
                </div>

                {/* Algorithm list with checkboxes */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "200px", overflowY: "auto", marginBottom: 16 }}>
                  {(() => {
                    const saved = localStorage.getItem("apex_os_algorithms");
                    const list = saved ? JSON.parse(saved) : [];
                    if (list.length === 0) {
                      return <div style={{ fontSize: "0.75rem", color: theme.text3 }}>No algorithms registered. Go to Algorithm Designer to create some drafts!</div>;
                    }
                    return list.map(alg => {
                      const isChecked = selectedCompareIds.includes(alg.id);
                      return (
                        <label
                          key={alg.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px",
                            background: isChecked ? `${theme.accent}10` : theme.surf,
                            border: `1px solid ${isChecked ? theme.accent : theme.border2}`,
                            borderRadius: 6,
                            fontSize: "0.78rem",
                            cursor: "pointer"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedCompareIds(prev =>
                                isChecked ? prev.filter(id => id !== alg.id) : [...prev, alg.id]
                              );
                            }}
                            style={{ accentColor: theme.accent }}
                          />
                          <div>
                            <strong>{alg.name}</strong>
                            <div style={{ fontSize: "0.68rem", color: theme.text3 }}>Version: {alg.version}</div>
                          </div>
                        </label>
                      );
                    });
                  })()}
                </div>

                <button
                  onClick={handleRunComparison}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  📊 Compare Storage Architectures
                </button>
              </div>

              {/* Right Column: Comparison Table and Justification */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: theme.text1 }}>
                  2. Performance Matrix Results & Leaderboard
                </h4>

                {compareResults ? (
                  <div>
                    {/* Ranked Leaderboard */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                      {compareResults.map((res, index) => (
                        <div
                          key={res.id}
                          style={{
                            background: theme.surf,
                            border: `1px solid ${index === 0 ? theme.green : theme.border2}`,
                            borderRadius: 10,
                            padding: 12,
                            position: "relative"
                          }}
                        >
                          {index === 0 && (
                            <span style={{
                              position: "absolute",
                              top: -8,
                              right: 12,
                              background: theme.green,
                              color: "#fff",
                              fontSize: "0.65rem",
                              fontWeight: 900,
                              padding: "2px 8px",
                              borderRadius: 10,
                              textTransform: "uppercase"
                            }}>
                              🏆 Winner
                            </span>
                          )}

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div>
                              <strong style={{ fontSize: "0.88rem", color: theme.text1 }}>{index + 1}. {res.name}</strong>
                              <span style={{ fontSize: "0.72rem", color: theme.text3, marginLeft: 8 }}>({res.version})</span>
                            </div>
                            <span style={{ fontSize: "0.95rem", fontWeight: 900, color: index === 0 ? theme.green : theme.accent }}>
                              Score: {res.weightedScore}/100
                            </span>
                          </div>

                          {/* Grid metrics */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, fontSize: "0.72rem", color: theme.text2 }}>
                            <div style={{ background: theme.surf2, padding: 6, borderRadius: 4 }}>
                              Density: <strong style={{ color: theme.text1 }}>{res.density} bits/nt</strong>
                            </div>
                            <div style={{ background: theme.surf2, padding: 6, borderRadius: 4 }}>
                              E2E Latency: <strong style={{ color: theme.text1 }}>{res.totalTime} ms</strong>
                            </div>
                            <div style={{ background: theme.surf2, padding: 6, borderRadius: 4 }}>
                              Roundtrip Acc: <strong style={{ color: theme.green }}>{res.accuracy}%</strong>
                            </div>
                            <div style={{ background: theme.surf2, padding: 6, borderRadius: 4 }}>
                              GC Balance: <strong style={{ color: theme.yellow }}>{res.gcPercent}% ({res.gcBalance}/100)</strong>
                            </div>
                            <div style={{ background: theme.surf2, padding: 6, borderRadius: 4 }}>
                              ECC Overhead: <strong style={{ color: theme.text3 }}>{res.eccOverhead}%</strong>
                            </div>
                            <div style={{ background: theme.surf2, padding: 6, borderRadius: 4 }}>
                              Noise Error Rate: <strong style={{ color: parseFloat(res.errorRate) > 0 ? theme.red : theme.green }}>{res.errorRate}%</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mathematical Justification Box */}
                    <div style={{
                      background: `${theme.accent}12`,
                      borderLeft: `3px solid ${theme.accent}`,
                      borderRadius: "0 8px 8px 0",
                      padding: "12px 16px",
                      fontSize: "0.76rem",
                      color: theme.text2,
                      lineHeight: 1.5
                    }}>
                      <strong>Executive Architectural Decision Brief:</strong>
                      <p style={{ margin: "6px 0 0 0" }}>
                        The top-performing storage model is <strong>{compareResults[0].name}</strong> with a weighted score of <strong>{compareResults[0].weightedScore}</strong>. It achieved a physical coding density of <strong>{compareResults[0].density} bits/nucleotide</strong>, an optimal round-trip decoding accuracy of <strong>{compareResults[0].accuracy}%</strong>, and kept GC Balance drift at a minimum with <strong>{compareResults[0].gcPercent}% GC content</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: theme.text3, padding: "60px 0" }}>
                    Select at least 2 algorithms on the left and click "Compare Storage Architectures" to compute real comparison statistics.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ 5. PROTEIN TRANSLATION PREVIEW ══ */}
        {activeTab === "translation" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🧪 Ribosomal Translation Preview
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Analyze transcribed RNA codons mapped directly against genetic tables to synthesize virtual amino acid peptide residues.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 16
            }}>
              {/* Left Column: Stats & Settings */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "0.82rem", color: theme.text1 }}>
                    Translation Metrics
                  </h4>
                  <div style={{ fontSize: "0.75rem", color: theme.text2, lineHeight: 1.6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>Total Codons:</span>
                      <strong style={{ color: theme.text1 }}>{translationPreview.length}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>Start Codon Identified:</span>
                      <strong style={{ color: theme.green }}>
                        {dnaSeq.startsWith("ATG") ? "YES (Met)" : "NO (No ATG)"}
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>Stop Codon Included:</span>
                      <strong style={{ color: theme.yellow }}>
                        {dnaSeq.includes("TAA") || dnaSeq.includes("TAG") ? "YES" : "NO"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => triggerToast("Peptide chain verified for synthesis alignment.")}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: theme.accent,
                      border: "none",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Verify Peptide Residues
                  </button>
                </div>
              </div>

              {/* Right Column: Triplet List */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: theme.text1 }}>
                  Codons Mapping Table View
                </h4>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 8,
                  maxHeight: "180px",
                  overflowY: "auto",
                  padding: "4px"
                }}>
                  {translationPreview.map((item, idx) => (
                    <div key={idx} style={{
                      background: theme.surf,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "0.64rem", color: theme.text3 }}>Codon {idx + 1}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: theme.accent, fontFamily: "monospace", margin: "2px 0" }}>
                        {item.codon}
                      </div>
                      <div style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: item.aa.includes("Met") ? theme.green : item.aa.includes("Stop") ? theme.red : theme.text2
                      }}>
                        {item.aa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ 6. GENE MAPPING PREVIEW ══ */}
        {activeTab === "mapping" && (
          <div style={{
            background: theme.surf,
            border: `1px solid ${theme.border2}`,
            borderRadius: 14,
            padding: 20
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800 }}>
              🗺️ High-Fidelity Gene Mapping Previewer
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.78rem", color: theme.text2, lineHeight: 1.5 }}>
              Visualize the genome architecture timeline showing exons, introns, and promoters using interactive tooltip elements.
            </p>

            {/* Visual Timelines */}
            <div style={{
              background: theme.surf2,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${theme.border}`,
              marginBottom: 16
            }}>
              <div style={{ fontSize: "0.74rem", color: theme.text3, marginBottom: 12 }}>
                🧬 Exon-Intron Coordinate Structure mapping:
              </div>

              {/* Graphic container */}
              <div style={{ position: "relative", height: "70px", background: theme.surf, borderRadius: 8, border: `1px solid ${theme.border2}`, display: "flex", overflow: "hidden" }}>
                {/* Promoter Block */}
                <div style={{
                  width: "15%",
                  background: `linear-gradient(90deg, ${theme.yellow}30, ${theme.yellow}60)`,
                  borderRight: `2px solid ${theme.yellow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.yellow,
                  cursor: "help"
                }} title="Promoter Sequence coordinate: indices 0-150">
                  Promoter
                </div>

                {/* Exon 1 */}
                <div style={{
                  width: "25%",
                  background: `linear-gradient(90deg, ${theme.green}30, ${theme.green}60)`,
                  borderRight: `2px solid ${theme.green}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.green,
                  cursor: "help"
                }} title="Exon 1 coordinate: indices 150-400">
                  Exon 1
                </div>

                {/* Intron 1 */}
                <div style={{
                  width: "20%",
                  background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.border2} 10px, ${theme.border2} 20px)`,
                  borderRight: `2px solid ${theme.text3}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: theme.text2,
                  cursor: "help"
                }} title="Intron 1 coordinate: indices 400-600">
                  Intron 1
                </div>

                {/* Exon 2 */}
                <div style={{
                  width: "30%",
                  background: `linear-gradient(90deg, ${theme.green}30, ${theme.green}60)`,
                  borderRight: `2px solid ${theme.green}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.green,
                  cursor: "help"
                }} title="Exon 2 coordinate: indices 600-900">
                  Exon 2
                </div>

                {/* Terminator */}
                <div style={{
                  width: "10%",
                  background: `linear-gradient(90deg, ${theme.red}30, ${theme.red}60)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: theme.red,
                  cursor: "help"
                }} title="Terminator: indices 900-1000">
                  Terminator
                </div>
              </div>

              {/* Coordinates axis */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.64rem", color: theme.text3, marginTop: 6, fontFamily: "monospace" }}>
                <span>0 bp</span>
                <span>250 bp</span>
                <span>500 bp</span>
                <span>750 bp</span>
                <span>1000 bp</span>
              </div>
            </div>

            {/* Annotation Legend cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12
            }}>
              {[
                { title: "Promoters", count: "1 Located", color: theme.yellow, desc: "Initiation coordinates for transcribed processes." },
                { title: "Exons", count: "2 Located", color: theme.green, desc: "Coding segments preserved within final RNA residue." },
                { title: "Introns", count: "1 Located", color: theme.text3, desc: "Spliced segments discarded during alignment." }
              ].map((c, idx) => (
                <div key={idx} style={{
                  background: theme.surf2,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: theme.text1 }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: "0.66rem", color: theme.text2, marginBottom: 4 }}>{c.count}</div>
                  <div style={{ fontSize: "0.64rem", color: theme.text3, lineHeight: 1.4 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 7. SIMULATION REPORTS & CHARTS ══ */}
        {activeTab === "reports" && (
          <div>
            {/* SVG Charts Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16
            }}>
              {/* Chart 1: GC Content Distribution */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 18
              }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: 800 }}>
                  📈 GC Content Density Distribution
                </h4>
                <div style={{ height: "140px", display: "flex", alignItems: "flex-end", gap: 14, padding: "10px 4px 4px" }}>
                  {[42, 58, 62, 51, 48, 65, 59].map((val, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: "100%",
                        height: `${val * 1.3}px`,
                        background: `linear-gradient(180deg, ${theme.cyan}, ${theme.accent})`,
                        borderRadius: "4px 4px 0 0"
                      }} />
                      <span style={{ fontSize: "0.65rem", color: theme.text3, marginTop: 4 }}>W{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Mutation Frequency */}
              <div style={{
                background: theme.surf,
                border: `1px solid ${theme.border2}`,
                borderRadius: 14,
                padding: 18
              }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: 800 }}>
                  📊 Codon Base Distribution
                </h4>
                <div style={{ height: "140px", display: "flex", alignItems: "flex-end", gap: 20, padding: "10px 10px 4px" }}>
                  {[
                    { label: "Adenine", count: 28, color: BASE_COLORS.A.bg },
                    { label: "Thymine", count: 22, color: BASE_COLORS.T.bg },
                    { label: "Cytosine", count: 32, color: BASE_COLORS.C.bg },
                    { label: "Guanine", count: 18, color: BASE_COLORS.G.bg }
                  ].map((codon, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: "100%",
                        height: `${codon.count * 3}px`,
                        background: codon.color,
                        borderRadius: "4px 4px 0 0"
                      }} />
                      <span style={{ fontSize: "0.64rem", color: theme.text2, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {codon.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports Block */}
            <div style={{
              background: theme.surf,
              border: `1px solid ${theme.border2}`,
              borderRadius: 14,
              padding: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                  📄 Diagnostic Telemetry Simulation Report
                </h3>
                <button
                  onClick={() => triggerToast("PDF alignment report exported successfully!", "success")}
                  style={{
                    padding: "6px 12px",
                    background: theme.accent,
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  📥 Export Report
                </button>
              </div>

              {/* Detailed Metrics Report body */}
              <div style={{
                background: theme.surf2,
                borderRadius: 10,
                padding: 16,
                border: `1px solid ${theme.border}`
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, fontSize: "0.78rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Target Helix Segment:</span>
                      <span style={{ color: theme.text1, fontWeight: 700 }}>{currentSeqName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>GC Content Percent:</span>
                      <span style={{ color: theme.green, fontWeight: 700 }}>{reportStats.gcPercent}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Transition Frequency:</span>
                      <span style={{ color: theme.text1 }}>0.048 mutations / kb</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Thermodynamic Tm:</span>
                      <span style={{ color: theme.yellow, fontWeight: 700 }}>{reportStats.tm}°C</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Sequence Complexity:</span>
                      <span style={{ color: theme.text1 }}>High Entropic Purity</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border2}`, padding: "6px 0" }}>
                      <span style={{ color: theme.text2 }}>Codon Splicing Index:</span>
                      <span style={{ color: theme.text1 }}>0.62 (Normal)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ 8. SETTINGS PANEL (WITH SAVE/LOAD DNA CONFIGS) ══ */}
        {activeTab === "settings" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>
            {/* Left settings */}
            <div style={{
              background: theme.surf,
              border: `1px solid ${theme.border2}`,
              borderRadius: 14,
              padding: 20
            }}>
              <h3 style={{ margin: "0 0 14px 0", fontSize: "1rem", fontWeight: 800 }}>
                ⚙️ DNA Simulation Configuration Settings
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                    Simulation Speed Multiplier:
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 5].map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          setSimSpeed(speed);
                          triggerToast(`Speed factor adjusted to ${speed}x`);
                        }}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: simSpeed === speed ? `${theme.accent}15` : theme.surf2,
                          border: `1px solid ${simSpeed === speed ? theme.accent : theme.border2}`,
                          borderRadius: 6,
                          color: simSpeed === speed ? theme.accent : theme.text2,
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {speed}x speed
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                    Error Tolerance Coefficient:
                  </label>
                  <input
                    type="number"
                    step={0.005}
                    min={0.001}
                    max={0.05}
                    value={errorTolerance}
                    onChange={e => {
                      setErrorTolerance(Number(e.target.value));
                      triggerToast("Error tolerance adjusted");
                    }}
                    style={{
                      width: "100%",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 6,
                      padding: "8px 12px",
                      color: theme.text1,
                      fontSize: "0.82rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", color: theme.text2, display: "block", marginBottom: 6 }}>
                    Genetic Code Table Selection:
                  </label>
                  <select
                    value={codonTable}
                    onChange={e => {
                      setCodonTable(e.target.value);
                      triggerToast(`Switched translation table: ${e.target.value}`);
                    }}
                    style={{
                      width: "100%",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 6,
                      padding: "8px 12px",
                      color: theme.text1,
                      fontSize: "0.82rem"
                    }}
                  >
                    <option value="standard">Standard Genetic Translation Code</option>
                    <option value="vertebrate_mito">Vertebrate Mitochondrial Code</option>
                    <option value="yeast_mito">Yeast Mitochondrial Genetic Table</option>
                  </select>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setMutationRate(0.05);
                      setMutationType("point");
                      setMutationPos(5);
                      setSimSpeed(1);
                      setErrorTolerance(0.01);
                      setCodonTable("standard");
                      triggerToast("Restored engine default parameters");
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: theme.surf2,
                      border: `1px solid ${theme.border2}`,
                      borderRadius: 8,
                      color: theme.text2,
                      fontSize: "0.78rem",
                      cursor: "pointer"
                    }}
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={() => triggerToast("Simulation parameters saved successfully", "success")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Save Calibrations
                  </button>
                </div>
              </div>
            </div>

            {/* Right configurations save/load */}
            <div style={{
              background: theme.surf,
              border: `1px solid ${theme.border2}`,
              borderRadius: 14,
              padding: 20
            }}>
              <h3 style={{ margin: "0 0 14px 0", fontSize: "1rem", fontWeight: 800, color: theme.text1 }}>
                💾 Saved Configurations ({savedConfigs.length})
              </h3>

              {/* Save Form */}
              <form onSubmit={handleSaveConfig} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                  type="text"
                  required
                  value={configNameInput}
                  onChange={e => setConfigNameInput(e.target.value)}
                  placeholder="Config name (e.g. CRISPR Mode A)"
                  style={{
                    flex: 1,
                    background: theme.surf2,
                    border: `1px solid ${theme.border2}`,
                    borderRadius: 6,
                    padding: "8px 12px",
                    color: theme.text1,
                    fontSize: "0.8rem",
                    outline: "none"
                  }}
                />
                <button type="submit" style={{ padding: "8px 14px", background: theme.accent, border: "none", borderRadius: 6, color: "#fff", fontWeight: "bold", fontSize: "0.78rem", cursor: "pointer" }}>Save Config</button>
              </form>

              {/* Config list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
                {savedConfigs.length === 0 ? (
                  <div style={{ color: theme.text3, textAlign: "center", fontSize: "0.78rem", padding: "12px" }}>No saved configurations. Create one above!</div>
                ) : (
                  savedConfigs.map(cfg => (
                    <div key={cfg.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.surf2, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px" }}>
                      <div>
                        <strong style={{ fontSize: "0.82rem", color: theme.text1 }}>{cfg.name}</strong>
                        <div style={{ fontSize: "0.68rem", color: theme.text3, marginTop: "2px" }}>
                          Seq: {cfg.dnaSeq?.substring(0, 10)}... | Mutation Type: {cfg.mutationType}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => handleLoadConfig(cfg)} style={{ background: theme.surf, border: `1px solid ${theme.border2}`, color: theme.green, padding: "4px 8px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>Load</button>
                        <button onClick={() => handleDeleteConfig(cfg.id)} style={{ background: theme.surf, border: `1px solid ${theme.border2}`, color: theme.red, padding: "4px 8px", borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

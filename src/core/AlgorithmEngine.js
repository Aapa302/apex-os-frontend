/**
 * APEX OS Algorithm Engine
 * Reusable engine to manage, execute, benchmark, clone, version, archive, and compare DNA Storage algorithms.
 * Integrates directly with the central DNACoreEngine and localStorage state persistence.
 */

import { Encode, Decode, Validate, Benchmark } from "./DNACoreEngine";

const STORAGE_KEY = "apex_os_algorithms";

/**
 * Standardizes an algorithm structure
 */
export function createAlgorithmModel(params = {}) {
  const id = params.id || `alg_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return {
    id,
    name: params.name || "Untitled DNA Storage Algorithm",
    author: params.author || "Sarah Kim",
    version: params.version || "v1.0.0",
    description: params.description || "A custom binary-to-nucleobase storage alignment model.",
    dnaMappingStrategy: params.dnaMappingStrategy || "Direct Base Mapping",
    encodingRules: params.encodingRules || "A=00, C=01, G=10, T=11",
    decodingRules: params.decodingRules || "00=A, 01=C, 10=G, 11=T",
    binaryMapping: params.binaryMapping || params.decodingRules || "00=A, 01=C, 10=G, 11=T", // back-compat
    dnaMapping: params.dnaMapping || params.encodingRules || "A=00, C=01, G=10, T=11", // back-compat
    gcRules: params.gcRules || "40-60",
    homopolymerRules: params.homopolymerRules || "Max run length 3",
    compressionStrategy: params.compressionStrategy || "None",
    checksumMethod: params.checksumMethod || "CRC-32 Checksum",
    validationMethod: params.validationMethod || "Exact Match Levenshtein",
    errorDetection: params.errorDetection || params.checksumMethod || "CRC-32 Checksum",
    errorCorrection: params.errorCorrection || "None",
    creationDate: params.creationDate || new Date().toISOString().split("T")[0],
    favorite: !!params.favorite,
    recent: true,
    archived: !!params.archived,
    category: params.category || "Custom DNA",
    formulas: params.formulas || [], // Referenced formula IDs or objects
    versions: params.versions || [
      {
        id: `v_init_${id}`,
        number: params.version || "v1.0.0",
        date: params.creationDate || new Date().toISOString().split("T")[0],
        author: params.author || "Sarah Kim",
        description: "Initial model structure generated.",
        status: "Approved"
      }
    ],
    executionStatistics: params.executionStatistics || {
      executionsCount: 0,
      successfulRuns: 0,
      failedRuns: 0,
      averageEncodingTime: 0,
      averageDecodingTime: 0,
      bestEncodingTime: Infinity,
      bestDecodingTime: Infinity,
      totalEncodingTime: 0,
      totalDecodingTime: 0
    }
  };
}

/**
 * Loads all algorithms from localStorage
 */
export function getAllAlgorithms() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading algorithms:", e);
  }

  // Fallback to defaults (can be populated or empty)
  return [];
}

/**
 * Saves all algorithms to localStorage
 */
export function saveAllAlgorithms(algorithms) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(algorithms));
    return true;
  } catch (e) {
    console.error("Error saving algorithms:", e);
    return false;
  }
}

/**
 * Creates and registers a new algorithm
 */
export function createAlgorithm(params = {}) {
  const algs = getAllAlgorithms();
  const newAlg = createAlgorithmModel(params);
  algs.unshift(newAlg);
  saveAllAlgorithms(algs);

  // Trigger automated test run on creation
  executeAndBenchmarkAlgorithm(newAlg.id, "APEX OS Core Engine Initialization Sequence Sample Data Segment");

  return newAlg;
}

/**
 * Clones/duplicates an existing algorithm
 */
export function cloneAlgorithm(id, customName = null) {
  const algs = getAllAlgorithms();
  const target = algs.find(a => a.id === id);
  if (!target) return null;

  const duplicatedId = `alg_clone_${Date.now()}`;
  const cloned = {
    ...JSON.parse(JSON.stringify(target)),
    id: duplicatedId,
    name: customName || `${target.name} (Copy)`,
    creationDate: new Date().toISOString().split("T")[0],
    favorite: false,
    recent: true,
    versions: [
      {
        id: `v_init_${duplicatedId}`,
        number: "v1.0.0",
        date: new Date().toISOString().split("T")[0],
        author: "Sarah Kim",
        description: `Cloned from ${target.name} (${target.version}).`,
        status: "Approved"
      }
    ],
    executionStatistics: {
      executionsCount: 0,
      successfulRuns: 0,
      failedRuns: 0,
      averageEncodingTime: 0,
      averageDecodingTime: 0,
      bestEncodingTime: Infinity,
      bestDecodingTime: Infinity,
      totalEncodingTime: 0,
      totalDecodingTime: 0
    }
  };

  algs.unshift(cloned);
  saveAllAlgorithms(algs);
  return cloned;
}

/**
 * Edits an algorithm
 */
export function editAlgorithm(id, updates = {}) {
  const algs = getAllAlgorithms();
  const idx = algs.findIndex(a => a.id === id);
  if (idx === -1) return null;

  const current = algs[idx];
  const updated = {
    ...current,
    ...updates,
    lastModified: new Date().toISOString().split("T")[0]
  };

  algs[idx] = updated;
  saveAllAlgorithms(algs);
  return updated;
}

/**
 * Archives an algorithm
 */
export function archiveAlgorithm(id) {
  return editAlgorithm(id, { archived: true });
}

/**
 * Adds a new version descriptor
 */
export function versionAlgorithm(id, versionNumber, author, description) {
  const algs = getAllAlgorithms();
  const idx = algs.findIndex(a => a.id === id);
  if (idx === -1) return null;

  const current = algs[idx];
  const nextVer = {
    id: `v_${Date.now()}`,
    number: versionNumber,
    date: new Date().toISOString().split("T")[0],
    author,
    description,
    status: "Approved"
  };

  const updatedVersions = [nextVer, ...(current.versions || [])];
  const updated = {
    ...current,
    version: versionNumber,
    versions: updatedVersions
  };

  algs[idx] = updated;
  saveAllAlgorithms(algs);

  // Sync to Research Memory System
  saveToResearchMemory(updated, null, `New version ${versionNumber} released. Desc: ${description}`);

  return updated;
}

/**
 * Executes a raw algorithm run using the central DNACoreEngine
 */
export function executeAndBenchmarkAlgorithm(id, payload = "APEX OS V3 Seed Payload") {
  const algs = getAllAlgorithms();
  const idx = algs.findIndex(a => a.id === id);
  if (idx === -1) return null;

  const alg = algs[idx];
  const benchmark = Benchmark(payload, alg);

  const isSuccess = benchmark.validationResult === "PASS" && benchmark.checksumResult === "PASS";

  // Calculate memory usage (estimated payload + binary sizes in bytes)
  const memoryUsageBytes = (payload.length * 2) + (benchmark.binaryLength / 8);

  const report = {
    executionId: benchmark.executionId,
    algorithmId: id,
    algorithmName: alg.name,
    payloadInput: payload,
    dnaSequence: Encode(payload, alg).dnaSequence,
    encodingTime: benchmark.encodingTime,
    decodingTime: benchmark.decodingTime,
    dnaLength: benchmark.dnaLength,
    binaryLength: benchmark.binaryLength,
    originalSize: benchmark.originalSize,
    recoveredSize: benchmark.recoveredSize,
    validationResult: benchmark.validationResult,
    checksumResult: benchmark.checksumResult,
    similarity: benchmark.similarity,
    errorCount: benchmark.errorCount,
    compressionRatio: (benchmark.originalSize > 0) ? (benchmark.dnaLength / benchmark.originalSize).toFixed(2) : "1.00",
    memoryUsage: `${(memoryUsageBytes / 1024).toFixed(3)} KB`,
    timestamp: new Date().toISOString()
  };

  // Update stats on the algorithm
  const stats = alg.executionStatistics || {
    executionsCount: 0,
    successfulRuns: 0,
    failedRuns: 0,
    averageEncodingTime: 0,
    averageDecodingTime: 0,
    bestEncodingTime: Infinity,
    bestDecodingTime: Infinity,
    totalEncodingTime: 0,
    totalDecodingTime: 0
  };

  const nextCount = stats.executionsCount + 1;
  const nextSuccess = stats.successfulRuns + (isSuccess ? 1 : 0);
  const nextFailed = stats.failedRuns + (isSuccess ? 0 : 1);
  const totalEnc = (stats.totalEncodingTime || 0) + report.encodingTime;
  const totalDec = (stats.totalDecodingTime || 0) + report.decodingTime;

  alg.executionStatistics = {
    executionsCount: nextCount,
    successfulRuns: nextSuccess,
    failedRuns: nextFailed,
    totalEncodingTime: totalEnc,
    totalDecodingTime: totalDec,
    averageEncodingTime: totalEnc / nextCount,
    averageDecodingTime: totalDec / nextCount,
    bestEncodingTime: Math.min(stats.bestEncodingTime || Infinity, report.encodingTime),
    bestDecodingTime: Math.min(stats.bestDecodingTime || Infinity, report.decodingTime)
  };

  algs[idx] = alg;
  saveAllAlgorithms(algs);

  // Sync to Experiment Run list & Research Memory System
  saveExecutionToGlobalRuns(report);
  saveToResearchMemory(alg, report);

  return report;
}

/**
 * Saves execution details to the global localStorage runs log
 */
function saveExecutionToGlobalRuns(report) {
  try {
    const savedRuns = localStorage.getItem("apex_os_v3_dna_runs");
    let runs = savedRuns ? JSON.parse(savedRuns) : [];
    runs.unshift({
      executionId: report.executionId,
      algorithmName: report.algorithmName,
      success: report.validationResult === "PASS" && report.checksumResult === "PASS",
      time: parseFloat(report.encodingTime + report.decodingTime),
      timestamp: report.timestamp
    });
    localStorage.setItem("apex_os_v3_dna_runs", JSON.stringify(runs));
  } catch (e) {
    console.error("Error saving global runs:", e);
  }
}

/**
 * Saves algorithm specifications, benchmark, and execution report to Research Memory
 */
function saveToResearchMemory(alg, report = null, customMemo = "") {
  try {
    const cached = localStorage.getItem("apex_os_v4_research_memories");
    let memories = cached ? JSON.parse(cached) : [];

    const memId = `mem_alg_run_${Date.now()}`;
    const reportSummary = report
      ? `\n\nExecution Report:\n- ID: ${report.executionId}\n- Encoding Time: ${report.encodingTime.toFixed(3)}ms\n- Decoding Time: ${report.decodingTime.toFixed(3)}ms\n- DNA Sequence Length: ${report.dnaLength} bases\n- Validation Result: ${report.validationResult}\n- Checksum: ${report.checksumResult}\n- Similarity: ${report.similarity}\n- Compression Ratio: ${report.compressionRatio}`
      : "";

    memories.unshift({
      id: memId,
      title: `[Algorithm Core] ${alg.name} - telemetry session`,
      type: "AI Observation",
      content: `Algorithm: ${alg.name} (${alg.version})
Created by: ${alg.author}
Objective: ${alg.description}
DNA Strategy: ${alg.dnaMappingStrategy}
Rules: ${alg.encodingRules} / ${alg.decodingRules}
GC limits: ${alg.gcRules}% | Homopolymer Max: ${alg.homopolymerRules}
Compression: ${alg.compressionStrategy} | Reference formulas: ${(alg.formulas || []).join(", ") || "None"}
Memo: ${customMemo || "Dynamic automated compliance execution check pass."}${reportSummary}`,
      tags: [alg.category || "Custom DNA", "Benchmark", "Engine Execution"],
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      severity: report && report.validationResult === "FAIL" ? "High" : "Low"
    });

    localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
  } catch (err) {
    console.error("Error syncing to research memory:", err);
  }
}

/**
 * Multi-algorithm side-by-side comparison
 */
export function compareAlgorithms(ids) {
  const algs = getAllAlgorithms();
  const selected = algs.filter(a => ids.includes(a.id));
  if (selected.length === 0) return [];

  // Profile all of them with a dummy standard string to get exact dynamic performance
  const sampleText = "APEX OS Core Multi-Algorithm Cross-Validation and Profiling Sequence Benchmark";

  return selected.map(alg => {
    const run = executeAndBenchmarkAlgorithm(alg.id, sampleText);
    const totalTime = run.encodingTime + run.decodingTime;
    return {
      algorithmId: alg.id,
      name: alg.name,
      version: alg.version,
      encodingTime: run.encodingTime,
      decodingTime: run.decodingTime,
      totalTime,
      dnaLength: run.dnaLength,
      binaryLength: run.binaryLength,
      compressionRatio: parseFloat(run.compressionRatio),
      memoryUsage: parseFloat(run.memoryUsage) || 0.12,
      successRate: alg.executionStatistics ? (alg.executionStatistics.successfulRuns / Math.max(1, alg.executionStatistics.executionsCount)) * 100 : 100,
      validationResult: run.validationResult,
      checksumResult: run.checksumResult
    };
  });
}

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
    objective: params.objective || "General-purpose DNA encoding algorithm",
    createdDate: params.createdDate || params.creationDate || new Date().toISOString().split("T")[0],
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
        let modified = false;
        const processed = parsed.map(alg => {
          let updated = { ...alg };
          if (!updated.version || updated.version === "undefined") {
            if (updated.name && updated.name.includes("CRISPR")) {
              updated.version = "v2.0.0";
            } else {
              updated.version = "v1.0.0";
            }
            modified = true;
          }
          if (!updated.objective || updated.objective === "N/A" || updated.objective.trim() === "" || updated.objective === "Enter objective...") {
            updated.objective = updated.description && updated.description !== "Enter description..." ? updated.description : "General-purpose DNA encoding algorithm";
            modified = true;
          }
          return updated;
        });
        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(processed));
        }
        return processed;
      }
    }
  } catch (e) {
    console.error("Error loading algorithms:", e);
  }

  // Fallback to default templates if empty
  const defaults = [
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
      creationDate: "2026-07-01",
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
      creationDate: "2026-07-08",
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
      creationDate: "2026-07-15",
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  } catch(e) {
    console.error("Error saving fallback algorithms:", e);
  }
  return defaults;
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

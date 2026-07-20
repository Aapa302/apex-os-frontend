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

// Biometric Cryptography & WebAuthn Helpers
const sha256Hash = async (message) => {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
};

const stringToHex = (str) => {
  const bytes = new TextEncoder().encode(str);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
};

const hexToString = (hex) => {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
};

const xorHex = (hex, key) => {
  if (!key) return hex;
  const keyBytes = new TextEncoder().encode(key);
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    const keyByte = keyBytes[(i / 2) % keyBytes.length] || 0;
    const xorByte = byte ^ keyByte;
    result += xorByte.toString(16).padStart(2, "0");
  }
  return result;
};

// WebAuthn Biometric API Helpers
const registerBiometricCredential = async (onShowModal) => {
  if (navigator.credentials && navigator.credentials.create && window.isSecureContext && !navigator.webdriver) {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "APEX OS" },
          user: {
            id: new Uint8Array([1, 2, 3, 4]),
            name: "scientist@apex.os",
            displayName: "Apex Scientist"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          timeout: 10000,
          authenticatorSelection: { authenticatorAttachment: "platform" }
        }
      });
      if (credential) {
        return credential.id;
      }
    } catch (e) {
      console.warn("Physical WebAuthn registration failed, using simulation...", e);
    }
  }

  return new Promise((resolve, reject) => {
    onShowModal({
      title: "Register Biometric Credential",
      message: "Headless/Non-secure context detected. Please verify identity using the virtual fingerprint/face scanner.",
      onSuccess: () => {
        resolve("bio_cred_default_id");
      },
      onFailure: () => {
        reject(new Error("Biometric Registration Canceled"));
      }
    });
  });
};

const verifyBiometricCredential = async (expectedCredId, onShowModal) => {
  if (navigator.credentials && navigator.credentials.get && window.isSecureContext && !navigator.webdriver) {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 10000,
          allowCredentials: [{
            id: new TextEncoder().encode(expectedCredId),
            type: "public-key"
          }]
        }
      });
      if (credential) {
        return credential.id;
      }
    } catch (e) {
      console.warn("Physical WebAuthn verification failed, using simulation...", e);
    }
  }

  return new Promise((resolve, reject) => {
    onShowModal({
      title: "Verify Biometric Identity",
      message: "Please scan your fingerprint or scan face to unlock and decrypt the DNA payload.",
      onSuccess: (status) => {
        if (status === "success") {
          resolve(expectedCredId);
        } else {
          resolve("bio_cred_mismatched_id");
        }
      },
      onFailure: () => {
        reject(new Error("Access Denied - Biometric Mismatch"));
      }
    });
  });
};

const decryptBiometricPayload = async (decodedText, onShowModal) => {
  if (typeof decodedText === "string" && decodedText.startsWith("BIO:")) {
    const parts = decodedText.split(":");
    if (parts.length >= 3) {
      const credId = parts[1];
      const scrambledHex = parts[2];
      try {
        const verifiedId = await verifyBiometricCredential(credId, onShowModal);
        onShowModal(null); // Dismiss modal on success
        if (verifiedId === credId) {
          const derivedKey = await sha256Hash(verifiedId);
          const unscrambledHex = xorHex(scrambledHex, derivedKey);
          return hexToString(unscrambledHex);
        } else {
          throw new Error("Access Denied - Biometric Mismatch");
        }
      } catch (err) {
        onShowModal(null); // Dismiss modal on error
        throw new Error(err.message || "Access Denied - Biometric Mismatch");
      }
    }
  }
  return decodedText;
};

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

// Mismatch history helpers for Triplication Redundancy
const getMismatchHistory = () => {
  try {
    const data = localStorage.getItem("apex_os_checksum_mismatches");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const addMismatchToHistory = (blockNum) => {
  try {
    const history = getMismatchHistory();
    if (!history.includes(blockNum)) {
      history.push(blockNum);
      localStorage.setItem("apex_os_checksum_mismatches", JSON.stringify(history));
    }
  } catch (e) {}
};

const getMajorityBase = (triplet) => {
  if (!triplet) return 'A';
  const counts = { 'A': 0, 'T': 0, 'C': 0, 'G': 0 };
  for (let i = 0; i < triplet.length; i++) {
    const base = triplet[i].toUpperCase();
    if (counts[base] !== undefined) {
      counts[base]++;
    } else {
      counts[base] = 1;
    }
  }
  let maxBase = 'A';
  let maxCount = -1;
  for (const base of ['A', 'T', 'C', 'G']) {
    if ((counts[base] || 0) > maxCount) {
      maxCount = counts[base] || 0;
      maxBase = base;
    }
  }
  return maxBase;
};

export const calculateGcContent = (dna) => {
  if (!dna) return { percentage: 0, isIdeal: false };
  const clean = dna.toUpperCase().replace(/[^ATCG]/g, "");
  if (clean.length === 0) return { percentage: 0, isIdeal: false };
  const gcCount = (clean.match(/[GC]/g) || []).length;
  const pct = Math.round((gcCount / clean.length) * 100);
  return {
    percentage: pct,
    isIdeal: pct >= 40 && pct <= 60
  };
};

export const deNoiseDna = (dna) => {
  if (!dna) return "";
  let encoded = "";
  let consecCount = 0;
  let lastBase = "";

  for (let i = 0; i < dna.length; i++) {
    const base = dna[i];
    encoded += base;

    if (base === lastBase) {
      consecCount++;
    } else {
      consecCount = 1;
      lastBase = base;
    }

    if (consecCount === 3) {
      if (i + 1 < dna.length) {
        const nextBase = dna[i + 1];
        const escapeBase = valToBase((baseToVal(base) + 1) % 4);
        encoded += escapeBase;
        consecCount = 0;
        lastBase = "";
      }
    }
  }
  return encoded;
};

export const reNoiseDna = (encodedDna) => {
  if (!encodedDna) return "";
  let decoded = "";
  let consecCount = 0;
  let lastBase = "";

  for (let i = 0; i < encodedDna.length; i++) {
    const base = encodedDna[i];
    decoded += base;

    if (base === lastBase) {
      consecCount++;
    } else {
      consecCount = 1;
      lastBase = base;
    }

    if (consecCount === 3) {
      if (i + 1 < encodedDna.length) {
        i++;
        consecCount = 0;
        lastBase = "";
      }
    }
  }
  return decoded;
};

export const reNoiseDnaWithMapping = (encodedDna) => {
  if (!encodedDna) return { decoded: "", mapping: [] };
  let decoded = "";
  let mapping = []; // mapping[j] will store the index in encodedDna for decoded[j]
  let consecCount = 0;
  let lastBase = "";

  for (let i = 0; i < encodedDna.length; i++) {
    const base = encodedDna[i];
    decoded += base;
    mapping.push(i);

    if (base === lastBase) {
      consecCount++;
    } else {
      consecCount = 1;
      lastBase = base;
    }

    if (consecCount === 3) {
      if (i + 1 < encodedDna.length) {
        i++; // skip escape character
        consecCount = 0;
        lastBase = "";
      }
    }
  }
  return { decoded, mapping };
};

export const decodeSequenceAndVerifyChecksumsWithMapping = (dnaWithChecksums) => {
  if (!dnaWithChecksums) return { cleanDna: "", mapping: [], corruptions: [], autoCorrected: [] };
  const history = getMismatchHistory();
  const corruptions = [];
  const autoCorrected = [];
  let cleanDna = "";
  let mapping = []; // mapping[k] will store the index in dnaWithChecksums for cleanDna[k]

  let index = 0;
  let blockNum = 1;

  while (index < dnaWithChecksums.length) {
    const remainingLength = dnaWithChecksums.length - index;
    let isTriplicated = history.includes(blockNum);

    if (isTriplicated) {
      // Verify if the block is actually triplicated in the input sequence
      const testBlock = dnaWithChecksums.slice(index, Math.min(index + 300, dnaWithChecksums.length - 4));
      if (testBlock.length >= 3) {
        let matchingTriplets = 0;
        let totalTriplets = 0;
        for (let j = 0; j + 2 < testBlock.length; j += 3) {
          totalTriplets++;
          if (testBlock[j] === testBlock[j + 1] && testBlock[j + 1] === testBlock[j + 2]) {
            matchingTriplets++;
          }
        }
        if (totalTriplets > 0 && (matchingTriplets / totalTriplets) < 0.7) {
          isTriplicated = false;
        }
      } else {
        isTriplicated = false;
      }
    }

    let blockLen = isTriplicated ? 300 : 100;
    let chunkLen = blockLen + 4;

    if (remainingLength < chunkLen) {
      if (remainingLength <= 4) {
        // Trailing bases without parity
        const tr = dnaWithChecksums.slice(index);
        if (isTriplicated) {
          let resolved = "";
          for (let j = 0; j < tr.length; j += 3) {
            const triplet = tr.slice(j, j + 3);
            const resolvedBase = getMajorityBase(triplet);
            resolved += resolvedBase;
            mapping.push(index + j);
          }
          cleanDna += resolved;
        } else {
          for (let j = 0; j < tr.length; j++) {
            mapping.push(index + j);
          }
          cleanDna += tr;
        }
        break;
      }
      blockLen = remainingLength - 4;
      chunkLen = remainingLength;
    }

    const block = dnaWithChecksums.slice(index, index + blockLen);
    const expectedChecksum = dnaWithChecksums.slice(index + blockLen, index + chunkLen);
    const computedChecksum = compute4BaseChecksum(block);

    if (expectedChecksum !== computedChecksum) {
      if (isTriplicated) {
        // Run majority vote auto-correction
        let correctedBlock = "";
        const origSize = Math.floor(blockLen / 3);
        for (let j = 0; j < origSize; j++) {
          const triplet = block.slice(j * 3, j * 3 + 3);
          const resolvedBase = getMajorityBase(triplet);
          correctedBlock += resolvedBase;
          mapping.push(index + j * 3);
        }

        autoCorrected.push({
          blockNum,
          start: index,
          end: index + blockLen,
          originalContent: block,
          correctedContent: correctedBlock
        });

        cleanDna += correctedBlock;
      } else {
        // Do not add mismatch to history during read-only search operations!

        corruptions.push({
          blockNum,
          start: index,
          end: index + blockLen,
          expected: expectedChecksum,
          computed: computedChecksum,
          blockContent: block
        });

        for (let j = 0; j < block.length; j++) {
          mapping.push(index + j);
        }
        cleanDna += block;
      }
    } else {
      if (isTriplicated) {
        let untriplicated = "";
        const origSize = Math.floor(blockLen / 3);
        for (let j = 0; j < origSize; j++) {
          untriplicated += block[j * 3];
          mapping.push(index + j * 3);
        }
        cleanDna += untriplicated;
      } else {
        for (let j = 0; j < block.length; j++) {
          mapping.push(index + j);
        }
        cleanDna += block;
      }
    }

    index += chunkLen;
    blockNum++;
  }

  // Re-noise (reconstruct original homopolymers) with mapping
  const { decoded: fullyRestoredDna, mapping: restoredToCleanMap } = reNoiseDnaWithMapping(cleanDna);

  // Now compose both mappings to map index in fullyRestoredDna directly to index in dnaWithChecksums!
  const finalMapping = []; // finalMapping[j] maps fullyRestoredDna[j] to dnaWithChecksums index
  for (let j = 0; j < fullyRestoredDna.length; j++) {
    const cleanIdx = restoredToCleanMap[j];
    const originalIdx = mapping[cleanIdx];
    finalMapping.push(originalIdx);
  }

  return { cleanDna: fullyRestoredDna, mapping: finalMapping, corruptions, autoCorrected };
};

export const encodeSequenceWithChecksums = (dna) => {
  if (!dna) return "";
  const deNoised = deNoiseDna(dna);
  const history = getMismatchHistory();
  let output = "";
  let blockNum = 1;
  for (let i = 0; i < deNoised.length; i += 100) {
    const block = deNoised.slice(i, i + 100);
    const isTriplicated = history.includes(blockNum);

    if (isTriplicated) {
      let triplicated = "";
      for (let j = 0; j < block.length; j++) {
        triplicated += block[j] + block[j] + block[j];
      }
      const chk = compute4BaseChecksum(triplicated);
      output += triplicated + chk;
    } else {
      const chk = compute4BaseChecksum(block);
      output += block + chk;
    }
    blockNum++;
  }
  return output;
};

export const decodeSequenceAndVerifyChecksums = (dnaWithChecksums) => {
  if (!dnaWithChecksums) return { cleanDna: "", corruptions: [], autoCorrected: [] };
  console.log("[DEBUG-DECODE] raw input DNA length:", dnaWithChecksums.length);
  const history = getMismatchHistory();
  const corruptions = [];
  const autoCorrected = [];
  let cleanDna = "";

  let index = 0;
  let blockNum = 1;

  while (index < dnaWithChecksums.length) {
    const remainingLength = dnaWithChecksums.length - index;
    let isTriplicated = history.includes(blockNum);

    if (isTriplicated) {
      // Verify if the block is actually triplicated in the input sequence
      const testBlock = dnaWithChecksums.slice(index, Math.min(index + 300, dnaWithChecksums.length - 4));
      if (testBlock.length >= 3) {
        let matchingTriplets = 0;
        let totalTriplets = 0;
        for (let j = 0; j + 2 < testBlock.length; j += 3) {
          totalTriplets++;
          if (testBlock[j] === testBlock[j + 1] && testBlock[j + 1] === testBlock[j + 2]) {
            matchingTriplets++;
          }
        }
        if (totalTriplets > 0 && (matchingTriplets / totalTriplets) < 0.7) {
          isTriplicated = false;
        }
      } else {
        isTriplicated = false;
      }
    }

    let blockLen = isTriplicated ? 300 : 100;
    let chunkLen = blockLen + 4;

    if (remainingLength < chunkLen) {
      if (remainingLength <= 4) {
        // Trailing bases without parity
        const tr = dnaWithChecksums.slice(index);
        if (isTriplicated) {
          let resolved = "";
          for (let j = 0; j < tr.length; j += 3) {
            const triplet = tr.slice(j, j + 3);
            resolved += getMajorityBase(triplet);
          }
          cleanDna += resolved;
        } else {
          cleanDna += tr;
        }
        break;
      }
      blockLen = remainingLength - 4;
      chunkLen = remainingLength;
    }

    const block = dnaWithChecksums.slice(index, index + blockLen);
    const expectedChecksum = dnaWithChecksums.slice(index + blockLen, index + chunkLen);
    const computedChecksum = compute4BaseChecksum(block);

    if (expectedChecksum !== computedChecksum) {
      if (isTriplicated) {
        // Run majority vote auto-correction
        let correctedBlock = "";
        const origSize = Math.floor(blockLen / 3);
        for (let j = 0; j < origSize; j++) {
          const triplet = block.slice(j * 3, j * 3 + 3);
          correctedBlock += getMajorityBase(triplet);
        }

        autoCorrected.push({
          blockNum,
          start: index,
          end: index + blockLen,
          originalContent: block,
          correctedContent: correctedBlock
        });

        cleanDna += correctedBlock;
      } else {
        // Standard mismatch - add to mismatch history for future runs!
        addMismatchToHistory(blockNum);

        corruptions.push({
          blockNum,
          start: index,
          end: index + blockLen,
          expected: expectedChecksum,
          computed: computedChecksum,
          blockContent: block
        });

        cleanDna += block;
      }
    } else {
      if (isTriplicated) {
        let untriplicated = "";
        const origSize = Math.floor(blockLen / 3);
        for (let j = 0; j < origSize; j++) {
          untriplicated += block[j * 3];
        }
        cleanDna += untriplicated;
      } else {
        cleanDna += block;
      }
    }

    index += chunkLen;
    blockNum++;
  }

  // Re-noise (reconstruct original homopolymers)
  console.log("[DEBUG-DECODE] checksum-stripped length:", cleanDna.length);
  const fullyRestoredDna = reNoiseDna(cleanDna);
  console.log("[DEBUG-DECODE] homopolymer-reversed length:", fullyRestoredDna.length);

  return { cleanDna: fullyRestoredDna, corruptions, autoCorrected };
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
  const [autoCorrectedBlocks, setAutoCorrectedBlocks] = useState([]);

  // File to DNA States
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDnaResult, setFileDnaResult] = useState("");
  const [fileMetadata, setFileMetadata] = useState(null);
  const [copied, setCopied] = useState(false);
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodeError, setDecodeError] = useState(null);
  const [generatedIndex, setGeneratedIndex] = useState(null);
  const [uploadedIndex, setUploadedIndex] = useState(null);

  // Synthesizer States
  const [seqName, setSeqName] = useState("");
  const [fastaLoading, setFastaLoading] = useState(false);
  const [fastaError, setFastaError] = useState(null);
  const [fastaResult, setFastaResult] = useState("");

  // DNA-Native Search States
  const [nativeSearchQuery, setNativeSearchQuery] = useState("");
  const [nativeSearchResults, setNativeSearchResults] = useState([]);
  const [nativeSearchExecuted, setNativeSearchExecuted] = useState(false);
  const [nativeSearchError, setNativeSearchError] = useState("");

  // Search DNA tab states
  const [searchDnaQuery, setSearchDnaQuery] = useState("");
  const [searchDnaTarget, setSearchDnaTarget] = useState("");
  const [searchDnaResults, setSearchDnaResults] = useState([]);
  const [searchDnaExecuted, setSearchDnaExecuted] = useState(false);
  const [searchDnaError, setSearchDnaError] = useState("");

  // Biometric Encryption States
  const [biometricActive, setBiometricActive] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [biometricCredentialId, setBiometricCredentialId] = useState("");
  const [biometricKey, setBiometricKey] = useState("");
  const [biometricError, setBiometricError] = useState("");
  const [biometricModal, setBiometricModal] = useState(null); // { title, message, onSuccess(status), onFailure }

  // Health Check States
  const [healthLogs, setHealthLogs] = useState([]);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState(null);

  useEffect(() => {
    if (fileDnaResult) {
      setSearchDnaTarget(fileDnaResult);
    } else if (encoderResult && encoderMode === "encode") {
      setSearchDnaTarget(encoderResult);
    }
  }, [fileDnaResult, encoderResult, encoderMode]);

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

  const fetchHealthLogs = async () => {
    setHealthError(null);
    try {
      const res = await fetch(`${PROXY_URL}/dna-health-check/logs`);
      if (!res.ok) {
        throw new Error(`Failed to fetch health logs: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      let logsArray = [];
      if (Array.isArray(data)) {
        logsArray = data;
      } else if (data && data.success && Array.isArray(data.logs)) {
        logsArray = data.logs;
      } else {
        throw new Error("Invalid log list format");
      }
      const sorted = [...logsArray].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setHealthLogs(sorted);
    } catch (err) {
      console.error("Failed to fetch health logs from backend:", err);
      setHealthError("Health check failed, try again");
    }
  };

  const initializeMockLogs = () => {
    const mock = [
      {
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        blocksScanned: 24,
        blocksFixed: 1,
        status: "All mutations repaired successfully",
        source: "Local Engine Fallback"
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        blocksScanned: 24,
        blocksFixed: 0,
        status: "Archive healthy. No mutations detected.",
        source: "Local Engine Fallback"
      }
    ];
    setHealthLogs(mock);
    localStorage.setItem("apex_os_v4_health_check_logs", JSON.stringify(mock));
  };

  const runHealthCheck = async (isBackground = false) => {
    if (!isBackground) {
      setHealthLoading(true);
      setHealthError(null);
    }
    try {
      const res = await fetch(`${PROXY_URL}/dna-health-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        throw new Error(`Health check run failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();

      setHealthLogs(prev => [data, ...prev]);
    } catch (err) {
      console.error("Failed to execute health check:", err);
      if (!isBackground) {
        setHealthError("Health check failed, try again");
      }
    } finally {
      if (!isBackground) {
        setHealthLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchHealthLogs();
    const interval = setInterval(() => {
      console.log("Triggering scheduled 24-hour background archive health check...");
      runHealthCheck(true);
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

    let textToEncode = inputText;
    if (biometricActive && biometricKey) {
      const payloadHex = stringToHex(inputText);
      const scrambled = xorHex(payloadHex, biometricKey);
      textToEncode = `BIO:${biometricCredentialId}:${scrambled}`;
    }

    try {
      const res = await fetch(`${PROXY_URL}/dna-encode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToEncode })
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
      console.warn("Backend encoding failed. Switching to local offline fallback...", err);
      try {
        const localResult = Encode(textToEncode);
        if (localResult && localResult.dnaSequence) {
          // Slice off the first 16 bases (the 32-bit CRC checksum) to match backend's raw output
          const rawDna = localResult.dnaSequence.slice(16);
          const dnaWithChecksums = encodeSequenceWithChecksums(rawDna);
          setEncoderResult(dnaWithChecksums);
        } else {
          throw new Error("Local offline encoder returned empty sequence.");
        }
      } catch (localErr) {
        console.error("Local encoding fallback failed:", localErr);
        setEncoderError(err.message || "Failed to communicate with DNA Encoder backend");
      }
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
    setAutoCorrectedBlocks([]);

    const { cleanDna, corruptions, autoCorrected } = decodeSequenceAndVerifyChecksums(inputDna.trim().toUpperCase());
    if (corruptions.length > 0) {
      setChecksumCorruptions(corruptions);
    }
    if (autoCorrected.length > 0) {
      setAutoCorrectedBlocks(autoCorrected);
    }

    let apiSuccess = false;
    let decodedText = null;

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
        apiSuccess = true;
        decodedText = data.text;
      } else {
        throw new Error(data.error || "Unknown error during decoding");
      }
    } catch (err) {
      console.warn("Backend decoding failed. Switching to local offline fallback...", err);
      try {
        // Prepend 16 dummy 'A' bases so the offline Decode parses them as checksum and correctly decodes payload
        const complDna = "A".repeat(16) + cleanDna;
        const localResult = Decode(complDna);
        if (localResult && localResult.decodedText) {
          apiSuccess = true;
          decodedText = localResult.decodedText;
        } else {
          throw new Error("Local offline decoder returned empty text.");
        }
      } catch (localErr) {
        console.error("Local decoding fallback failed:", localErr);
        setEncoderError(localErr.message || err.message || "Failed to communicate with DNA Decoder backend");
      }
    }

    if (apiSuccess && decodedText !== null) {
      try {
        const finalPayload = await decryptBiometricPayload(decodedText, setBiometricModal);
        console.log("[DEBUG-DECODE] final decoded string:", finalPayload);
        setEncoderResult(finalPayload);
      } catch (bioErr) {
        setEncoderError(bioErr.message);
      }
    }

    setEncoderLoading(false);
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
    setGeneratedIndex(null);

    if (biometricActive && biometricKey) {
      console.log("Biometric security active, encoding locally to encrypt correctly...");
      runLocalFileEncode();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${PROXY_URL}/dna-encode-file`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const status = res.status;
        const errText = await res.text();
        let errMsg = `Backend error ${status}: ${res.statusText || "Encoding failed"}`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error) errMsg = parsed.error;
        } catch (e) {}

        if (status === 404 || status === 405 || status >= 500) {
          console.warn("Backend route not found or server error. Switching to local offline encoding...");
          runLocalFileEncode();
          return;
        } else {
          throw new Error(errMsg);
        }
      }

      const data = await res.json();
      if (data.success) {
        const rawDna = data.dna;
        const dnaWithChecksums = encodeSequenceWithChecksums(rawDna);

        // Partition and create custom chunk mapping for indexing
        const indexRecords = [];
        const chunkSize = 500;
        let dnaOffset = 0;
        let chunkId = 1;

        for (let i = 0; i < dnaWithChecksums.length; i += chunkSize) {
          const chunkText = dnaWithChecksums.slice(i, i + chunkSize);
          indexRecords.push({
            chunk_id: chunkId,
            byte_start: i,
            byte_end: Math.min(i + chunkSize, dnaWithChecksums.length),
            DNA_position: {
              start: dnaOffset,
              end: dnaOffset + chunkText.length
            }
          });
          dnaOffset += chunkText.length;
          chunkId++;
        }

        setFileDnaResult(dnaWithChecksums);
        setGeneratedIndex(indexRecords);
        setFileMetadata({
          name: selectedFile.name,
          size: selectedFile.size,
          length: dnaWithChecksums.length,
          source: "Backend Server"
        });
        setEncoderLoading(false);
      } else {
        throw new Error(data.error || "Unknown error during file encoding");
      }
    } catch (err) {
      console.error("API error during file encoding:", err);
      if (err instanceof TypeError || err.message.includes("failed to fetch") || err.message.includes("404") || err.message.includes("405")) {
        console.warn("Network error or unavailable route. Switching to local offline encoding...");
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
        let dataUrl = evt.target.result;
        let isBiometricEncrypted = false;

        if (biometricActive && biometricKey) {
          const payloadHex = stringToHex(dataUrl);
          const scrambled = xorHex(payloadHex, biometricKey);
          dataUrl = `BIO:${biometricCredentialId}:${scrambled}`;
          isBiometricEncrypted = true;
        }

        // Split base64 data into 500-char chunks for robust, indexed bio-assembly
        const chunkSize = 500;
        let compiledDna = "";
        const indexRecords = [];
        let dnaOffset = 0;
        let chunkId = 1;

        for (let i = 0; i < dataUrl.length; i += chunkSize) {
          const chunkText = dataUrl.slice(i, i + chunkSize);
          const byteStart = i;
          const byteEnd = Math.min(i + chunkSize, dataUrl.length);

          // Encode chunk text to raw DNA
          const encRes = Encode(chunkText);
          const rawDna = encRes.dnaSequence;

          // Apply XOR parity checksums on this raw chunk DNA block
          const chunkDnaWithParity = encodeSequenceWithChecksums(rawDna);

          compiledDna += chunkDnaWithParity;

          indexRecords.push({
            chunk_id: chunkId,
            byte_start: byteStart,
            byte_end: byteEnd,
            DNA_position: {
              start: dnaOffset,
              end: dnaOffset + chunkDnaWithParity.length
            }
          });

          dnaOffset += chunkDnaWithParity.length;
          chunkId++;
        }

        setFileDnaResult(compiledDna);
        setGeneratedIndex(indexRecords);
        setFileMetadata({
          name: selectedFile.name,
          size: selectedFile.size,
          length: compiledDna.length,
          source: isBiometricEncrypted ? "Local Engine (Biometric XOR Encrypted)" : "Local Engine with Indexing"
        });
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
    setAutoCorrectedBlocks([]);

    const { cleanDna, corruptions, autoCorrected } = decodeSequenceAndVerifyChecksums(fileDnaResult.trim().toUpperCase());
    if (corruptions.length > 0) {
      setChecksumCorruptions(corruptions);
    }
    if (autoCorrected.length > 0) {
      setAutoCorrectedBlocks(autoCorrected);
    }

    if (uploadedIndex || (biometricActive && biometricKey) || fileMetadata?.source?.includes("Biometric")) {
      console.warn("Index file or Biometric Encryption is active. Running local decoder...");
      runLocalFileDecode(cleanDna);
      return;
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

  const runLocalFileDecode = async (cleanDna) => {
    try {
      let dataUrl = "";

      if (uploadedIndex) {
        console.log("Running index-assisted decoding...");
        const chunkTexts = [];
        const allCorruptions = [];
        const allCorrected = [];

        for (const chunk of uploadedIndex) {
          const { start, end } = chunk.DNA_position;
          const chunkDnaWithParity = fileDnaResult.slice(start, end);

          // Verify and strip checksums for this specific chunk
          const { cleanDna: cleanChunkDna, corruptions, autoCorrected } = decodeSequenceAndVerifyChecksums(chunkDnaWithParity);
          if (corruptions.length > 0) {
            corruptions.forEach(c => {
              allCorruptions.push({
                ...c,
                blockNum: `Chunk ${chunk.chunk_id} - ${c.blockNum}`
              });
            });
          }
          if (autoCorrected.length > 0) {
            autoCorrected.forEach(ac => {
              allCorrected.push({
                ...ac,
                blockNum: `Chunk ${chunk.chunk_id} - ${ac.blockNum}`
              });
            });
          }

          const decRes = Decode(cleanChunkDna);
          if (decRes && decRes.decodedText) {
            chunkTexts.push(decRes.decodedText);
          } else {
            throw new Error(`Failed to decode indexed DNA chunk ID: ${chunk.chunk_id}`);
          }
        }

        if (allCorruptions.length > 0) {
          setChecksumCorruptions(allCorruptions);
        }
        if (allCorrected.length > 0) {
          setAutoCorrectedBlocks(allCorrected);
        }

        dataUrl = chunkTexts.join("");
      } else {
        // Standard non-indexed local decoding
        const result = Decode(cleanDna);
        if (result && result.decodedText) {
          dataUrl = result.decodedText;
        } else {
          throw new Error("Local decoding engine returned empty payload.");
        }
      }

      if (dataUrl) {
        const finalDataUrl = await decryptBiometricPayload(dataUrl, setBiometricModal);
        if (!finalDataUrl.startsWith("data:")) {
          throw new Error("Decoded content is not a valid Data URL structure.");
        }

        const arr = finalDataUrl.split(",");
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
        throw new Error("Failed to reconstruct text stream.");
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

  const handleNativeSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setNativeSearchError("");
    setNativeSearchResults([]);
    setNativeSearchExecuted(true);

    if (!nativeSearchQuery.trim()) {
      setNativeSearchError("Please enter a text query to search!");
      return;
    }

    if (!fileDnaResult) {
      setNativeSearchError("No active DNA stream found. Please encode a file first.");
      return;
    }

    const indexData = uploadedIndex || generatedIndex;

    try {
      // Convert query text to UTF-8 binary
      const textToBin = (text) => {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += bytes[i].toString(2).padStart(8, "0");
        }
        return binary;
      };

      const binary = textToBin(nativeSearchQuery.trim());

      // Map binary to DNA bases (00=A, 01=C, 10=G, 11=T) - simpler, standard 2-bit mapping
      let queryDna = "";
      for (let i = 0; i < binary.length; i += 2) {
        const bits = binary.slice(i, i + 2).padEnd(2, "0");
        if (bits === "00") queryDna += "A";
        else if (bits === "01") queryDna += "C";
        else if (bits === "10") queryDna += "G";
        else if (bits === "11") queryDna += "T";
      }

      const pattern = queryDna.toUpperCase();
      const targetDna = fileDnaResult.toUpperCase();

      // Decode and restore the target DNA to raw DNA along with mapping index tracking
      const { cleanDna: restoredTargetDna, mapping: finalMapping } = decodeSequenceAndVerifyChecksumsWithMapping(targetDna);

      // Console debug logging as requested by the prompt
      console.log("[DEBUG] DNA-Native Search Debugging:");
      console.log("[DEBUG] Query text:", nativeSearchQuery.trim());
      console.log("[DEBUG] Generated DNA pattern for query (simple 2-bit mapping):", pattern);
      console.log("[DEBUG] First 200 bases of raw target DNA (with parity/denoise):", targetDna.slice(0, 200));
      console.log("[DEBUG] First 200 bases of restored target DNA (standard 2-bit, checksums-stripped):", restoredTargetDna.slice(0, 200));

      const oldDenoisedQuery = deNoiseDna(pattern);
      const isMatchInRawTarget = targetDna.indexOf(oldDenoisedQuery) !== -1;
      console.log("[DEBUG] Old search query (de-noised independently):", oldDenoisedQuery);
      console.log("[DEBUG] Was old query found directly in raw target DNA?", isMatchInRawTarget ? "Yes" : "No (Failed because homopolymer de-noising is context-dependent, and raw target contains block checksums/triplication)");

      const allMatches = [];

      let pos = restoredTargetDna.indexOf(pattern);
      while (pos !== -1) {
        const matchLength = pattern.length;

        // Map restored start and end indices back to original targetDna coordinates
        const origStart = finalMapping[pos];
        const origEnd = finalMapping[pos + matchLength - 1] + 1;
        const matchedDna = targetDna.slice(origStart, origEnd);

        let matchingChunks = [];
        if (indexData) {
          matchingChunks = indexData.filter(chunk => {
            const chunkStart = chunk.DNA_position.start;
            const chunkEnd = chunk.DNA_position.end;
            return (origStart < chunkEnd && origEnd > chunkStart);
          });
        }

        const alreadyFound = allMatches.some(m => m.index === origStart);
        if (!alreadyFound) {
          allMatches.push({
            index: origStart,
            matchedDna: matchedDna,
            type: "Direct Search",
            chunks: matchingChunks
          });
        }

        pos = restoredTargetDna.indexOf(pattern, pos + 1);
      }

      setNativeSearchResults(allMatches);
    } catch (err) {
      console.error("Native search error:", err);
      setNativeSearchError("Search error: " + (err.message || "Unknown error occurred"));
    }
  };

  const handleSearchDna = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSearchDnaError("");
    setSearchDnaResults([]);
    setSearchDnaExecuted(true);

    if (!searchDnaQuery.trim()) {
      setSearchDnaError("Please enter a text query to search!");
      return;
    }

    if (!searchDnaTarget.trim()) {
      setSearchDnaError("Please provide a target DNA sequence to search in!");
      return;
    }

    try {
      // Convert query text to DNA sequence using the same Encode function used during encoding
      const enc = Encode(searchDnaQuery.trim());
      // The Encode function prepends a 32-bit checksum.
      // In 2-bit mapping (which is standard), 32 bits translates to exactly the first 16 bases.
      // Slicing them off leaves the exact DNA mapped pattern of the text query.
      const queryDna = enc.dnaSequence.slice(16);

      if (!queryDna) {
        setSearchDnaError("Could not convert query text to a valid DNA sequence.");
        return;
      }

      const targetStr = searchDnaTarget.trim().toUpperCase();

      // Decode and restore the target DNA to raw DNA along with mapping index tracking
      const { cleanDna: restoredTargetDna, mapping: finalMapping } = decodeSequenceAndVerifyChecksumsWithMapping(targetStr);

      const pattern = queryDna.toUpperCase();

      // Console debug logging:
      console.log("[DEBUG] Search DNA Tab Debugging:");
      console.log("[DEBUG] Query text:", searchDnaQuery.trim());
      console.log("[DEBUG] Generated DNA pattern for query (simple 2-bit mapping):", pattern);
      console.log("[DEBUG] First 200 bases of raw target DNA:", targetStr.slice(0, 200));
      console.log("[DEBUG] First 200 bases of restored target DNA:", restoredTargetDna.slice(0, 200));

      const oldDenoisedQuery = deNoiseDna(pattern);
      const isMatchInRawTarget = targetStr.indexOf(oldDenoisedQuery) !== -1;
      console.log("[DEBUG] Old search query (de-noised independently):", oldDenoisedQuery);
      console.log("[DEBUG] Was old query found directly in raw target DNA?", isMatchInRawTarget ? "Yes" : "No (Failed because homopolymer de-noising is context-dependent, and raw target contains block checksums/triplication)");

      const matches = [];
      const indexData = uploadedIndex || generatedIndex;

      let pos = restoredTargetDna.indexOf(pattern);
      while (pos !== -1) {
        const matchLength = pattern.length;
        const origStart = finalMapping[pos];
        const origEnd = finalMapping[pos + matchLength - 1] + 1;
        const matchedDna = targetStr.slice(origStart, origEnd);

        // Find chunk_id and byte range if indexData is available
        let overlappingChunks = [];
        if (indexData && Array.isArray(indexData)) {
          overlappingChunks = indexData.filter(chunk => {
            if (chunk && chunk.DNA_position) {
              const chunkStart = chunk.DNA_position.start;
              const chunkEnd = chunk.DNA_position.end;
              return (origStart < chunkEnd && origEnd > chunkStart);
            }
            return false;
          });
        }

        // Avoid duplicate positions
        const alreadyFound = matches.some(m => m.index === origStart);
        if (!alreadyFound) {
          matches.push({
            index: origStart,
            matchedDna: matchedDna,
            type: "Direct Search",
            chunks: overlappingChunks
          });
        }

        pos = restoredTargetDna.indexOf(pattern, pos + 1);
      }

      setSearchDnaResults(matches);
    } catch (err) {
      console.error("Search error:", err);
      setSearchDnaError("Search error: " + (err.message || "Unknown error occurred"));
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

  const triggerBiometricRegistration = async () => {
    setBiometricError("");
    try {
      const credId = await registerBiometricCredential((modalData) => {
        setBiometricModal({
          ...modalData,
          onSuccess: async () => {
            setBiometricModal(null);
            const generatedKey = await sha256Hash("bio_cred_default_id");
            setBiometricCredentialId("bio_cred_default_id");
            setBiometricKey(generatedKey);
            setBiometricRegistered(true);
            setBiometricActive(true);
          },
          onFailure: () => {
            setBiometricModal(null);
            setBiometricError("Biometric Registration Canceled");
          }
        });
      });

      if (credId) {
        const generatedKey = await sha256Hash(credId);
        setBiometricCredentialId(credId);
        setBiometricKey(generatedKey);
        setBiometricRegistered(true);
        setBiometricActive(true);
      }
    } catch (err) {
      setBiometricError(err.message || "Failed to register biometrics");
    }
  };

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
              <button
                onClick={() => { setEncoderMode("searchDna"); setEncoderResult(""); setEncoderError(null); }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  background: encoderMode === "searchDna" ? T.accent : "transparent",
                  color: encoderMode === "searchDna" ? "#ffffff" : T.text2,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                Search DNA
              </button>
            </div>

            {/* Biometric Security Control Card */}
            <div style={{
              background: T.surf2,
              border: `1px solid ${biometricActive ? T.green : T.border2}`,
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.1rem" }}>🔒</span>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: biometricActive ? T.green : T.text1 }}>
                    Biometric Encryption Security
                  </span>
                </div>
                {biometricRegistered ? (
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={biometricActive}
                      onChange={(e) => setBiometricActive(e.target.checked)}
                      style={{ accentColor: T.green }}
                    />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: biometricActive ? T.green : T.text2 }}>
                      {biometricActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={triggerBiometricRegistration}
                    style={{
                      background: T.accent,
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    🔐 Register Biometrics
                  </button>
                )}
              </div>
              <p style={{ margin: 0, fontSize: "0.74rem", color: T.text2, lineHeight: 1.3 }}>
                {biometricRegistered
                  ? `Biometric credential linked: ${biometricCredentialId}. Payloads will be XOR-scrambled with a 256-bit hashed key.`
                  : "Secure your DNA payloads with physical biometric credentials (WebAuthn). Headless testing fallbacks supported."
                }
              </p>
              {biometricError && (
                <div style={{ fontSize: "0.74rem", color: T.red, fontWeight: 700 }}>
                  ⚠️ {biometricError}
                </div>
              )}
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

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

                      {generatedIndex && (
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(generatedIndex, null, 2)], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "index.json";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                          style={{
                            background: T.accent2,
                            color: "white",
                            border: "none",
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
                          📥 Download Index File (index.json)
                        </button>
                      )}
                    </div>

                    {fileMetadata && (() => {
                      const gc = calculateGcContent(fileDnaResult);
                      return (
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
                          <div style={{ fontSize: "0.76rem", color: T.text2, display: "flex", alignItems: "center", gap: "6px" }}>
                            <strong>GC-Content:</strong>
                            <span style={{ color: gc.isIdeal ? T.green : T.yellow, fontWeight: 800 }}>{gc.percentage}%</span>
                            <span style={{
                              fontSize: "0.62rem",
                              padding: "1px 6px",
                              borderRadius: "8px",
                              background: gc.isIdeal ? `${T.green}15` : `${T.yellow}15`,
                              color: gc.isIdeal ? T.green : T.yellow,
                              fontWeight: 700,
                              textTransform: "uppercase"
                            }}>
                              {gc.isIdeal ? "Ideal (40-60%)" : "Sub-optimal"}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: T.text3, fontStyle: "italic", marginTop: "2px" }}>
                            Source: {fileMetadata.source}
                          </div>
                        </div>
                      );
                    })()}

                    {/* DNA-Native Search Panel */}
                    <div style={{
                      marginTop: "16px",
                      padding: "14px",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "1.1rem" }}>🔎</span>
                        <span style={{ fontWeight: 800, fontSize: "0.85rem", color: T.cyan }}>
                          DNA-Native Search Engine
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: T.text2 }}>
                        Search for exact text patterns directly within the raw encoded DNA stream without decoding the full sequence.
                      </p>

                      <form onSubmit={handleNativeSearch} style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={nativeSearchQuery}
                          onChange={e => setNativeSearchQuery(e.target.value)}
                          placeholder="Enter text query (e.g. metadata pattern)..."
                          style={{
                            flex: 1,
                            background: T.surf,
                            border: `1px solid ${T.border2}`,
                            borderRadius: "6px",
                            padding: "6px 12px",
                            color: T.text1,
                            fontSize: "0.8rem",
                            outline: "none"
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: T.accent,
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          Search DNA
                        </button>
                      </form>

                      {nativeSearchExecuted && (
                        <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {nativeSearchError ? (
                            <div style={{ color: T.red, fontSize: "0.78rem" }}>
                              ⚠️ {nativeSearchError}
                            </div>
                          ) : nativeSearchResults.length === 0 ? (
                            <div style={{ color: T.yellow, fontSize: "0.78rem", fontStyle: "italic" }}>
                              No direct DNA matches found for pattern in stream.
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div style={{ fontSize: "0.76rem", color: T.green, fontWeight: 700 }}>
                                ✅ Found {nativeSearchResults.length} match(es) in DNA stream!
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
                                {nativeSearchResults.map((match, mIdx) => (
                                  <div key={mIdx} style={{
                                    background: T.surf,
                                    border: `1px solid ${T.border}`,
                                    borderRadius: "6px",
                                    padding: "8px",
                                    fontSize: "0.76rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "4px"
                                  }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                                      <span style={{ color: T.accent }}>Match #{mIdx + 1} ({match.type})</span>
                                      <span style={{ color: T.text3 }}>DNA Index: {match.index}</span>
                                    </div>
                                    <div style={{ fontFamily: "monospace", fontSize: "0.72rem", wordBreak: "break-all", background: T.surf2, padding: "4px", borderRadius: "4px" }}>
                                      Matched DNA: {match.matchedDna}
                                    </div>
                                    {match.chunks && match.chunks.length > 0 ? (
                                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                                        {match.chunks.map(chk => (
                                          <div key={chk.chunk_id} style={{ fontSize: "0.72rem", color: T.text2 }}>
                                            📍 <strong>Chunk ID:</strong> {chk.chunk_id} | <strong>File Byte Range:</strong> {chk.byte_start} - {chk.byte_end} bytes
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div style={{ fontSize: "0.7rem", color: T.text3, fontStyle: "italic" }}>
                                        No overlapping index mapping found. (Ensure index.json is uploaded)
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: `1px solid ${T.border2}`, paddingTop: "12px", marginTop: "4px" }}>
                      {/* Optional Index File Uploader for Index-Assisted Decoding */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
                        <label style={{ display: "block", color: T.text2, fontSize: "0.72rem", fontWeight: 700 }}>
                          Upload Index File (optional .json for fast direct position-based decoding)
                        </label>
                        <input
                          type="file"
                          accept=".json"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                try {
                                  const parsed = JSON.parse(evt.target.result);
                                  if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].DNA_position) {
                                    setUploadedIndex(parsed);
                                    alert("Index file uploaded successfully! Ready for index-assisted decoding.");
                                  } else {
                                    throw new Error("Invalid index format. Must be an array of chunk records.");
                                  }
                                } catch (err) {
                                  alert("Failed to parse index file: " + err.message);
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                          style={{
                            width: "100%",
                            background: T.surf2,
                            border: `1px solid ${T.border2}`,
                            borderRadius: "6px",
                            padding: "6px 10px",
                            color: T.text2,
                            fontSize: "0.76rem",
                            outline: "none"
                          }}
                        />
                        {uploadedIndex && (
                          <span style={{ fontSize: "0.72rem", color: T.green, fontWeight: 700 }}>
                            ⚡ Index Assisted Engine Loaded: {uploadedIndex.length} chunks mapped.
                          </span>
                        )}
                      </div>

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

            {encoderMode === "searchDna" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: T.text2, fontSize: "0.75rem", fontWeight: 700, marginBottom: "5px" }}>
                    Target DNA Sequence
                  </label>
                  <textarea
                    rows={4}
                    value={searchDnaTarget}
                    onChange={e => setSearchDnaTarget(e.target.value)}
                    placeholder="Paste or enter raw DNA sequence stream to search in..."
                    style={{
                      width: "100%",
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: T.text1,
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                      outline: "none",
                      resize: "none",
                      textTransform: "uppercase"
                    }}
                  />
                  {/* Quick helper buttons to fill in sequence */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    {fileDnaResult && (
                      <button
                        type="button"
                        onClick={() => setSearchDnaTarget(fileDnaResult)}
                        style={{
                          background: T.surf2,
                          color: T.cyan,
                          border: `1px solid ${T.border}`,
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "0.7rem",
                          cursor: "pointer"
                        }}
                      >
                        📋 Load File DNA Result
                      </button>
                    )}
                    {encoderResult && (
                      <button
                        type="button"
                        onClick={() => setSearchDnaTarget(encoderResult)}
                        style={{
                          background: T.surf2,
                          color: T.green,
                          border: `1px solid ${T.border}`,
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "0.7rem",
                          cursor: "pointer"
                        }}
                      >
                        📋 Load Encoded Result
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: T.text2, fontSize: "0.75rem", fontWeight: 700, marginBottom: "5px" }}>
                    Text Query to Search
                  </label>
                  <input
                    type="text"
                    value={searchDnaQuery}
                    onChange={e => setSearchDnaQuery(e.target.value)}
                    placeholder="Enter plain text query (e.g., metadata or word)"
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
                  type="button"
                  onClick={handleSearchDna}
                  style={{
                    padding: "10px 18px",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer"
                  }}
                >
                  Search DNA Stream ➔
                </button>

                {searchDnaExecuted && (
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {searchDnaError ? (
                      <div style={{ padding: "10px 14px", background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: "8px", color: T.red, fontSize: "0.8rem" }}>
                        ⚠️ <strong>Search Error:</strong> {searchDnaError}
                      </div>
                    ) : searchDnaResults.length === 0 ? (
                      <div style={{ padding: "10px 14px", background: `${T.yellow}12`, border: `1px solid ${T.yellow}30`, borderRadius: "8px", color: T.yellow, fontSize: "0.8rem", fontWeight: 700 }}>
                        No match found in DNA sequence
                      </div>
                    ) : (
                      <div style={{ padding: "14px", background: `${T.green}10`, border: `1px solid ${T.green}30`, borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ fontSize: "0.8rem", color: T.green, fontWeight: 800, textTransform: "uppercase" }}>
                          ✅ Found {searchDnaResults.length} match(es) in DNA sequence!
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
                          {searchDnaResults.map((match, idx) => (
                            <div key={idx} style={{
                              background: T.surf2,
                              border: `1px solid ${T.border2}`,
                              borderRadius: "6px",
                              padding: "10px",
                              fontSize: "0.78rem"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: "4px" }}>
                                <span style={{ color: T.cyan }}>Match #{idx + 1}</span>
                                <span style={{ color: T.text3 }}>DNA Index Start: {match.index}</span>
                              </div>
                              <div style={{ fontFamily: "monospace", fontSize: "0.74rem", wordBreak: "break-all", background: T.surf, padding: "6px", borderRadius: "4px", color: T.text2, marginBottom: "6px" }}>
                                Query DNA Pattern: {match.matchedDna}
                              </div>
                              {match.chunks && match.chunks.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", borderTop: `1px solid ${T.border}`, paddingTop: "6px" }}>
                                  {match.chunks.map(chunk => (
                                    <div key={chunk.chunk_id} style={{ fontSize: "0.74rem", color: T.text2 }}>
                                      📍 <strong>Chunk ID:</strong> {chunk.chunk_id} | <strong>Byte Range:</strong> {chunk.byte_start} - {chunk.byte_end} bytes
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: "0.72rem", color: T.text3, fontStyle: "italic" }}>
                                  No index mapping available for byte range/chunk ID.
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Auto-Corrected Triplication Redundancy Success Board */}
            {autoCorrectedBlocks.length > 0 && (
              <div style={{
                marginTop: "16px",
                padding: "14px",
                background: `${T.green}15`,
                border: `1px solid ${T.green}`,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.green, fontWeight: 800, fontSize: "0.85rem" }}>
                  <span>🛡️ Error Correction Restored</span>
                  <span style={{ fontSize: "0.7rem", background: T.green, color: "#fff", padding: "1px 6px", borderRadius: "10px", textTransform: "uppercase" }}>
                    Secured
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {autoCorrectedBlocks.map((ac) => (
                    <div key={ac.blockNum} style={{
                      background: T.surf2,
                      border: `1px solid ${T.green}30`,
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "0.76rem"
                    }}>
                      <span style={{ fontWeight: 800, color: T.green }}>Auto-corrected block #{ac.blockNum}</span>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.74rem", color: T.text2 }}>
                        Reconstructed original sequence using 3x majority-vote lookup.
                      </p>
                    </div>
                  ))}
                </div>
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

                {encoderMode === "encode" && (() => {
                  const gc = calculateGcContent(encoderResult);
                  return (
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.76rem", color: T.text2 }}>GC-Content:</span>
                      <strong style={{ fontSize: "0.78rem", color: gc.isIdeal ? T.green : T.yellow }}>
                        {gc.percentage}%
                      </strong>
                      <span style={{
                        fontSize: "0.64rem",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        background: gc.isIdeal ? `${T.green}15` : `${T.yellow}15`,
                        color: gc.isIdeal ? T.green : T.yellow,
                        fontWeight: 700,
                        textTransform: "uppercase"
                      }}>
                        {gc.isIdeal ? "Ideal (40-60%)" : "Sub-optimal"}
                      </span>
                    </div>
                  );
                })()}

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

                {/* 🛡️ Archive Health Check & Self-Repair Log Panel */}
                <div style={{
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: `1px solid ${T.border2}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "1.1rem" }}>🛡️</span>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: T.green }}>
                        DNA Archive Health Check & Self-Repair
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => runHealthCheck(false)}
                      disabled={healthLoading}
                      style={{
                        background: T.accent,
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: healthLoading ? "default" : "pointer"
                      }}
                    >
                      {healthLoading ? "Checking..." : "Run Health Check"}
                    </button>
                  </div>

                  <p style={{ margin: 0, fontSize: "0.74rem", color: T.text2, lineHeight: 1.3 }}>
                    Verifies saved DNA sequence checksums via Render API and auto-repairs mutations on interval or manual request.
                  </p>

                  {healthError && (
                    <div style={{ fontSize: "0.74rem", color: T.yellow, fontWeight: 700 }}>
                      ⚠️ {healthError}
                    </div>
                  )}

                  {/* Scrollable list of health logs */}
                  <div style={{
                    background: T.surf2,
                    border: `1px solid ${T.border}`,
                    borderRadius: "8px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "8px"
                  }}>
                    {healthLogs.length === 0 ? (
                      <div style={{ padding: "10px", textAlign: "center", color: T.text3, fontSize: "0.74rem" }}>
                        No health checks executed yet.
                      </div>
                    ) : (
                      healthLogs.map((log, idx) => (
                        <div key={idx} style={{
                          background: T.surf,
                          border: `1px solid ${T.border2}`,
                          borderRadius: "6px",
                          padding: "8px",
                          fontSize: "0.74rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                            <span style={{ color: (log.corrupted_found > 0 || log.blocksFixed > 0) ? T.yellow : T.green }}>
                              {(log.corrupted_found > 0 || log.blocksFixed > 0) ? "⚠️ Repair Required" : "✅ Archive Healthy"}
                            </span>
                            <span style={{ color: T.text3, fontSize: "0.7rem" }}>
                              {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                            </span>
                          </div>
                          <div style={{ color: T.text2, fontSize: "0.72rem" }}>
                            <strong>Scanned Count:</strong> {log.scanned_count ?? log.blocksScanned ?? 0} | <strong>Corrupted Found:</strong> {log.corrupted_found ?? 0} | <strong>Fixed Count:</strong> {log.fixed_count ?? log.blocksFixed ?? 0}
                          </div>
                          {log.status && (
                            <div style={{ color: T.text3, fontSize: "0.72rem", fontStyle: "italic" }}>
                              {log.status}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

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

      {/* ── BIOMETRIC SCANNER VIRTUAL MODAL ── */}
      {biometricModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(5, 5, 15, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          padding: "20px",
          boxSizing: "border-box"
        }}>
          <div style={{
            background: T.surf,
            border: `2px solid ${T.accent}`,
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            boxShadow: `0 8px 32px rgba(91, 94, 244, 0.25)`
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
              🧬
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: T.text1, fontSize: "1.2rem", fontWeight: 800 }}>
              {biometricModal.title}
            </h3>
            <p style={{ margin: "0 0 24px 0", color: T.text2, fontSize: "0.85rem", lineHeight: 1.5 }}>
              {biometricModal.message}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => biometricModal.onSuccess("success")}
                style={{
                  padding: "12px",
                  background: `linear-gradient(135deg, ${T.green}, #059669)`,
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Scan Fingerprint (Success)
              </button>
              {biometricModal.title.includes("Verify") && (
                <button
                  type="button"
                  onClick={() => biometricModal.onSuccess("failure")}
                  style={{
                    padding: "10px",
                    background: `${T.red}20`,
                    border: `1px solid ${T.red}50`,
                    borderRadius: "8px",
                    color: T.red,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  Simulate Scan Mismatch (Fail)
                </button>
              )}
              <button
                type="button"
                onClick={biometricModal.onFailure}
                style={{
                  padding: "10px",
                  background: "transparent",
                  border: `1px solid ${T.border2}`,
                  borderRadius: "8px",
                  color: T.text2,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                Cancel Authentication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * APEX OS DNA Storage Core Engine
 * Standardized reusable high-fidelity biological-digital conversion library.
 * Fully functional with checksumming, pipeline validation, benchmarking, and error-control.
 */

// Helper: Standard CRC-32 Checksum implementation
export function crc32(str) {
  const bytes = new TextEncoder().encode(str);
  let crc = ~0;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return (~crc) >>> 0;
}

// Helper: Convert unsigned 32-bit integer to binary string
export function checksumToBinary(checksumVal) {
  return checksumVal.toString(2).padStart(32, "0");
}

// Helper: Text string to binary string (UTF-8)
export function textToBinary(text) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += bytes[i].toString(2).padStart(8, "0");
  }
  return binary;
}

// Helper: Binary string (UTF-8) to text string
export function binaryToText(binary) {
  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byteStr = binary.slice(i, i + 8);
    if (byteStr.length === 8) {
      bytes.push(parseInt(byteStr, 2));
    }
  }
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

// Parse Binary mapping configuration (e.g. "00=A, 01=C, 10=G, 11=T")
export function parseBinaryMapping(mappingStr) {
  const map = {};
  if (!mappingStr) return { "00": "A", "01": "C", "10": "G", "11": "T" };
  const parts = mappingStr.split(/[,\s;\n]+/);
  parts.forEach(part => {
    const [k, v] = part.split("=");
    if (k && v) {
      map[k.trim()] = v.trim().toUpperCase();
    }
  });
  if (Object.keys(map).length === 0) {
    return { "00": "A", "01": "C", "10": "G", "11": "T" };
  }
  return map;
}

// Parse DNA mapping configuration (e.g. "A=00, C=01, G=10, T=11")
export function parseDnaMapping(mappingStr) {
  const map = {};
  if (!mappingStr) return { "A": "00", "C": "01", "G": "10", "T": "11" };
  const parts = mappingStr.split(/[,\s;\n]+/);
  parts.forEach(part => {
    const [k, v] = part.split("=");
    if (k && v) {
      map[k.trim().toUpperCase()] = v.trim();
    }
  });
  if (Object.keys(map).length === 0) {
    return { "A": "00", "C": "01", "G": "10", "T": "11" };
  }
  return map;
}

/**
 * ENCODER
 * Converts Raw Text -> UTF-8 -> Binary + Checksum -> DNA Bases
 */
export function Encode(text, algorithm = null) {
  const startTime = performance.now();

  // Generate 32-bit checksum
  const checksumValue = crc32(text);
  const checksumBinary = checksumToBinary(checksumValue);

  // Convert original payload to UTF-8 Binary
  const payloadBinary = textToBinary(text);

  // Combine checksum + payload binary
  const combinedBinary = checksumBinary + payloadBinary;

  // Retrieve mapping rules
  const bMap = parseBinaryMapping(algorithm?.binaryMapping);
  const bitLengths = Object.keys(bMap).map(k => k.length);
  const sliceLen = bitLengths.length > 0 ? Math.max(...bitLengths) : 2;

  let dnaSequence = "";
  for (let i = 0; i < combinedBinary.length; i += sliceLen) {
    let bits = combinedBinary.slice(i, i + sliceLen);
    if (bits.length < sliceLen) {
      bits = bits.padEnd(sliceLen, "0");
    }
    dnaSequence += bMap[bits] || "A";
  }

  const endTime = performance.now();
  const encodingTime = endTime - startTime;

  return {
    originalText: text,
    originalSize: new TextEncoder().encode(text).length,
    checksum: checksumValue,
    checksumBinary,
    payloadBinary,
    combinedBinary,
    dnaSequence,
    encodingTime
  };
}

/**
 * DECODER
 * Converts DNA Bases -> Binary -> Extract Checksum -> UTF-8 payload -> Original Text
 */
export function Decode(dnaSequence, algorithm = null) {
  const startTime = performance.now();

  const dMap = parseDnaMapping(algorithm?.dnaMapping);

  // Map DNA bases back to binary string
  let combinedBinary = "";
  for (let i = 0; i < dnaSequence.length; i++) {
    const base = dnaSequence[i].toUpperCase();
    combinedBinary += dMap[base] || "00";
  }

  // Extract checksum (first 32 bits) and payload binary
  const checksumBinary = combinedBinary.slice(0, 32);
  const payloadBinary = combinedBinary.slice(32);

  const extractedChecksum = parseInt(checksumBinary, 2);

  let decodedText = "";
  let corruptionDetected = false;
  try {
    decodedText = binaryToText(payloadBinary);
  } catch (err) {
    corruptionDetected = true;
  }

  // Verify checksum
  const computedChecksum = crc32(decodedText);
  const checksumVerified = !corruptionDetected && (extractedChecksum === computedChecksum);

  const endTime = performance.now();
  const decodingTime = endTime - startTime;

  return {
    decodedText,
    decodedSize: new TextEncoder().encode(decodedText).length,
    extractedChecksum,
    computedChecksum,
    checksumVerified: checksumVerified && !corruptionDetected,
    payloadBinary,
    combinedBinary,
    decodingTime,
    corruptionDetected
  };
}

/**
 * VALIDATION
 * Performs character-by-character validation and structural metrics profiling
 */
export function Validate(original, decoded, checksumVerified = true) {
  const len = Math.max(original.length, decoded.length);
  let errorCount = 0;
  for (let i = 0; i < len; i++) {
    if (original[i] !== decoded[i]) {
      errorCount++;
    }
  }

  const similarity = len > 0 ? ((len - errorCount) / len) * 100 : 100;
  const pass = (original === decoded) && checksumVerified;

  return {
    pass: pass ? "PASS" : "FAIL",
    similarity: similarity.toFixed(2) + "%",
    errorCount,
    message: pass
      ? "PASS: Reconstruction Perfect & Checksum Matches!"
      : `FAIL: Similarity is ${similarity.toFixed(2)}%, Error count: ${errorCount}`
  };
}

/**
 * CHECKSUM
 * Direct functional wrapper to verify integrity and detect corruption
 */
export function Checksum(text) {
  return crc32(text);
}

/**
 * BENCHMARK
 * Runs automated speed and size optimization analysis
 */
export function Benchmark(payloadText, algorithm = null) {
  const encodeRes = Encode(payloadText, algorithm);
  const decodeRes = Decode(encodeRes.dnaSequence, algorithm);
  const validateRes = Validate(payloadText, decodeRes.decodedText, decodeRes.checksumVerified);

  const dnaLength = encodeRes.dnaSequence.length;
  const originalSize = encodeRes.originalSize;
  const recoveredSize = decodeRes.decodedSize;
  const totalTime = encodeRes.encodingTime + decodeRes.decodingTime;

  return {
    executionId: `EXEC_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    algorithmName: algorithm?.name || "Standard DNA Encoder",
    encodingTime: encodeRes.encodingTime,
    decodingTime: decodeRes.decodingTime,
    dnaLength,
    binaryLength: encodeRes.combinedBinary.length,
    originalSize,
    recoveredSize,
    validationResult: validateRes.pass,
    checksumResult: decodeRes.checksumVerified ? "PASS" : "FAIL",
    similarity: validateRes.similarity,
    errorCount: validateRes.errorCount,
    throughput: totalTime > 0 ? (dnaLength / totalTime) : 0 // bases per ms
  };
}

/**
 * GC & HOMOPOLYMER COMPLIANCE RULES
 */
export function validateGCRule(dna, gcRulesStr) {
  const len = dna.length || 1;
  const gCount = (dna.match(/G/g) || []).length;
  const cCount = (dna.match(/C/g) || []).length;
  const gcPercent = ((gCount + cCount) / len) * 100;

  let min = 40;
  let max = 60;
  if (gcRulesStr) {
    const parts = gcRulesStr.split("-");
    if (parts.length === 2) {
      const minVal = parseInt(parts[0]);
      const maxVal = parseInt(parts[1]);
      if (!isNaN(minVal) && !isNaN(maxVal)) {
        min = minVal;
        max = maxVal;
      }
    }
  }

  const passed = gcPercent >= min && gcPercent <= max;
  return {
    passed,
    gcPercent: Math.round(gcPercent),
    min,
    max,
    message: passed
      ? `GC Content: ${Math.round(gcPercent)}% (PASS - range is ${min}-${max}%)`
      : `GC Content: ${Math.round(gcPercent)}% (FAIL - range is ${min}-${max}%)`
  };
}

export function validateHomopolymerRule(dna, homopolymerRulesStr) {
  let limit = 3;
  if (homopolymerRulesStr) {
    const limitMatch = homopolymerRulesStr.match(/\d+/);
    if (limitMatch) {
      limit = parseInt(limitMatch[0]);
    }
  }

  let maxRun = 1;
  let currentRun = 1;
  let violatingBase = "";
  for (let i = 1; i < dna.length; i++) {
    if (dna[i] === dna[i - 1]) {
      currentRun++;
      if (currentRun > maxRun) {
        maxRun = currentRun;
        if (maxRun > limit) {
          violatingBase = dna[i];
        }
      }
    } else {
      currentRun = 1;
    }
  }

  const passed = maxRun <= limit;
  return {
    passed,
    maxRun,
    limit,
    message: passed
      ? `Homopolymer Check: PASS (No run exceeds ${limit})`
      : `Homopolymer Check: FAIL (Run of '${violatingBase}' is ${maxRun}, exceeds limit of ${limit})`
  };
}

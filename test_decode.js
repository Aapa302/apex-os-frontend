import { Encode, Decode } from "./src/core/DNACoreEngine.js";

// copy helpers
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

const deNoiseDna = (dna) => {
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

const reNoiseDna = (encodedDna) => {
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

const decodeSequenceAndVerifyChecksumsOriginal = (dnaWithChecksums, history) => {
  if (!dnaWithChecksums) return { cleanDna: "", corruptions: [], autoCorrected: [] };
  const corruptions = [];
  const autoCorrected = [];
  let cleanDna = "";

  let index = 0;
  let blockNum = 1;

  while (index < dnaWithChecksums.length) {
    const remainingLength = dnaWithChecksums.length - index;
    const isTriplicated = history.includes(blockNum);

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
  const fullyRestoredDna = reNoiseDna(cleanDna);

  return { cleanDna: fullyRestoredDna, corruptions, autoCorrected };
};

const decodeSequenceAndVerifyChecksumsFixed = (dnaWithChecksums, history) => {
  if (!dnaWithChecksums) return { cleanDna: "", corruptions: [], autoCorrected: [] };
  const corruptions = [];
  const autoCorrected = [];
  let cleanDna = "";

  let index = 0;
  let blockNum = 1;

  while (index < dnaWithChecksums.length) {
    const remainingLength = dnaWithChecksums.length - index;
    let isTriplicated = history.includes(blockNum);

    if (isTriplicated) {
      // Verify if the block is actually triplicated in the input sequence!
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
  const fullyRestoredDna = reNoiseDna(cleanDna);

  return { cleanDna: fullyRestoredDna, corruptions, autoCorrected };
};

const text = "Hello hanu aapa doliya";
const localResult = Encode(text);
const rawDna = localResult.dnaSequence.slice(16);

// Encode without triplication
const deNoised = deNoiseDna(rawDna);
const withChecksums = deNoised + compute4BaseChecksum(deNoised);

// History with block 1 flagged as mismatch/triplicated
const history = [1];

console.log("--- ORIGINAL DECODER RUN ---");
const decodedOriginal = decodeSequenceAndVerifyChecksumsOriginal(withChecksums, history);
const complDnaOriginal = "A".repeat(16) + decodedOriginal.cleanDna;
console.log("Decoded text:", Decode(complDnaOriginal).decodedText);

console.log("\n--- FIXED DECODER RUN ---");
const decodedFixed = decodeSequenceAndVerifyChecksumsFixed(withChecksums, history);
const complDnaFixed = "A".repeat(16) + decodedFixed.cleanDna;
console.log("Decoded text:", Decode(complDnaFixed).decodedText);

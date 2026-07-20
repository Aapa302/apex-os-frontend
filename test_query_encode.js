import { Encode } from "./src/core/DNACoreEngine.js";

const textToBin = (text) => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += bytes[i].toString(2).padStart(8, "0");
  }
  return binary;
};

const queryEncodeNative = (queryText) => {
  const binary = textToBin(queryText);
  let queryDna = "";
  for (let i = 0; i < binary.length; i += 2) {
    const bits = binary.slice(i, i + 2).padEnd(2, "0");
    if (bits === "00") queryDna += "A";
    else if (bits === "01") queryDna += "C";
    else if (bits === "10") queryDna += "G";
    else if (bits === "11") queryDna += "T";
  }
  return queryDna;
};

const queryEncodeSearchDna = (queryText) => {
  const enc = Encode(queryText);
  return enc.dnaSequence.slice(16);
};

const testCases = [
  "a",
  "abc",
  "hanu",
  "Hello hanu aapa doliya",
  "123!@#"
];

console.log("--- NATIVE SEARCH QUERY ENCODING ---");
for (const tc of testCases) {
  const dna = queryEncodeNative(tc);
  console.log(`Input: "${tc}" (len ${tc.length}) -> DNA: ${dna} (len ${dna.length}, expected bases ${tc.length * 4})`);
}

console.log("\n--- SEARCH DNA TAB QUERY ENCODING ---");
for (const tc of testCases) {
  const dna = queryEncodeSearchDna(tc);
  console.log(`Input: "${tc}" (len ${tc.length}) -> DNA: ${dna} (len ${dna.length}, expected bases ${tc.length * 4})`);
}

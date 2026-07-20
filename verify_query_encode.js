import { Encode } from "./src/core/DNACoreEngine.js";

const encodeQueryToDna = (queryText) => {
  if (!queryText) return "";
  const encoder = new TextEncoder();
  const bytes = encoder.encode(queryText);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += bytes[i].toString(2).padStart(8, "0");
  }

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

const testCases = [
  { name: "1 Letter", text: "x", expectedChars: 1 },
  { name: "3 Letters", text: "dna", expectedChars: 3 },
  { name: "4 Letters ('hanu')", text: "hanu", expectedChars: 4 },
  { name: "Long Sentence", text: "The quick brown fox jumps over the lazy dog.", expectedChars: 43 },
  { name: "Number & Special Characters", text: "APEX_v4! 123", expectedChars: 12 }
];

console.log("--- RUNNING 5 GENERALIZED QUERY ENCODING TEST CASES ---");
let allPassed = true;

testCases.forEach((tc) => {
  const queryText = tc.text;
  const dnaPattern = encodeQueryToDna(queryText);
  const expectedBases = queryText.length * 4;
  const actualBases = dnaPattern.length;

  console.log(`[TEST] Case: "${tc.name}"`);
  console.log(`       Input text: "${queryText}" (Length: ${queryText.length} chars)`);
  console.log(`       Generated DNA: ${dnaPattern} (Length: ${actualBases} bases)`);
  console.log(`       Expected length: ${expectedBases} bases`);

  const passed = (actualBases === expectedBases);
  if (passed) {
    console.log(`       Result: [PASS]`);
  } else {
    console.error(`       Result: [FAIL] - Mismatch in expected length!`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\n[SUCCESS] All 5 query-to-DNA encoding test cases passed perfectly!");
} else {
  console.error("\n[FAILURE] One or more query-to-DNA encoding test cases failed!");
  process.exit(1);
}

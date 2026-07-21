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
  { name: "Empty String", text: "" },
  { name: "1 Letter", text: "z" },
  { name: "2 Letters", text: "os" },
  { name: "4 Letters ('hanu')", text: "hanu" },
  { name: "Full Sentence", text: "APEX OS is the ultimate DNA storage platform." },
  { name: "Numbers & Special Characters", text: "123!@#_v4" },
  { name: "Long String (50+ Chars)", text: "This is an extremely long string designed to test the boundary limits of the DNA-Native query encoding engine with more than fifty characters." },
  { name: "Multi-byte Emoji UTF-8", text: "🧬🧬" }
];

console.log("--- AFTER FIX / CODE AUDIT TESTING ---");
console.log("Starting audit of the query-to-DNA encoding logic...");

let allPassed = true;

testCases.forEach((tc, idx) => {
  const queryText = tc.text;
  const dnaPattern = encodeQueryToDna(queryText);
  const expectedBases = (new TextEncoder().encode(queryText)).length * 4;
  const actualBases = dnaPattern.length;

  console.log(`\n[CASE #${idx + 1}] Name: "${tc.name}"`);
  console.log(`  Input Text: "${queryText}"`);
  console.log(`  Input Character Length: ${queryText.length}`);
  console.log(`  Generated DNA: "${dnaPattern}"`);
  console.log(`  Generated DNA Length (bases): ${actualBases}`);
  console.log(`  Expected DNA Length (bases): ${expectedBases}`);

  const passed = (actualBases === expectedBases);
  if (passed) {
    console.log(`  Status: [PASS]`);
  } else {
    console.error(`  Status: [FAIL] - Length mismatch!`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\n[SUCCESS] All 8 query-to-DNA encoding test cases passed perfectly with correct character and byte counts!");
} else {
  console.error("\n[FAILURE] Mismatches detected in query-to-DNA encoding lengths!");
  process.exit(1);
}

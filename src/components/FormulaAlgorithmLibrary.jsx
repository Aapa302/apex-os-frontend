import React, { useState, useEffect, useMemo } from "react";

// Pre-populated professional scientific, mathematical and engineering formulas
const INITIAL_FORMULAS = [
  // --- AI ---
  {
    id: "ai_softmax",
    name: "Softmax Activation Function",
    category: "AI",
    expression: "f(x_i) = exp(x_i) / Σ exp(x_j)",
    description: "Normalizes a vector of real numbers into a probability distribution where output components sum to 1.",
    variables: [
      { name: "x_i", label: "Input value of target class i", defaultValue: "2.0" },
      { name: "sum_exp", label: "Sum of exp of all class inputs", defaultValue: "10.0" }
    ],
    compute: (vals) => {
      const xi = parseFloat(vals["x_i"]);
      const sum = parseFloat(vals["sum_exp"]);
      if (isNaN(xi) || isNaN(sum) || sum <= 0) return "Invalid Input";
      return (Math.exp(xi) / sum).toFixed(6);
    },
    codeSnippet: "import numpy as np\n\ndef softmax(x):\n    e_x = np.exp(x - np.max(x))\n    return e_x / e_x.sum(axis=0)",
    tags: ["Deep Learning", "Activation", "Neural Networks"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  {
    id: "ai_shannon_entropy",
    name: "Shannon Entropy",
    category: "AI",
    expression: "H(X) = - Σ P(x_i) * log2(P(x_i))",
    description: "Measures the expected value of the information, randomness, or uncertainty contained in an information source.",
    variables: [
      { name: "p_i", label: "Probability of event i (P(x_i))", defaultValue: "0.25" }
    ],
    compute: (vals) => {
      const pi = parseFloat(vals["p_i"]);
      if (isNaN(pi) || pi <= 0 || pi >= 1) return "Invalid Input (p must be in (0, 1))";
      const h_pi = -pi * Math.log2(pi) - (1 - pi) * Math.log2(1 - pi);
      return h_pi.toFixed(6) + " bits (for 2-state distribution)";
    },
    codeSnippet: "import numpy as np\n\ndef shannon_entropy(p):\n    # p is an array of probabilities summing to 1\n    return -np.sum(p * np.log2(p + 1e-12))",
    tags: ["Information Theory", "Loss Functions", "Decision Trees"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  // --- Mathematics ---
  {
    id: "math_quadratic",
    name: "Quadratic Formula Root Discriminant",
    category: "Mathematics",
    expression: "Δ = b² - 4ac",
    description: "The discriminant of a quadratic equation ax² + bx + c = 0 determining the nature of its real roots.",
    variables: [
      { name: "a", label: "Coefficient a", defaultValue: "1" },
      { name: "b", label: "Coefficient b", defaultValue: "5" },
      { name: "c", label: "Coefficient c", defaultValue: "6" }
    ],
    compute: (vals) => {
      const a = parseFloat(vals["a"]);
      const b = parseFloat(vals["b"]);
      const c = parseFloat(vals["c"]);
      if (isNaN(a) || isNaN(b) || isNaN(c)) return "Invalid Input";
      const disc = b * b - 4 * a * c;
      let nature = "Complex roots";
      if (disc > 0) nature = "Two distinct real roots";
      else if (disc === 0) nature = "One real double root";
      return `Δ = ${disc} (${nature})`;
    },
    codeSnippet: "def discriminant(a, b, c):\n    return b**2 - 4*a*c",
    tags: ["Algebra", "Polynomials", "Roots"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  {
    id: "math_fibonacci",
    name: "Binet's Fibonacci Formula",
    category: "Mathematics",
    expression: "F_n = (φ^n - (1-φ)^n) / √5",
    description: "Calculates the n-th Fibonacci number directly using the Golden Ratio (φ ≈ 1.618).",
    variables: [
      { name: "n", label: "Index of term n", defaultValue: "10" }
    ],
    compute: (vals) => {
      const n = parseInt(vals["n"]);
      if (isNaN(n) || n < 0 || n > 70) return "Invalid Input (Choose n in [0, 70])";
      const phi = (1 + Math.sqrt(5)) / 2;
      const term = (Math.pow(phi, n) - Math.pow(1 - phi, n)) / Math.sqrt(5);
      return Math.round(term).toString();
    },
    codeSnippet: "import math\n\ndef binet_fibonacci(n):\n    phi = (1 + math.sqrt(5)) / 2\n    return round((phi**n - (1 - phi)**n) / math.sqrt(5))",
    tags: ["Sequences", "Number Theory", "Golden Ratio"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  // --- Physics ---
  {
    id: "phys_einstein",
    name: "Mass-Energy Equivalence",
    category: "Physics",
    expression: "E = m * c²",
    description: "States that mass and energy are the same physical entity and can be changed into each other.",
    variables: [
      { name: "m", label: "Mass in kilograms (kg)", defaultValue: "1.0" }
    ],
    compute: (vals) => {
      const m = parseFloat(vals["m"]);
      if (isNaN(m) || m < 0) return "Invalid Input";
      const c = 299792458; // m/s
      const E = m * c * c;
      return E.toExponential(6) + " Joules";
    },
    codeSnippet: "def mass_energy_equivalence(m):\n    c = 299792458 # Speed of light m/s\n    return m * (c ** 2)",
    tags: ["Relativity", "Cosmology", "Einstein"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  {
    id: "phys_schwarzschild",
    name: "Schwarzschild Radius",
    category: "Physics",
    expression: "R_s = 2GM / c²",
    description: "Defines the physical size of the event horizon for a non-rotating spherically symmetric black hole.",
    variables: [
      { name: "M", label: "Mass of black hole (kg)", defaultValue: "1.989e30" }
    ],
    compute: (vals) => {
      const M = parseFloat(vals["M"]);
      if (isNaN(M) || M < 0) return "Invalid Input";
      const G = 6.6743e-11; // m^3 kg^-1 s^-2
      const c = 299792458; // m/s
      const Rs = (2 * G * M) / (c * c);
      return Rs.toFixed(2) + " meters (" + (Rs / 1000).toFixed(4) + " km)";
    },
    codeSnippet: "def schwarzschild_radius(M):\n    G = 6.6743e-11\n    c = 299792458\n    return (2 * G * M) / (c ** 2)",
    tags: ["Astrophysics", "Gravity", "General Relativity"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  // --- Biology ---
  {
    id: "bio_hardy_weinberg",
    name: "Hardy-Weinberg Equilibrium",
    category: "Biology",
    expression: "p² + 2pq + q² = 1",
    description: "States that allele and genotype frequencies in a population will remain constant from generation to generation in the absence of evolutionary influences.",
    variables: [
      { name: "p", label: "Frequency of dominant allele p", defaultValue: "0.6" }
    ],
    compute: (vals) => {
      const p = parseFloat(vals["p"]);
      if (isNaN(p) || p < 0 || p > 1) return "Invalid Input (p must be between 0 and 1)";
      const q = 1 - p;
      const p_sq = p * p;
      const two_pq = 2 * p * q;
      const q_sq = q * q;
      return `p²=${p_sq.toFixed(4)}, 2pq=${two_pq.toFixed(4)}, q²=${q_sq.toFixed(4)}`;
    },
    codeSnippet: "def hardy_weinberg(p):\n    q = 1.0 - p\n    return p**2, 2*p*q, q**2",
    tags: ["Genetics", "Population Ecology", "Evolution"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  // --- Chemistry ---
  {
    id: "chem_arrhenius",
    name: "Arrhenius Equation (Reaction Rate)",
    category: "Chemistry",
    expression: "k = A * exp(-E_a / (RT))",
    description: "Quantifies the temperature dependence of chemical reaction rate constants.",
    variables: [
      { name: "A", label: "Pre-exponential factor (s^-1)", defaultValue: "1e11" },
      { name: "E_a", label: "Activation energy (J/mol)", defaultValue: "50000" },
      { name: "T", label: "Absolute Temperature (K)", defaultValue: "298" }
    ],
    compute: (vals) => {
      const A = parseFloat(vals["A"]);
      const Ea = parseFloat(vals["E_a"]);
      const T_val = parseFloat(vals["T"]);
      if (isNaN(A) || isNaN(Ea) || isNaN(T_val) || T_val <= 0) return "Invalid Input";
      const R = 8.314462618; // Gas constant J / (mol*K)
      const k = A * Math.exp(-Ea / (R * T_val));
      return k.toExponential(6) + " s^-1";
    },
    codeSnippet: "import math\n\ndef arrhenius_rate(A, Ea, T):\n    R = 8.314462618\n    return A * math.exp(-Ea / (R * T))",
    tags: ["Kinetics", "Physical Chemistry", "Rates"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  },
  // --- Engineering ---
  {
    id: "eng_shannon_hartley",
    name: "Shannon-Hartley Theorem",
    category: "Engineering",
    expression: "C = B * log2(1 + SNR)",
    description: "Determines the maximum theoretical channel capacity (error-free bandwidth speed) of a communication channel in the presence of noise.",
    variables: [
      { name: "B", label: "Channel Bandwidth (Hz)", defaultValue: "1000000" },
      { name: "SNR_dB", label: "Signal-to-Noise Ratio (dB)", defaultValue: "20" }
    ],
    compute: (vals) => {
      const B = parseFloat(vals["B"]);
      const SNR_dB = parseFloat(vals["SNR_dB"]);
      if (isNaN(B) || isNaN(SNR_dB) || B <= 0) return "Invalid Input";
      const SNR = Math.pow(10, SNR_dB / 10);
      const C = B * Math.log2(1 + SNR);
      return (C / 1000000).toFixed(4) + " Mbps";
    },
    codeSnippet: "import math\n\ndef channel_capacity(B, SNR_dB):\n    snr = 10 ** (SNR_dB / 10)\n    return B * math.log2(1 + snr)",
    tags: ["Telecommunication", "Bandwidth", "Signal Processing"],
    history: [
      { version: "v1.0.0", date: "2026-07-01", changes: "Initial pre-populated formula representation." }
    ]
  }
];

export default function FormulaAlgorithmLibrary() {
  const [formulas, setFormulas] = useState(() => {
    // Verified localStorage persistence key: 'apex_os_v4_formulas'
    const cached = localStorage.getItem("apex_os_v4_formulas");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return INITIAL_FORMULAS;
      }
    }
    return INITIAL_FORMULAS;
  });

  const [favorites, setFavorites] = useState(() => {
    const cached = localStorage.getItem("apex_os_v4_formula_favorites");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormulaId, setSelectedFormulaId] = useState(INITIAL_FORMULAS[0].id);

  // Custom Form Creator / Editor Fields
  const [isEditingFormulaId, setIsEditingFormulaId] = useState(null);
  const [customName, setCustomName] = useState("");
  const [customExpression, setCustomExpression] = useState("");
  const [customCategory, setCustomCategory] = useState("Custom");
  const [customDesc, setCustomDesc] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [customVarName, setCustomVarName] = useState("");
  const [customVarLabel, setCustomVarLabel] = useState("");
  const [customVars, setCustomVars] = useState([]);
  const [customTags, setCustomTags] = useState("");

  // Interactive Calculator State values
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState("");

  const categories = ["All", "AI", "Mathematics", "Physics", "Biology", "Chemistry", "Engineering", "Custom", "Execute & Compare"];

  const [availableAlgorithms, setAvailableAlgorithms] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_algorithms");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sandboxAlgId, setSandboxAlgId] = useState("");
  const [sandboxPayload, setSandboxPayload] = useState("Digital DNA Archival Code Segment v1.0");
  const [sandboxResult, setSandboxResult] = useState(null);
  const [comparisonAlgIds, setComparisonAlgIds] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);

  const textToBinary = (text) => {
    return text.split("")
      .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  };

  const binaryToDNA = (binary) => {
    let padded = binary;
    if (padded.length % 2 !== 0) padded += "0";
    let dna = "";
    const map = { "00": "A", "01": "C", "10": "G", "11": "T" };
    for (let i = 0; i < padded.length; i += 2) {
      const bits = padded.slice(i, i + 2);
      dna += map[bits] || "A";
    }
    return dna;
  };

  const dnaToBinary = (dna) => {
    let binary = "";
    const map = { "A": "00", "C": "01", "G": "10", "T": "11" };
    for (let i = 0; i < dna.length; i++) {
      const base = dna[i].toUpperCase();
      binary += map[base] || "00";
    }
    return binary;
  };

  const binaryToText = (binary) => {
    const bytes = [];
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      if (byte.length === 8) {
        bytes.push(String.fromCharCode(parseInt(byte, 2)));
      }
    }
    return bytes.join("");
  };

  const runAlgorithmExecution = (alg, payload) => {
    const t0 = performance.now();
    const binary = textToBinary(payload);
    const dna = binaryToDNA(binary);
    const decodedBinary = dnaToBinary(dna);
    const decodedText = binaryToText(decodedBinary);
    const t1 = performance.now();

    const isSuccess = decodedText.substring(0, payload.length) === payload;
    const executionTime = (t1 - t0).toFixed(3);

    return {
      algId: alg.id,
      algName: alg.name,
      version: alg.versions?.[0]?.number || "v1.0.0",
      binaryInput: binary,
      dnaOutput: dna,
      decodedText: decodedText.substring(0, payload.length),
      executionTime,
      dnaLength: dna.length,
      success: isSuccess
    };
  };

  const linkFormulaToAlgorithm = (formula, algId) => {
    try {
      const saved = localStorage.getItem("apex_os_algorithms");
      if (!saved) return;
      let algs = JSON.parse(saved);
      algs = algs.map(alg => {
        if (alg.id === algId) {
          const formulas = alg.formulas || [];
          if (!formulas.some(f => f.id === formula.id)) {
            return {
              ...alg,
              formulas: [...formulas, {
                id: formula.id,
                name: formula.name,
                expression: formula.expression,
                description: formula.description,
                variables: Array.isArray(formula.variables) ? formula.variables.map(v => `${v.name} = ${v.label}`).join("\n") : (formula.variables || ""),
                units: formula.units || "Units"
              }]
            };
          }
        }
        return alg;
      });
      localStorage.setItem("apex_os_algorithms", JSON.stringify(algs));
      setAvailableAlgorithms(algs);

      // Store in Research Memory
      try {
        const cached = localStorage.getItem("apex_os_v4_research_memories");
        let memories = cached ? JSON.parse(cached) : [];
        memories.unshift({
          id: `mem_link_${Date.now()}`,
          title: `[Link] Formula to Algorithm`,
          type: "AI Observation",
          content: `Linked formula "${formula.name}" to algorithm ID: ${algId}.`,
          tags: ["Formula", "Link"],
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          severity: "Low"
        });
        localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
      } catch (err) {
        console.error(err);
      }

      alert(`Linked formula "${formula.name}" to algorithm!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncrementVersion = (algId) => {
    try {
      const saved = localStorage.getItem("apex_os_algorithms");
      if (!saved) return;
      let algs = JSON.parse(saved);
      algs = algs.map(alg => {
        if (alg.id === algId) {
          const versions = alg.versions || [];
          const currentVer = versions[0]?.number || "v1.0.0";
          const parts = currentVer.replace("v", "").split(".");
          const major = parseInt(parts[0]) || 1;
          const minor = parseInt(parts[1]) || 0;
          const patch = (parseInt(parts[2]) || 0) + 1;
          const newVerNumber = `v${major}.${minor}.${patch}`;

          const newVer = {
            id: `v_${Date.now()}`,
            number: newVerNumber,
            date: new Date().toISOString().split("T")[0],
            author: "AI Research Platform",
            description: "Iterative version bump under dynamic sandbox trial simulation.",
            status: "Approved"
          };
          return {
            ...alg,
            versions: [newVer, ...versions]
          };
        }
        return alg;
      });
      localStorage.setItem("apex_os_algorithms", JSON.stringify(algs));
      setAvailableAlgorithms(algs);
      alert("Algorithm version updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogToExperimentManager = (result) => {
    try {
      const saved = localStorage.getItem("apex_os_experiments");
      let exps = saved ? JSON.parse(saved) : [];
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
      const newExp = {
        id: `exp_${Date.now()}`,
        name: `Sandbox Trial - ${result.algName}`,
        researchArea: "DNA Sequencing",
        objective: "Sandbox trial simulation run.",
        description: `Input payload: "${sandboxPayload}". Execution time: ${result.executionTime}ms. Output DNA length: ${result.dnaLength}bp. Success: ${result.success ? "YES" : "NO"}`,
        assignedAlgorithm: `${result.algName} (${result.version})`,
        status: "Completed",
        accuracy: result.success ? 100 : 0,
        throughput: `${(result.dnaLength / (parseFloat(result.executionTime) || 1)).toFixed(2)} bp/ms`,
        createdDate: timestamp,
        lastUpdated: timestamp,
        timeline: [
          { id: `e_${Date.now()}`, type: "success", title: "Experiment Completed", timestamp, desc: `Payload: ${sandboxPayload}. DNA sequence: ${result.dnaOutput}`, icon: "🏆" }
        ],
        attachments: []
      };
      exps.unshift(newExp);
      localStorage.setItem("apex_os_experiments", JSON.stringify(exps));
      alert("Simulation result saved directly to Experiment Manager!");
    } catch (err) {
      console.error(err);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("apex_os_v4_formulas", JSON.stringify(formulas));
  }, [formulas]);

  useEffect(() => {
    localStorage.setItem("apex_os_v4_formula_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Current selected formula object
  const selectedFormula = useMemo(() => {
    return formulas.find(f => f.id === selectedFormulaId) || formulas[0];
  }, [formulas, selectedFormulaId]);

  // Reset calculator when formula changes
  useEffect(() => {
    if (selectedFormula) {
      const initialVals = {};
      selectedFormula.variables.forEach(v => {
        initialVals[v.name] = v.defaultValue || "";
      });
      setCalculatorInputs(initialVals);
      // Run initial computation
      try {
        setCalculatorResult(selectedFormula.compute(initialVals));
      } catch (err) {
        setCalculatorResult("No Result");
      }
    }
  }, [selectedFormula]);

  // Handle computation trigger
  const handleCompute = () => {
    if (selectedFormula) {
      try {
        const result = selectedFormula.compute(calculatorInputs);
        setCalculatorResult(result);
      } catch (err) {
        setCalculatorResult("Calculation Error");
      }
    }
  };

  const handleInputChange = (varName, value) => {
    setCalculatorInputs(prev => ({
      ...prev,
      [varName]: value
    }));
  };

  // Toggle favorite / bookmark function
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Copy to clipboard support
  const handleCopyToClipboard = (text, type = "Snippet") => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  // Custom formula creation
  const handleAddVariable = () => {
    if (!customVarName.trim()) {
      alert("Variable name cannot be empty");
      return;
    }
    setCustomVars(prev => [...prev, {
      name: customVarName.trim(),
      label: customVarLabel.trim() || customVarName.trim(),
      defaultValue: "1.0"
    }]);
    setCustomVarName("");
    setCustomVarLabel("");
  };

  const handleLoadFormulaForEdit = (formula) => {
    setIsEditingFormulaId(formula.id);
    setCustomName(formula.name || "");
    setCustomExpression(formula.expression || "");
    setCustomCategory(formula.category || "Custom");
    setCustomDesc(formula.description || "");
    setCustomCode(formula.codeSnippet || "");
    setCustomVars(formula.variables || []);
    setCustomTags(formula.tags ? formula.tags.join(", ") : "");
    alert(`Loaded "${formula.name}" into the form for editing!`);
  };

  const handleCancelFormulaEdit = () => {
    setIsEditingFormulaId(null);
    setCustomName("");
    setCustomExpression("");
    setCustomCategory("Custom");
    setCustomDesc("");
    setCustomCode("");
    setCustomVars([]);
    setCustomTags("");
  };

  const handleCreateCustomFormula = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customExpression.trim()) {
      alert("Name and expression are required!");
      return;
    }

    const computeFn = (vals) => {
      // Evaluate dynamic simple expressions
      try {
        let expr = customExpression;
        Object.keys(vals).forEach(k => {
          const val = parseFloat(vals[k]) || 0;
          expr = expr.replace(new RegExp(`\\b${k}\\b`, "g"), val);
        });
        const cleanExpr = expr.replace(/[^a-zA-Z0-9+\-*/().\s]/g, "");
        const blacklist = ["window", "document", "fetch", "cookie", "alert", "eval", "Function", "XMLHttpRequest", "xml", "http", "localStorage", "sessionStorage"];
        if (blacklist.some(b => cleanExpr.toLowerCase().includes(b.toLowerCase()))) {
          return "Security Blocked";
        }
        const evaluated = new Function(`return (${cleanExpr})`)();
        return isNaN(evaluated) ? "Evaluation Error" : evaluated.toFixed(4);
      } catch (err) {
        return "Math Evaluation Error";
      }
    };

    if (isEditingFormulaId) {
      // Edit existing
      setFormulas(prev => prev.map(f => {
        if (f.id === isEditingFormulaId) {
          const updatedHistory = [
            {
              version: `v1.0.${(f.history || []).length + 1}`,
              date: new Date().toISOString().split("T")[0],
              changes: `Edited via dynamic configuration tool.`
            },
            ...(f.history || [])
          ];
          return {
            ...f,
            name: customName,
            expression: customExpression,
            category: customCategory,
            description: customDesc,
            variables: customVars.length > 0 ? customVars : f.variables,
            compute: computeFn,
            codeSnippet: customCode || f.codeSnippet,
            tags: customTags.split(",").map(t => t.trim()).filter(Boolean),
            history: updatedHistory
          };
        }
        return f;
      }));
      setIsEditingFormulaId(null);
      alert("Formula updated successfully!");
    } else {
      // Create new
      const newFormula = {
        id: `custom_${Date.now()}`,
        name: customName,
        category: customCategory,
        expression: customExpression,
        description: customDesc,
        variables: customVars.length > 0 ? customVars : [{ name: "x", label: "Generic Parameter", defaultValue: "1.0" }],
        compute: computeFn,
        codeSnippet: customCode || `# Custom Python implementation\ndef ${customName.toLowerCase().replace(/\s+/g, "_")}(${customVars.map(v => v.name).join(", ") || "x"}):\n    # TODO: Add logic here\n    pass`,
        tags: customTags.split(",").map(t => t.trim()).filter(Boolean),
        history: [{ version: "v1.0.0", date: new Date().toISOString().split("T")[0], changes: "Initial custom creation." }]
      };

      setFormulas(prev => [...prev, newFormula]);
      setSelectedFormulaId(newFormula.id);
      alert("Custom formula added to library!");
    }

    // Clear state
    setCustomName("");
    setCustomExpression("");
    setCustomCategory("Custom");
    setCustomDesc("");
    setCustomCode("");
    setCustomVars([]);
    setCustomTags("");
  };

  // Delete formula
  const handleDeleteFormula = (id) => {
    if (window.confirm("Are you sure you want to delete this formula?")) {
      setFormulas(prev => prev.filter(f => f.id !== id));
      setFavorites(prev => prev.filter(favId => favId !== id));
      // Reset selected formula
      setSelectedFormulaId(INITIAL_FORMULAS[0].id);
    }
  };

  // Filter formula logic
  const filteredFormulas = useMemo(() => {
    return formulas.filter(f => {
      const matchesCategory = selectedCategory === "All" || f.category === selectedCategory;
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [formulas, selectedCategory, searchQuery]);

  // Design Theme Tokens mapping
  const currentTheme = isLightMode ? {
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

  const T = currentTheme;

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
            <span style={{ fontSize: "1.6rem" }}>📚</span>
            <h1 style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.5px"
            }}>
              Formula & Algorithm Library
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Search, bookmark, simulate, edit, and link formulas to your active designer algorithms.
          </p>
        </div>

        {/* Theme Toggle & Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            fontSize: "0.72rem",
            color: T.green,
            background: `${T.green}12`,
            border: `1px solid ${T.green}30`,
            padding: "4px 12px",
            borderRadius: 20,
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            INTEGRATED COMPUTATION SUITE
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
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}>
        <div style={{ display: "flex", gap: "12px", width: "100%", flexWrap: "wrap" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Search formulas by name, symbol, expression or keyword..."
            style={{
              flex: 1,
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

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                background: selectedCategory === cat ? T.accent : T.surf2,
                border: `1px solid ${selectedCategory === cat ? T.accent : T.border2}`,
                borderRadius: 20,
                color: selectedCategory === cat ? "#fff" : T.text2,
                fontSize: "0.76rem",
                fontWeight: selectedCategory === cat ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── TWO COLUMN LAYOUT ── */}
      {selectedCategory === "Execute & Compare" ? (
        <div style={{
          background: T.surf,
          border: `1px solid ${T.border2}`,
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          flex: 1
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "start"
          }}>
            {/* LEFT: Sandbox Execute Panel */}
            <div style={{ background: T.surf2, padding: "20px", borderRadius: "12px", border: `1px solid ${T.border2}` }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem", fontWeight: 800 }}>⚡ Run Algorithm Simulator</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.74rem", color: T.text2, display: "block", marginBottom: "6px", fontWeight: "bold" }}>Select DNA Algorithm:</label>
                  <select
                    value={sandboxAlgId}
                    onChange={(e) => {
                      setSandboxAlgId(e.target.value);
                      setSandboxResult(null);
                    }}
                    style={{ width: "100%", background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "10px", color: T.text1 }}
                  >
                    <option value="">-- Choose Algorithm --</option>
                    {availableAlgorithms.map(alg => (
                      <option key={alg.id} value={alg.id}>{alg.name}</option>
                    ))}
                  </select>
                </div>

                {sandboxAlgId && (
                  <div style={{ background: T.surf, padding: "12px", borderRadius: "8px", border: `1px solid ${T.border2}` }}>
                    <div style={{ fontSize: "0.72rem", color: T.text3, textTransform: "uppercase", fontWeight: 600 }}>Algorithm Versions</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.8rem", color: T.text1, fontWeight: "bold" }}>
                        Active: {availableAlgorithms.find(a => a.id === sandboxAlgId)?.versions?.[0]?.number || "v1.0.0"}
                      </span>
                      <button
                        onClick={() => handleIncrementVersion(sandboxAlgId)}
                        style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "4px", color: T.cyan, padding: "3px 8px", fontSize: "0.72rem", cursor: "pointer" }}
                      >
                        Bump Version
                      </button>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: T.text2, marginTop: "6px", fontStyle: "italic" }}>
                      Objective: {availableAlgorithms.find(a => a.id === sandboxAlgId)?.objective}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: "0.74rem", color: T.text2, display: "block", marginBottom: "6px", fontWeight: "bold" }}>Payload Text Input:</label>
                  <textarea
                    rows={3}
                    value={sandboxPayload}
                    onChange={(e) => setSandboxPayload(e.target.value)}
                    style={{ width: "100%", background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "10px", color: T.text1, resize: "none", fontFamily: "monospace" }}
                  />
                </div>

                <button
                  onClick={() => {
                    const alg = availableAlgorithms.find(a => a.id === sandboxAlgId);
                    if (!alg) {
                      alert("Please select an algorithm first.");
                      return;
                    }
                    if (!sandboxPayload.trim()) {
                      alert("Please enter input text.");
                      return;
                    }
                    const res = runAlgorithmExecution(alg, sandboxPayload);
                    setSandboxResult(res);
                  }}
                  style={{ width: "100%", padding: "12px", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                >
                  Execute Pipeline
                </button>

                {sandboxResult && (
                  <div style={{ marginTop: "12px", background: T.surf, padding: "16px", borderRadius: "10px", border: `1px solid ${T.green}40` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.84rem", fontWeight: "bold", color: T.green }}>✓ Pipeline Completed</span>
                      <button
                        onClick={() => handleLogToExperimentManager(sandboxResult)}
                        style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "6px", color: T.cyan, padding: "4px 8px", fontSize: "0.74rem", cursor: "pointer" }}
                      >
                        Log as Completed Experiment
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", fontSize: "0.78rem" }}>
                      <div><strong>Original Size:</strong> {sandboxPayload.length} characters</div>
                      <div><strong>Execution Time:</strong> {sandboxResult.executionTime} ms</div>
                      <div><strong>Encoded DNA Sequence:</strong></div>
                      <div style={{ wordBreak: "break-all", fontFamily: "monospace", padding: "8px", background: T.surf2, borderRadius: "6px", color: T.cyan }}>
                        {sandboxResult.dnaOutput}
                      </div>
                      <div><strong>Decoded Output:</strong></div>
                      <div style={{ wordBreak: "break-all", fontFamily: "monospace", padding: "8px", background: T.surf2, borderRadius: "6px", color: T.green }}>
                        {sandboxResult.decodedText}
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                        <strong>Validation Status:</strong>
                        <span style={{ color: sandboxResult.success ? T.green : T.red, fontWeight: "bold" }}>
                          {sandboxResult.success ? "VALID (100% Match)" : "INVALID (Checksum Mismatch)"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Compare Algorithms Side-by-Side */}
            <div style={{ background: T.surf2, padding: "20px", borderRadius: "12px", border: `1px solid ${T.border2}` }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem", fontWeight: 800 }}>📊 Compare Alignment Algorithms</h3>
              <p style={{ fontSize: "0.76rem", color: T.text2, marginBottom: "12px" }}>
                Check multiple algorithms to contrast encoding speeds, sequence compression density, and data reconstruction validation.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {availableAlgorithms.map(alg => (
                  <label key={alg.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={comparisonAlgIds.includes(alg.id)}
                      onChange={() => {
                        setComparisonAlgIds(prev =>
                          prev.includes(alg.id) ? prev.filter(id => id !== alg.id) : [...prev, alg.id]
                        );
                      }}
                    />
                    <span>{alg.name}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => {
                  if (comparisonAlgIds.length === 0) {
                    alert("Please check at least one algorithm to compare.");
                    return;
                  }
                  const results = comparisonAlgIds.map(id => {
                    const alg = availableAlgorithms.find(a => a.id === id);
                    return runAlgorithmExecution(alg, sandboxPayload);
                  });
                  setComparisonResults(results);
                }}
                style={{ width: "100%", padding: "10px", background: T.surf, border: `1px solid ${T.accent}`, borderRadius: "8px", color: T.cyan, fontWeight: "bold", cursor: "pointer" }}
              >
                Compare Checked Performance
              </button>

              {comparisonResults.length > 0 && (
                <div style={{ overflowX: "auto", marginTop: "16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.74rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${T.border2}`, color: T.text3 }}>
                        <th style={{ padding: "6px" }}>Algorithm</th>
                        <th style={{ padding: "6px" }}>Version</th>
                        <th style={{ padding: "6px" }}>Speed (ms)</th>
                        <th style={{ padding: "6px" }}>DNA Len</th>
                        <th style={{ padding: "6px" }}>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonResults.map(res => (
                        <tr key={res.algId} style={{ borderBottom: `1px solid ${T.border}`, color: T.text1 }}>
                          <td style={{ padding: "8px 6px", fontWeight: "bold" }}>{res.algName}</td>
                          <td style={{ padding: "8px 6px" }}>{res.version}</td>
                          <td style={{ padding: "8px 6px", color: T.cyan }}>{res.executionTime}</td>
                          <td style={{ padding: "8px 6px", color: T.yellow }}>{res.dnaLength} bp</td>
                          <td style={{ padding: "8px 6px", color: res.success ? T.green : T.red, fontWeight: "bold" }}>
                            {res.success ? "VALID" : "FAILED"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "24px",
          alignItems: "start",
          flex: 1
        }}>
          {/* LEFT COLUMN: List of Formulas */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "16px",
            maxHeight: "750px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "0.9rem", color: T.text2, fontWeight: 700 }}>
              FORMULAS ({filteredFormulas.length})
            </h3>

            {filteredFormulas.length === 0 ? (
              <div style={{ padding: "40px 10px", textAlign: "center", color: T.text3 }}>
                No formulas match the filter.
              </div>
            ) : (
              filteredFormulas.map(f => {
                const isSelected = selectedFormulaId === f.id;
                const isFav = favorites.includes(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFormulaId(f.id)}
                    style={{
                      background: isSelected ? `${T.accent}12` : T.surf2,
                      border: `1px solid ${isSelected ? T.accent : T.border2}`,
                      borderRadius: "10px",
                      padding: "12px 14px",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        background: `${T.accent}15`,
                        color: T.accent,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        textTransform: "uppercase"
                      }}>
                        {f.category}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(f.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          color: isFav ? T.yellow : T.text3,
                          padding: 0
                        }}
                      >
                        {isFav ? "★" : "☆"}
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: T.text1 }}>{f.name}</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: T.cyan }}>{f.expression}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: Selected Formula Details & Interactive Sandbox */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {selectedFormula && (
              <div style={{
                background: T.surf,
                border: `1px solid ${T.border2}`,
                borderRadius: "16px",
                padding: "24px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: `1px solid ${T.border}`,
                  paddingBottom: "16px",
                  marginBottom: "20px"
                }}>
                  <div>
                    <span style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      background: `${T.accent}20`,
                      color: T.accent,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      display: "inline-block",
                      marginBottom: "8px"
                    }}>
                      {selectedFormula.category}
                    </span>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>{selectedFormula.name}</h2>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "10px" }}>
                      <span style={{ fontSize: "0.74rem", color: T.text2 }}>Link to Algorithm:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            linkFormulaToAlgorithm(selectedFormula, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        style={{
                          background: T.surf2,
                          border: `1px solid ${T.border2}`,
                          borderRadius: "6px",
                          color: T.text1,
                          fontSize: "0.74rem",
                          padding: "4px 8px",
                          cursor: "pointer"
                        }}
                      >
                        <option value="">-- Select Algorithm --</option>
                        {availableAlgorithms.map(alg => (
                          <option key={alg.id} value={alg.id}>{alg.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => toggleFavorite(selectedFormula.id)}
                      style={{
                        padding: "8px 12px",
                        background: T.surf2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: "8px",
                        color: favorites.includes(selectedFormula.id) ? T.yellow : T.text1,
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{favorites.includes(selectedFormula.id) ? "★ Bookmarked" : "☆ Bookmark"}</span>
                    </button>

                    <button
                      onClick={() => handleLoadFormulaForEdit(selectedFormula)}
                      style={{
                        padding: "8px 12px",
                        background: T.surf2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: "8px",
                        color: T.cyan,
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        cursor: "pointer"
                      }}
                    >
                      ✏️ Edit Formula
                    </button>

                    <button
                      onClick={() => handleCopyToClipboard(selectedFormula.expression, "Expression")}
                      style={{
                        padding: "8px 12px",
                        background: T.surf2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: "8px",
                        color: T.text1,
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        cursor: "pointer"
                      }}
                    >
                      📋 Copy Formula
                    </button>

                    {selectedFormula.id.startsWith("custom_") && (
                      <button
                        onClick={() => handleDeleteFormula(selectedFormula.id)}
                        style={{
                          padding: "8px 12px",
                          background: `${T.red}15`,
                          border: `1px solid ${T.red}40`,
                          borderRadius: "8px",
                          color: T.red,
                          fontWeight: 700,
                          fontSize: "0.74rem",
                          cursor: "pointer"
                        }}
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Expression Board */}
                <div style={{
                  background: "#02020a",
                  border: `1px solid ${T.border2}`,
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "80px",
                  fontFamily: "monospace",
                  fontSize: "1.4rem",
                  color: T.cyan,
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  {selectedFormula.expression}
                </div>

                {/* Description */}
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "0.74rem", color: T.text3, textTransform: "uppercase" }}>Description</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: T.text2, lineHeight: 1.5 }}>
                    {selectedFormula.description}
                  </p>
                </div>

                {/* Tags */}
                {selectedFormula.tags && selectedFormula.tags.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                    {selectedFormula.tags.map(t => (
                      <span key={t} style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: `${T.accent}12`,
                        color: T.accent,
                        padding: "2px 8px",
                        borderRadius: "12px"
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive Calculator / Simulator */}
                <div style={{
                  background: T.surf2,
                  border: `1px solid ${T.border}`,
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px"
                }}>
                  <h3 style={{ margin: "0 0 14px 0", fontSize: "0.9rem", color: T.text1, fontWeight: 700 }}>
                    🧬 Interactive Sandbox Calculator
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                    {selectedFormula.variables.map(v => (
                      <div key={v.name} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label htmlFor={`calc_${v.name}`} style={{ fontSize: "0.74rem", color: T.text2, fontWeight: 600 }}>
                          {v.label} (<span style={{ fontFamily: "monospace", color: T.cyan }}>{v.name}</span>)
                        </label>
                        <input
                          id={`calc_${v.name}`}
                          type="text"
                          value={calculatorInputs[v.name] || ""}
                          onChange={(e) => handleInputChange(v.name, e.target.value)}
                          style={{
                            background: T.surf,
                            border: `1px solid ${T.border2}`,
                            borderRadius: "6px",
                            padding: "8px 10px",
                            color: T.text1,
                            fontSize: "0.82rem",
                            outline: "none"
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", borderTop: `1px solid ${T.border}`, paddingTop: "12px" }}>
                    <button
                      onClick={handleCompute}
                      style={{
                        padding: "8px 16px",
                        background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer"
                      }}
                    >
                      ⚡ Compute Result
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.74rem", color: T.text3 }}>Result:</span>
                      <span style={{
                        fontFamily: "monospace",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: T.green
                      }}>
                        {calculatorResult}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Formula Version History / Changelog (Requested Step 2) */}
                {selectedFormula.history && selectedFormula.history.length > 0 && (
                  <div style={{
                    background: T.surf2,
                    border: `1px solid ${T.border}`,
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "24px"
                  }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: T.text1, fontWeight: 700 }}>
                      📋 Formula Version History
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {selectedFormula.history.map((h, hIdx) => (
                        <div key={hIdx} style={{ fontSize: "0.76rem", borderBottom: hIdx < selectedFormula.history.length - 1 ? `1px solid ${T.border}` : "none", paddingBottom: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", color: T.cyan }}>
                            <strong>{h.version}</strong>
                            <span>{h.date}</span>
                          </div>
                          <p style={{ margin: "2px 0 0 0", color: T.text2 }}>{h.changes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Snippet Box */}
                {selectedFormula.codeSnippet && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, fontSize: "0.74rem", color: T.text3, textTransform: "uppercase" }}>Implementation Code Snippet</h4>
                      <button
                        onClick={() => handleCopyToClipboard(selectedFormula.codeSnippet, "Snippet")}
                        style={{
                          background: "none",
                          border: "none",
                          color: T.accent,
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          fontWeight: 700
                        }}
                      >
                        Copy Snippet
                      </button>
                    </div>
                    <pre style={{
                      margin: 0,
                      background: "#0d1117",
                      border: "1px solid #30363d",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      overflowX: "auto",
                      fontSize: "0.76rem",
                      lineHeight: 1.5,
                      color: "#e6edf3",
                      fontFamily: "monospace"
                    }}>
                      {selectedFormula.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* CUSTOM FORMULA GENERATOR & EDITOR */}
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "24px"
            }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 800 }}>
                {isEditingFormulaId ? `📝 Edit Formula: ${customName}` : "➕ Add Custom Formula"}
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "0.76rem", color: T.text2 }}>
                {isEditingFormulaId ? "Modify this formula's parameters and save changes." : "Define a mathematical formula schema. Supported operations: +, -, *, /, (), and Javascript Math properties."}
              </p>

              <form onSubmit={handleCreateCustomFormula} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Formula Name *</label>
                    <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. Area of Circle" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px 10px", color: T.text1, fontSize: "0.82rem", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Category</label>
                    <select value={customCategory} onChange={e => setCustomCategory(e.target.value)} style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px 10px", color: T.text1, fontSize: "0.82rem", outline: "none" }}>
                      <option value="Custom">Custom</option>
                      <option value="AI">AI</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Mathematical Expression *</label>
                  <input type="text" value={customExpression} onChange={e => setCustomExpression(e.target.value)} placeholder="e.g. 3.14159 * r * r" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px 10px", color: T.cyan, fontSize: "0.85rem", fontFamily: "monospace", outline: "none" }} />
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Description</label>
                  <textarea rows={2} value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="Short formula description..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px 10px", color: T.text1, fontSize: "0.82rem", outline: "none", resize: "none", fontFamily: "inherit" }} />
                </div>

                {/* Dynamic variables setup */}
                <div style={{
                  background: T.surf2,
                  borderRadius: "8px",
                  padding: "12px",
                  border: `1px solid ${T.border}`
                }}>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "6px", fontWeight: "bold" }}>Variables Definition</label>

                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input type="text" value={customVarName} onChange={e => setCustomVarName(e.target.value)} placeholder="Var Name (e.g. r)" style={{ flex: 1, background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 6, padding: "6px 8px", color: T.text1, fontSize: "0.78rem" }} />
                    <input type="text" value={customVarLabel} onChange={e => setCustomVarLabel(e.target.value)} placeholder="Var Description Label" style={{ flex: 2, background: T.surf, border: `1px solid ${T.border2}`, borderRadius: 6, padding: "6px 8px", color: T.text1, fontSize: "0.78rem" }} />
                    <button type="button" onClick={handleAddVariable} style={{ padding: "6px 12px", background: T.accent, border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: "0.76rem" }}>+ Add Var</button>
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {customVars.map((v, idx) => (
                      <span key={idx} style={{
                        fontSize: "0.68rem",
                        background: T.surf,
                        border: `1px solid ${T.border2}`,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <strong>{v.name}</strong>: {v.label}
                        <button type="button" onClick={() => setCustomVars(prev => prev.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "0.65rem", padding: 0 }}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Code Snippet / Python implementation</label>
                  <textarea rows={2} value={customCode} onChange={e => setCustomCode(e.target.value)} placeholder="def custom_func()..." style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px 10px", color: T.text1, fontSize: "0.82rem", outline: "none", fontFamily: "monospace" }} />
                </div>

                <div>
                  <label style={{ color: T.text2, fontSize: "0.72rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Tags (comma-separated)</label>
                  <input type="text" value={customTags} onChange={e => setCustomTags(e.target.value)} placeholder="e.g. geometry, math" style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px 10px", color: T.text1, fontSize: "0.82rem", outline: "none" }} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "10px 18px",
                      background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    {isEditingFormulaId ? "Save Formula Changes" : "Create Formula Definition"}
                  </button>

                  {isEditingFormulaId && (
                    <button
                      type="button"
                      onClick={handleCancelFormulaEdit}
                      style={{
                        padding: "10px 18px",
                        background: T.surf2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: 8,
                        color: T.text2,
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer"
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

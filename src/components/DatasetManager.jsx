import React, { useState, useMemo, useEffect } from "react";
import {
  SearchGene,
  SearchNucleotide,
  SearchProtein,
  FetchFASTA,
  FetchMetadata
} from "../core/services/NCBIService";
import { getAllAlgorithms } from "../core/AlgorithmEngine";
import { Benchmark, Encode, Decode, Validate } from "../core/DNACoreEngine";

// Standard Design Tokens (fallback theme)
const DEFAULT_T = {
  bg:       "#05050f",
  surf:     "#0b0b18",
  surf2:    "#0f0f1e",
  border:   "#161628",
  border2:  "#1e1e35",
  text1:    "#f0f2ff",
  text2:    "#8890b0",
  text3:    "#444868",
  accent:   "#5b5ef4",
  accent2:  "#7c5cf6",
  green:    "#22d3a5",
  red:      "#f04060",
  yellow:   "#f5a623",
  pink:     "#e040fb",
  cyan:     "#00d4ff",
  glass:    "rgba(11,11,24,0.85)",
};

const MOCK_DATASETS = [
  {
    id: "ds_1",
    name: "Human Genome Reference GRCh38.p14",
    category: "Genomics",
    type: "FASTA",
    size: "3.2 GB",
    records: "3,200,000",
    owner: "Dr. Mei Lin",
    status: "Active",
    version: "v14.2",
    lastUpdated: "2026-07-12",
    description: "Standard reference genome assembly of Homo sapiens, incorporating high-coverage sequence patches and haplotype details.",
    researchArea: "Genomic Sequence Alignment",
    source: "NCBI GenBank",
    license: "Public Domain (CC0)",
    createdDate: "2026-01-10",
    tags: ["DNA", "Medical", "AI"],
    rawSequence: "ATCGGCTAAGCTAGCTAGCTAGCCTAGCTA", // Fallback raw sequence for testing
    versions: [
      { version: "v14.2", date: "2026-07-12", author: "Dr. Mei Lin", notes: "Added patch 12 with corrected centromeric assemblies." },
      { version: "v14.1", date: "2026-03-05", author: "Sarah Kim", notes: "Updated alignment annotations for chromosome 21." },
      { version: "v14.0", date: "2026-01-10", author: "Dr. Mei Lin", notes: "Initial assembly import from NCBI database." }
    ],
    columns: ["Chr", "Start_Pos", "End_Pos", "Ref_Allele", "Alt_Allele", "Quality", "Depth", "Filter"],
    rows: [
      { Chr: "chr1", Start_Pos: "100234", End_Pos: "100235", Ref_Allele: "A", Alt_Allele: "G", Quality: "Q60", Depth: "45x", Filter: "PASS" },
      { Chr: "chr1", Start_Pos: "100582", End_Pos: "100583", Ref_Allele: "C", Alt_Allele: "T", Quality: "Q58", Depth: "42x", Filter: "PASS" },
      { Chr: "chr2", Start_Pos: "244190", End_Pos: "244191", Ref_Allele: "G", Alt_Allele: "A", Quality: "Q62", Depth: "50x", Filter: "PASS" },
      { Chr: "chr5", Start_Pos: "500123", End_Pos: "500124", Ref_Allele: "T", Alt_Allele: "C", Quality: "Q55", Depth: "38x", Filter: "PASS" },
      { Chr: "chrX", Start_Pos: "155022", End_Pos: "155023", Ref_Allele: "A", Alt_Allele: "T", Quality: "Q45", Depth: "28x", Filter: "LowDepth" }
    ],
    attachments: [
      { id: "att_1_1", name: "grch38_assembly_report.csv", type: "CSV", size: "1.2 MB", date: "2026-07-12" },
      { id: "att_1_2", name: "reference_coordinates.json", type: "JSON", size: "340 KB", date: "2026-07-12" },
      { id: "att_1_3", name: "sequence_gaps_audit.pdf", type: "PDF", size: "4.5 MB", date: "2026-07-11" },
      { id: "att_1_4", name: "chromosome_distribution.png", type: "Image", size: "850 KB", date: "2026-07-10" }
    ],
    timeline: [
      { id: "tl_1_1", event: "Created", date: "2026-01-10", author: "Dr. Mei Lin", desc: "Dataset profile initialized." },
      { id: "tl_1_2", event: "Imported", date: "2026-01-10", author: "Dr. Mei Lin", desc: "Imported 3,200,000 sequence rows from NCBI primary storage." },
      { id: "tl_1_3", event: "Edited", date: "2026-03-05", author: "Sarah Kim", desc: "Annotated alignment region records for chromosome 21." },
      { id: "tl_1_4", event: "Reviewed", date: "2026-07-11", author: "Alex Chen", desc: "Approved quality metrics and FASTA sequence integrity checks." }
    ]
  },
  {
    id: "ds_2",
    name: "SARS-CoV-2 Phylogenetic Variant Map",
    category: "Virology",
    type: "JSON",
    size: "45 MB",
    records: "128,400",
    owner: "Sarah Kim",
    status: "Active",
    version: "v4.1",
    lastUpdated: "2026-07-14",
    description: "Mutational traceback network mapping genetic variations and spike protein coordinates across multiple global lineages.",
    researchArea: "Evolutionary Virology",
    source: "GISAID Repository",
    license: "Research Use Only",
    createdDate: "2026-03-15",
    tags: ["RNA", "Medical", "Protein"],
    rawSequence: "ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAATCTTACAACCAGAACTCAATT",
    versions: [
      { version: "v4.1", date: "2026-07-14", author: "Sarah Kim", notes: "Added BA.5 mutation tracker parameters." },
      { version: "v4.0", date: "2026-03-15", author: "Sarah Kim", notes: "Initial phylogenetic node mapping." }
    ],
    columns: ["Lineage", "Mutation_Site", "Protein_Domain", "Frequency", "Global_Region", "Clade"],
    rows: [
      { Lineage: "BA.5.2", Mutation_Site: "S:L452R", Protein_Domain: "RBD", Frequency: "82.4%", Global_Region: "Europe", Clade: "22E" },
      { Lineage: "BA.4", Mutation_Site: "S:F486V", Protein_Domain: "RBD", Frequency: "75.1%", Global_Region: "North America", Clade: "22A" },
      { Lineage: "XBB.1.5", Mutation_Site: "S:F486S", Protein_Domain: "RBD", Frequency: "91.2%", Global_Region: "Asia", Clade: "23A" }
    ],
    attachments: [
      { id: "att_2_1", name: "sars_mutation_matrix.csv", type: "CSV", size: "18.4 MB", date: "2026-07-14" },
      { id: "att_2_2", name: "spike_alignment_schema.json", type: "JSON", size: "2.1 MB", date: "2026-07-13" }
    ],
    timeline: [
      { id: "tl_2_1", event: "Created", date: "2026-03-15", author: "Sarah Kim", desc: "SARS-CoV-2 lineage model initiated." },
      { id: "tl_2_2", event: "Imported", date: "2026-03-15", author: "Sarah Kim", desc: "Imported 128,400 variant rows." },
      { id: "tl_2_3", event: "Edited", date: "2026-07-14", author: "Sarah Kim", desc: "Updated BA.5 mutation tracker parameters." }
    ]
  }
];

export default function DatasetManager({ T = DEFAULT_T }) {
  const [datasets, setDatasets] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_os_datasets");
      return saved ? JSON.parse(saved) : MOCK_DATASETS;
    } catch {
      return MOCK_DATASETS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("apex_os_datasets", JSON.stringify(datasets));
    } catch (e) {
      console.error(e);
    }
  }, [datasets]);

  const [activeTab, setActiveTab] = useState("explorer"); // "explorer" | "ncbi"
  const [selectedDatasetId, setSelectedDatasetId] = useState("ds_1");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Sub-modules state
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Explorer Preview tab controls
  const [previewSearch, setPreviewSearch] = useState("");
  const [previewPage, setPreviewPage] = useState(0);
  const previewRowsPerPage = 3;

  // Import form states
  const [importName, setImportName] = useState("");
  const [importCategory, setImportCategory] = useState("Genomics");
  const [importType, setImportType] = useState("CSV");
  const [importSize, setImportSize] = useState("10 MB");
  const [importRecords, setImportRecords] = useState("1,500");
  const [importOwner, setImportOwner] = useState("Sarah Kim");
  const [importDescription, setImportDescription] = useState("");
  const [importResearchArea, setImportResearchArea] = useState("");
  const [importSource, setImportSource] = useState("");
  const [importLicense, setImportLicense] = useState("CC0");

  // NCBI Search Form State
  const [ncbiDb, setNcbiDb] = useState("nucleotide");
  const [ncbiTerm, setNcbiTerm] = useState("TP53");
  const [ncbiSearching, setNcbiSearching] = useState(false);
  const [ncbiResults, setNcbiResults] = useState([]);
  const [ncbiError, setNcbiError] = useState(null);

  // NCBI Sequence Selected Details
  const [selectedAccession, setSelectedAccession] = useState("");
  const [selectedFasta, setSelectedFasta] = useState("");
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  // DNA Sequence Testing Module
  const [algorithms, setAlgorithms] = useState(() => getAllAlgorithms());
  const [testingAlgorithmId, setTestingAlgorithmId] = useState("");
  const [testingPayload, setTestingPayload] = useState("");
  const [testingReport, setTestingReport] = useState(null);

  useEffect(() => {
    setAlgorithms(getAllAlgorithms());
  }, [activeTab]);

  // Selected dataset object helper
  const selectedDataset = useMemo(() => {
    return datasets.find(d => d.id === selectedDatasetId) || datasets[0];
  }, [datasets, selectedDatasetId]);

  // Toast trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // List filters & sort
  const filteredDatasets = useMemo(() => {
    return datasets
      .filter(ds => {
        const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              ds.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || ds.status === statusFilter;
        const matchesCategory = categoryFilter === "All" || ds.category === categoryFilter;
        const matchesOwner = ownerFilter === "All" || ds.owner === ownerFilter;
        return matchesSearch && matchesStatus && matchesCategory && matchesOwner;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return b.size.localeCompare(a.size); // descending rough sort
        if (sortBy === "updated") return b.lastUpdated.localeCompare(a.lastUpdated);
        return 0;
      });
  }, [datasets, searchQuery, statusFilter, categoryFilter, ownerFilter, sortBy]);

  // Action handlers
  const handleOpenDataset = (id) => {
    setSelectedDatasetId(id);
    setPreviewPage(0);
    setPreviewSearch("");
    triggerToast(`Dataset "${datasets.find(d => d.id === id)?.name}" loaded successfully.`);
  };

  const handleDuplicateDataset = (ds) => {
    const newDs = {
      ...ds,
      id: `ds_${Date.now()}`,
      name: `${ds.name} (Copy)`,
      version: "v1.0",
      lastUpdated: new Date().toISOString().split("T")[0],
      createdDate: new Date().toISOString().split("T")[0],
      timeline: [
        { id: `tl_${Date.now()}`, event: "Created", date: new Date().toISOString().split("T")[0], author: "APEX OS Core", desc: `Duplicated from ${ds.name}.` }
      ]
    };
    setDatasets(prev => [...prev, newDs]);
    triggerToast(`Duplicated "${ds.name}" as "${newDs.name}".`);
  };

  const handleArchiveDataset = (id) => {
    setDatasets(prev => prev.map(d => {
      if (d.id === id) {
        const alreadyArchived = d.status === "Archived";
        return {
          ...d,
          status: alreadyArchived ? "Active" : "Archived",
          lastUpdated: new Date().toISOString().split("T")[0],
          timeline: [
            ...d.timeline,
            {
              id: `tl_${Date.now()}`,
              event: alreadyArchived ? "Imported" : "Archived",
              date: new Date().toISOString().split("T")[0],
              author: "APEX OS Core",
              desc: alreadyArchived ? "Restored from archived files." : "Dataset status changed to Archived."
            }
          ]
        };
      }
      return d;
    }));
    const target = datasets.find(d => d.id === id);
    triggerToast(`Toggled archive status of "${target?.name}".`);
  };

  const handleDeleteDataset = (id) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    if (selectedDatasetId === id) {
      setSelectedDatasetId("");
    }
    triggerToast("Dataset deleted successfully.");
  };

  // Attachment Removal handler
  const handleRemoveAttachment = (datasetId, attachmentId) => {
    setDatasets(prev => prev.map(d => {
      if (d.id === datasetId) {
        return {
          ...d,
          attachments: d.attachments.filter(a => a.id !== attachmentId)
        };
      }
      return d;
    }));
    triggerToast("Attachment removed.");
  };

  // Import / Save handler
  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importName.trim()) {
      triggerToast("Name is required");
      return;
    }

    const newDs = {
      id: `ds_${Date.now()}`,
      name: importName,
      category: importCategory,
      type: importType,
      size: importSize,
      records: importRecords,
      owner: importOwner,
      status: "Active",
      version: "v1.0",
      lastUpdated: new Date().toISOString().split("T")[0],
      description: importDescription,
      researchArea: importResearchArea,
      source: importSource,
      license: importLicense,
      createdDate: new Date().toISOString().split("T")[0],
      tags: [importCategory, importType],
      rawSequence: "ATCGCTAAGCTAGCTAGCTA", // Fallback raw sequence for custom uploads
      versions: [
        { version: "v1.0", date: new Date().toISOString().split("T")[0], author: importOwner, notes: "Initial uploaded dataset." }
      ],
      columns: ["Id", "Sample_Value", "Telemetry_Rating", "Verify_State"],
      rows: [
        { Id: "1", Sample_Value: "Peptide align A", Telemetry_Rating: "Q55", Verify_State: "PASS" },
        { Id: "2", Sample_Value: "Peptide align B", Telemetry_Rating: "Q62", Verify_State: "PASS" },
        { Id: "3", Sample_Value: "High-throughput read", Telemetry_Rating: "Q30", Verify_State: "FAIL" }
      ],
      attachments: [],
      timeline: [
        { id: `tl_${Date.now()}`, event: "Created", date: new Date().toISOString().split("T")[0], author: importOwner, desc: "Dataset profile uploaded & initialized." }
      ]
    };

    setDatasets(prev => [newDs, ...prev]);
    setSelectedDatasetId(newDs.id);
    setShowImportWizard(false);
    triggerToast(`Successfully uploaded "${importName}"!`);

    setImportName("");
    setImportDescription("");
    setImportResearchArea("");
    setImportSource("");
  };

  // NCBI Searches
  const executeNCBISearch = async (e) => {
    if (e) e.preventDefault();
    if (!ncbiTerm.trim()) {
      alert("Please enter a search keyword or accession ID.");
      return;
    }

    setNcbiSearching(true);
    setNcbiError(null);
    setNcbiResults([]);

    try {
      let idList = [];
      if (ncbiDb === "gene") {
        idList = await SearchGene(ncbiTerm);
      } else if (ncbiDb === "protein") {
        idList = await SearchProtein(ncbiTerm);
      } else {
        idList = await SearchNucleotide(ncbiTerm);
      }

      setNcbiResults(idList);
      if (idList.length === 0) {
        triggerToast("No matching biological sequences found.");
      } else {
        triggerToast(`Found ${idList.length} sequence IDs.`);
        // Automatically fetch the first result details
        fetchNCBISequenceDetails(idList[0]);
      }
    } catch (err) {
      setNcbiError(err.message);
      triggerToast("NCBI API fetch failed.");
    } finally {
      setNcbiSearching(false);
    }
  };

  const fetchNCBISequenceDetails = async (id) => {
    setSelectedAccession(id);
    setSelectedLoading(true);
    setSelectedFasta("");
    setSelectedMeta(null);
    setTestingPayload("");
    setTestingReport(null);

    try {
      const meta = await FetchMetadata(id, ncbiDb === "gene" ? "gene" : ncbiDb === "protein" ? "protein" : "nucleotide");
      const fasta = await FetchFASTA(id);

      setSelectedMeta(meta);
      setSelectedFasta(fasta);

      // Extract raw nucleobase text to pre-populate sequence testing payload
      const lines = fasta.split("\n");
      const cleanSeq = lines.slice(1).join("").replace(/[^ATCGatcgNn]/g, "").toUpperCase();
      setTestingPayload(cleanSeq);

      triggerToast(`Fetched metadata and sequence for NCBI ${id}.`);
    } catch (err) {
      alert(`NCBI Details Fetch Error: ${err.message}`);
    } finally {
      setSelectedLoading(false);
    }
  };

  // Persists fetched NCBI sequence directly into local database
  const handleImportNCBISequence = () => {
    if (!selectedAccession || !selectedFasta || !selectedMeta) {
      alert("No active sequence loaded to import.");
      return;
    }

    const lines = selectedFasta.split("\n");
    const rawSequence = lines.slice(1).join("").replace(/[^ATCGatcgNn]/g, "").toUpperCase();

    // Parse into rows for Data Preview Grid
    const rows = [];
    const maxPreview = Math.min(rawSequence.length, 50); // limit preview lines
    for (let i = 0; i < maxPreview; i++) {
      rows.push({
        Position: i + 1,
        Base: rawSequence[i],
        Quality: "Q60",
        State: "PASS"
      });
    }

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newDs = {
      id: `ds_ncbi_${Date.now()}`,
      name: `NCBI: ${selectedAccession} - ${selectedMeta.organism}`,
      category: "Genomics",
      type: "FASTA",
      size: `${(selectedFasta.length / 1024).toFixed(1)} KB`,
      records: `${rawSequence.length}`,
      owner: "Dr. Mei Lin",
      status: "Active",
      version: "v1.0",
      lastUpdated: timestamp,
      description: selectedMeta.title || `Raw FASTA sequence fetched directly from NCBI GenBank. Accession: ${selectedAccession}.`,
      researchArea: "Sequence Translation Benchmarks",
      source: "NCBI GenBank",
      license: "Public Domain",
      createdDate: timestamp,
      tags: ["NCBI", "FASTA", "Biological"],
      versions: [
        { version: "v1.0", date: timestamp, author: "Dr. Mei Lin", notes: `Direct import from NCBI GenBank database.` }
      ],
      columns: ["Position", "Base", "Quality", "State"],
      rows: rows,
      rawSequence: rawSequence, // preserve complete sequence for testing
      attachments: [
        { id: `att_${Date.now()}`, name: `${selectedAccession}.fasta`, type: "FASTA", size: `${(selectedFasta.length / 1024).toFixed(1)} KB`, date: timestamp }
      ],
      timeline: [
        { id: `tl_${Date.now()}`, event: "Created", date: timestamp, author: "Dr. Mei Lin", desc: `NCBI dataset imported.` }
      ]
    };

    const nextList = [newDs, ...datasets];
    setDatasets(nextList);
    setSelectedDatasetId(newDs.id);

    // Increment imported stats
    try {
      const importedCount = parseInt(localStorage.getItem("apex_os_ncbi_imported_count") || "0") + 1;
      localStorage.setItem("apex_os_ncbi_imported_count", importedCount.toString());
    } catch(e) {}

    // Save to Research Memory System
    try {
      const cached = localStorage.getItem("apex_os_v4_research_memories");
      let memories = cached ? JSON.parse(cached) : [];
      memories.unshift({
        id: `mem_ncbi_${Date.now()}`,
        title: `[NCBI Import] ${selectedAccession} - ${selectedMeta.organism}`,
        type: "AI Observation",
        content: `Accession: ${selectedAccession}\nOrganism: ${selectedMeta.organism}\nDefinition: ${selectedMeta.title}\nSequence Length: ${rawSequence.length} bp\nImport Date: ${timestamp}`,
        tags: ["NCBI", "FASTA", "GenBank"],
        timestamp: timestamp,
        severity: "Low"
      });
      localStorage.setItem("apex_os_v4_research_memories", JSON.stringify(memories));
    } catch (err) {}

    triggerToast(`Imported ${selectedAccession} successfully into cached datasets!`);
  };

  // DNA Sequence Testing Module Benchmarker
  const runSequenceTest = () => {
    const alg = algorithms.find(a => a.id === testingAlgorithmId);
    if (!alg) {
      alert("Please select a DNA algorithm first.");
      return;
    }
    if (!testingPayload.trim()) {
      alert("Please enter or select a sequence payload.");
      return;
    }

    const benchmark = Benchmark(testingPayload, alg);
    setTestingReport(benchmark);

    // Record to executions tracker
    try {
      const execsCount = parseInt(localStorage.getItem("apex_os_ncbi_executed_count") || "0") + 1;
      localStorage.setItem("apex_os_ncbi_executed_count", execsCount.toString());
    } catch(e) {}

    // Auto update standard runs stats for dashboard kpis
    try {
      const savedRuns = localStorage.getItem("apex_os_v3_dna_runs");
      let runs = savedRuns ? JSON.parse(savedRuns) : [];
      runs.unshift({
        executionId: benchmark.executionId,
        algorithmName: alg.name,
        success: benchmark.validationResult === "PASS" && benchmark.checksumResult === "PASS",
        time: parseFloat(benchmark.encodingTime + benchmark.decodingTime),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("apex_os_v3_dna_runs", JSON.stringify(runs));
    } catch(e) {}

    // Sync to Experiment Manager list
    try {
      const cached = localStorage.getItem("apex_os_experiments");
      let exps = cached ? JSON.parse(cached) : [];
      exps.unshift({
        id: `exp_ncbi_${Date.now()}`,
        name: `NCBI Sequence Verification - ${alg.name}`,
        researchArea: "Biological Integrity",
        objective: "Validate structural DNA base-pair integrity and encoding ratios on raw FASTA sequence strings.",
        description: `Run metadata on algorithm ID ${alg.id}. Sequence Length: ${testingPayload.length} base pairs. Latency: ${(benchmark.encodingTime + benchmark.decodingTime).toFixed(3)}ms.`,
        assignedAlgorithm: alg.name,
        status: "Completed",
        createdDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
        accuracy: parseFloat(benchmark.similarity),
        throughput: `${benchmark.throughput.toFixed(2)} bp/ms`,
        timeline: [
          { id: `e_${Date.now()}`, type: "success", title: "NCBI Sequence Tested", timestamp: new Date().toISOString(), desc: "Biological digital validation complete.", icon: "⚡" }
        ],
        attachments: []
      });
      localStorage.setItem("apex_os_experiments", JSON.stringify(exps));
    } catch (err) {}

    triggerToast("Sequence benchmark successfully executed!");
  };

  // Dashboard Stats calculation
  const stats = useMemo(() => {
    const total = datasets.length;
    const active = datasets.filter(d => d.status === "Active").length;
    const archived = datasets.filter(d => d.status === "Archived").length;

    const sizes = datasets.map(d => {
      if (d.size.includes("GB")) return parseFloat(d.size) * 1024;
      if (d.size.includes("MB")) return parseFloat(d.size);
      return parseFloat(d.size) / 1024; // KB
    });
    const totalStorageMB = sizes.reduce((acc, s) => acc + s, 0);
    const totalStorage = totalStorageMB >= 1024
      ? `${(totalStorageMB / 1024).toFixed(1)} GB`
      : `${totalStorageMB.toFixed(0)} MB`;

    const lastImportDate = datasets.reduce((latest, d) => d.createdDate > latest ? d.createdDate : latest, "2026-01-01");
    const health = "98.4%";

    return { total, active, archived, totalStorage, lastImportDate, health };
  }, [datasets]);

  // Filter Explorer Preview lines
  const filteredPreviewRows = useMemo(() => {
    if (!selectedDataset || !selectedDataset.rows) return [];
    return selectedDataset.rows.filter(r => {
      return Object.values(r).some(val =>
        String(val).toLowerCase().includes(previewSearch.toLowerCase())
      );
    });
  }, [selectedDataset, previewSearch]);

  const paginatedPreviewRows = useMemo(() => {
    const start = previewPage * previewRowsPerPage;
    return filteredPreviewRows.slice(start, start + previewRowsPerPage);
  }, [filteredPreviewRows, previewPage]);

  const maxPreviewPages = Math.ceil(filteredPreviewRows.length / previewRowsPerPage);

  return (
    <div style={{
      background: T.bg,
      color: T.text1,
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
      boxSizing: "border-box",
      padding: "24px",
      position: "relative"
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: T.surf2,
          border: `1px solid ${T.accent}`,
          color: T.text1,
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: "600",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "slideIn 0.2s ease"
        }}>
          <span style={{ color: T.accent }}>🔔</span>
          {toastMessage}
        </div>
      )}

      {/* ── HEADER SECTION ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "20px",
        borderBottom: `1px solid ${T.border}`,
        paddingBottom: "16px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "1.6rem" }}>📦</span>
            <h1 style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: T.text1
            }}>
              NCBI Biological Data Engine
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Manage core genomics archives, search NCBI biological structures, and test DNA encoding algorithms.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveTab("explorer")}
            style={{
              padding: "10px 18px",
              background: activeTab === "explorer" ? T.accent : T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            📂 Local Datasets
          </button>
          <button
            onClick={() => setActiveTab("ncbi")}
            style={{
              padding: "10px 18px",
              background: activeTab === "ncbi" ? T.accent : T.surf2,
              border: `1px solid ${T.border2}`,
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer"
            }}
          >
            🧬 NCBI Import & Test
          </button>
        </div>
      </div>

      {/* ═══ TAB 1: LOCAL DATASETS VIEW ═══ */}
      {activeTab === "explorer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
          {/* STATISTICS DASHBOARD */}
          {!showImportWizard && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "14px",
              marginBottom: "4px"
            }}>
              {[
                { label: "Total Datasets", val: stats.total, color: T.accent, icon: "📦" },
                { label: "Active", val: stats.active, color: T.green, icon: "🟢" },
                { label: "Archived", val: stats.archived, color: T.text3, icon: "📁" },
                { label: "Total Storage", val: stats.totalStorage, color: T.cyan, icon: "💾" },
                { label: "Last Import", val: stats.lastImportDate, color: T.yellow, icon: "📅" },
                { label: "Dataset Health", val: stats.health, color: T.pink, icon: "🛡️" }
              ].map(stat => (
                <div
                  key={stat.label}
                  style={{
                    background: T.surf,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: stat.color }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.72rem", color: T.text2, fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</span>
                    <span style={{ fontSize: "0.9rem" }}>{stat.icon}</span>
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: T.text1 }}>{stat.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Import dataset custom form */}
          {showImportWizard && (
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "24px",
              animation: "slideIn 0.25s ease"
            }}>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 800 }}>Dataset Upload Form (LocalStorage)</h2>
              <form onSubmit={handleImportSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Dataset Name *</label>
                  <input
                    type="text"
                    required
                    value={importName}
                    onChange={e => setImportName(e.target.value)}
                    placeholder="e.g. GRCh38 Patch 14 Genome Assembly"
                    style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Category</label>
                    <select value={importCategory} onChange={e => setImportCategory(e.target.value)} style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1 }}>
                      <option value="Genomics">Genomics</option>
                      <option value="Virology">Virology</option>
                      <option value="Proteomics">Proteomics</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>File Type</label>
                    <select value={importType} onChange={e => setImportType(e.target.value)} style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1 }}>
                      <option value="FASTA">FASTA</option>
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Size</label>
                    <input type="text" value={importSize} onChange={e => setImportSize(e.target.value)} style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Records</label>
                    <input type="text" value={importRecords} onChange={e => setImportRecords(e.target.value)} style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1 }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700 }}>Save Dataset</button>
                  <button type="button" onClick={() => setShowImportWizard(false)} style={{ padding: "10px 20px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.text2 }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", flex: 1 }}>
            {/* LEFT COLUMN: Explorer & Table */}
            <div style={{ flex: "2 1 600px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "16px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="🔍 Search local datasets..."
                    style={{ flex: "1 1 200px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: "8px", padding: "8px 12px", color: T.text1, fontSize: "0.8rem", outline: "none" }}
                  />
                  <button onClick={() => setShowImportWizard(true)} style={{ padding: "8px 14px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.cyan, fontSize: "0.78rem", fontWeight: 600 }}>+ Add Manual Dataset</button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${T.border2}`, color: T.text2 }}>
                        <th style={{ padding: "10px" }}>Dataset Name</th>
                        <th style={{ padding: "10px" }}>Category</th>
                        <th style={{ padding: "10px" }}>Type</th>
                        <th style={{ padding: "10px" }}>Size</th>
                        <th style={{ padding: "10px" }}>Records</th>
                        <th style={{ padding: "10px" }}>Owner</th>
                        <th style={{ padding: "10px" }}>Status</th>
                        <th style={{ padding: "10px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDatasets.map(ds => {
                        const isSelected = selectedDatasetId === ds.id;
                        const statusCol = ds.status === "Active" ? T.green : T.text3;
                        return (
                          <tr
                            key={ds.id}
                            style={{ borderBottom: `1px solid ${T.border}`, background: isSelected ? `${T.accent}12` : "transparent", cursor: "pointer" }}
                            onClick={() => handleOpenDataset(ds.id)}
                          >
                            <td style={{ padding: "12px 10px", fontWeight: 700, color: T.text1 }}>{ds.name}</td>
                            <td style={{ padding: "12px 10px" }}>{ds.category}</td>
                            <td style={{ padding: "12px 10px", fontFamily: "monospace" }}>{ds.type}</td>
                            <td style={{ padding: "12px 10px" }}>{ds.size}</td>
                            <td style={{ padding: "12px 10px" }}>{ds.records}</td>
                            <td style={{ padding: "12px 10px" }}>{ds.owner}</td>
                            <td style={{ padding: "12px 10px" }}>
                              <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: `${statusCol}12`, border: `1px solid ${statusCol}30`, color: statusCol }}>{ds.status}</span>
                            </td>
                            <td style={{ padding: "12px 10px" }} onClick={e => e.stopPropagation()}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => handleDuplicateDataset(ds)} title="Duplicate" style={{ background: "none", border: "none", color: T.yellow, cursor: "pointer" }}>👥</button>
                                <button onClick={() => handleArchiveDataset(ds.id)} title="Archive" style={{ background: "none", border: "none", color: T.text2, cursor: "pointer" }}>📁</button>
                                <button onClick={() => handleDeleteDataset(ds.id)} title="Delete" style={{ background: "none", border: "none", color: T.red, cursor: "pointer" }}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data preview explorer */}
              {selectedDataset && (
                <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>
                    📂 Dataset Explorer: {selectedDataset.name}
                  </h3>
                  <div style={{ overflowX: "auto", marginBottom: "12px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: T.surf2, color: T.text2 }}>
                          {(selectedDataset.columns || []).map(col => (
                            <th key={col} style={{ padding: "8px 10px", border: `1px solid ${T.border}` }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPreviewRows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: `1px solid ${T.border}` }}>
                            {(selectedDataset.columns || []).map(col => (
                              <td key={col} style={{ padding: "8px 10px", border: `1px solid ${T.border}`, color: T.text2 }}>{row[col] || "—"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: T.text2 }}>
                    <span>Showing {paginatedPreviewRows.length} rows of {filteredPreviewRows.length} records.</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button disabled={previewPage === 0} onClick={() => setPreviewPage(p => p - 1)} style={{ background: T.surf2, border: `1px solid ${T.border2}`, color: T.text1, padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}>◀ Prev</button>
                      <button disabled={previewPage + 1 >= maxPreviewPages} onClick={() => setPreviewPage(p => p + 1)} style={{ background: T.surf2, border: `1px solid ${T.border2}`, color: T.text1, padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}>Next ▶</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Details & Metadata */}
            {selectedDataset && (
              <aside style={{ flex: "1 1 300px", minWidth: "280px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "16px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", fontWeight: 800 }}>📋 Metadata</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: T.text2 }}>
                    <div>
                      <strong style={{ color: T.text1 }}>Name:</strong> {selectedDataset.name}
                    </div>
                    <div>
                      <strong style={{ color: T.text1 }}>Description:</strong> {selectedDataset.description}
                    </div>
                    <div>
                      <strong style={{ color: T.text1 }}>Records:</strong> {selectedDataset.records}
                    </div>
                    <div>
                      <strong style={{ color: T.text1 }}>Storage Size:</strong> {selectedDataset.size}
                    </div>
                    <div>
                      <strong style={{ color: T.text1 }}>Source:</strong> {selectedDataset.source || "GenBank"}
                    </div>
                    <div>
                      <strong style={{ color: T.text1 }}>License:</strong> {selectedDataset.license || "Public Domain"}
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      )}

      {/* ═══ TAB 2: NCBI DATA IMPORT & TEST VIEW ═══ */}
      {activeTab === "ncbi" && (
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", flex: 1, animation: "slideIn 0.25s ease" }}>
          {/* Left panel: Search NCBI & Results */}
          <div style={{ flex: "1 1 450px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 800, color: T.text1 }}>
                🔍 Search Official NCBI Database
              </h3>
              <form onSubmit={executeNCBISearch} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }}>
                  <select
                    value={ncbiDb}
                    onChange={e => setNcbiDb(e.target.value)}
                    style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, fontSize: "0.82rem" }}
                  >
                    <option value="nucleotide">Nucleotide</option>
                    <option value="gene">Gene</option>
                    <option value="protein">Protein</option>
                  </select>
                  <input
                    type="text"
                    value={ncbiTerm}
                    onChange={e => setNcbiTerm(e.target.value)}
                    placeholder="e.g. TP53, BRCA1, NC_000017.11..."
                    style={{ background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, fontSize: "0.82rem", outline: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={ncbiSearching}
                  style={{
                    padding: "10px",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: ncbiSearching ? "default" : "pointer",
                    opacity: ncbiSearching ? 0.6 : 1
                  }}
                >
                  {ncbiSearching ? "Searching NCBI Database..." : "Search Biological Database"}
                </button>
              </form>

              {ncbiError && (
                <div style={{ marginTop: "12px", background: `${T.red}12`, border: `1px solid ${T.red}30`, borderRadius: "8px", padding: "10px", color: T.red, fontSize: "0.78rem" }}>
                  ⚠️ Error: {ncbiError}
                </div>
              )}
            </div>

            {/* Matching Results List */}
            {ncbiResults.length > 0 && (
              <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "16px", padding: "20px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: T.text3, textTransform: "uppercase" }}>
                  NCBI Matching Accessions ({ncbiResults.length})
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "280px", overflowY: "auto" }}>
                  {ncbiResults.map(id => (
                    <button
                      key={id}
                      onClick={() => fetchNCBISequenceDetails(id)}
                      style={{
                        textAlign: "left",
                        background: selectedAccession === id ? `${T.accent}12` : T.surf2,
                        border: `1px solid ${selectedAccession === id ? T.accent : T.border2}`,
                        borderRadius: "8px",
                        padding: "10px 12px",
                        color: T.text1,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontWeight: selectedAccession === id ? 700 : 400
                      }}
                    >
                      ID: {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Selection metadata, Sequence Preview & testing card */}
          <div style={{ flex: "1.4fr 1 500px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {selectedAccession && (
              <div style={{ background: T.surf, border: `1px solid ${T.border2}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {selectedLoading ? (
                  <div style={{ color: T.text3, textAlign: "center", padding: "40px" }}>Fetching FASTA sequence parameters...</div>
                ) : (
                  <>
                    <div style={{ borderBottom: `1px solid ${T.border2}`, paddingBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ fontSize: "0.68rem", color: T.accent, fontWeight: 700, textTransform: "uppercase" }}>NCBI Sequence Record</span>
                        <h2 style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 800, color: T.text1 }}>
                          {selectedMeta?.title || "Biological Sequence"}
                        </h2>
                        <div style={{ fontSize: "0.74rem", color: T.text2, marginTop: "4px" }}>
                          Organism: <strong>{selectedMeta?.organism || "Homo Sapiens"}</strong> | Accession: {selectedAccession}
                        </div>
                      </div>
                      <button
                        onClick={handleImportNCBISequence}
                        style={{
                          padding: "8px 14px",
                          background: `${T.green}18`,
                          border: `1px solid ${T.green}40`,
                          color: T.green,
                          borderRadius: "8px",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        ✓ Import Sequence
                      </button>
                    </div>

                    {/* FASTA Sequence preview box */}
                    <div>
                      <div style={{ fontSize: "0.72rem", color: T.text3, textTransform: "uppercase", marginBottom: "6px" }}>FASTA Sequence Raw Text</div>
                      <pre style={{
                        margin: 0,
                        background: T.surf2,
                        border: `1px solid ${T.border2}`,
                        borderRadius: "10px",
                        padding: "14px",
                        color: T.cyan,
                        fontSize: "0.74rem",
                        fontFamily: "monospace",
                        maxHeight: "140px",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all"
                      }}>{selectedFasta}</pre>
                    </div>

                    {/* DNA SEQUENCE CORE TESTING PIPELINE CARD */}
                    <div style={{ borderTop: `1px solid ${T.border2}`, paddingTop: "16px" }}>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: T.text1, display: "flex", alignItems: "center", gap: "6px" }}>
                        ⚡ Run Sequence-to-Algorithm Testing Pipeline
                      </h4>
                      <p style={{ margin: "0 0 14px 0", fontSize: "0.74rem", color: T.text2, lineHeight: 1.4 }}>
                        Run any registered DNA Storage encoder/decoder on this FASTA sequence to test compliance and compile metrics.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "10px", alignItems: "end", marginBottom: "14px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.68rem", color: T.text3, textTransform: "uppercase", marginBottom: "4px" }}>Select Algorithm</label>
                          <select
                            value={testingAlgorithmId}
                            onChange={e => { setTestingAlgorithmId(e.target.value); setTestingReport(null); }}
                            style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "8px", color: T.text1, fontSize: "0.8rem" }}
                          >
                            <option value="">-- Choose Algorithm --</option>
                            {algorithms.map(alg => (
                              <option key={alg.id} value={alg.id}>{alg.name}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={runSequenceTest}
                          style={{
                            padding: "9px",
                            background: `linear-gradient(135deg, ${T.green}, ${T.cyan})`,
                            border: "none",
                            borderRadius: 8,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          Run Algorithm Benchmark
                        </button>
                      </div>

                      {testingReport && (
                        <div style={{
                          background: T.surf2,
                          border: `1px solid ${T.border}`,
                          borderRadius: "10px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontSize: "0.78rem"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}`, paddingBottom: "6px" }}>
                            <strong style={{ color: T.green }}>✓ Benchmarking Execution Complete</strong>
                            <span style={{ fontSize: "0.68rem", color: T.text3, fontFamily: "monospace" }}>ID: {testingReport.executionId}</span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Sequence Length</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text1 }}>{testingReport.dnaLength} bp</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Validation Match</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: testingReport.validationResult === "PASS" ? T.green : T.red }}>
                                ● {testingReport.validationResult} ({testingReport.similarity})
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Encoding Time</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.cyan }}>{testingReport.encodingTime.toFixed(3)} ms</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Decoding Time</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.cyan }}>{testingReport.decodingTime.toFixed(3)} ms</div>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Compression Ratio</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.pink }}>{testingReport.compressionRatio} bases/char</div>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.64rem", color: T.text3, textTransform: "uppercase" }}>Checksum Integrity</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: testingReport.checksumResult === "PASS" ? T.green : T.red }}>
                                ● {testingReport.checksumResult}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo, useEffect } from "react";

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
  },
  {
    id: "ds_3",
    name: "Myoglobin Torsional Shear Matrices",
    category: "Proteomics",
    type: "CSV",
    size: "620 KB",
    records: "4,500",
    owner: "Alex Chen",
    status: "Archived",
    version: "v1.0",
    lastUpdated: "2026-07-10",
    description: "Crystalline lattices structural confirmation profile detailing rotational force vector tolerances and secondary structural coordinates.",
    researchArea: "Structural Biology",
    source: "AlphaFold DB",
    license: "Creative Commons Attribution",
    createdDate: "2026-07-10",
    tags: ["Protein", "Quantum"],
    versions: [
      { version: "v1.0", date: "2026-07-10", author: "Alex Chen", notes: "Initial export of structural coordinates." }
    ],
    columns: ["Residue_ID", "Phi_Angle", "Psi_Angle", "Torsion_Energy", "Hydrogen_Bonds", "Helix_Index"],
    rows: [
      { Residue_ID: "PHE-12", Phi_Angle: "-65.4°", Psi_Angle: "-42.1°", Torsion_Energy: "0.45 kcal/mol", Hydrogen_Bonds: "2", Helix_Index: "H1" },
      { Residue_ID: "LEU-13", Phi_Angle: "-60.2°", Psi_Angle: "-45.0°", Torsion_Energy: "0.38 kcal/mol", Hydrogen_Bonds: "2", Helix_Index: "H1" },
      { Residue_ID: "LYS-14", Phi_Angle: "-62.1°", Psi_Angle: "-44.3°", Torsion_Energy: "0.41 kcal/mol", Hydrogen_Bonds: "1", Helix_Index: "H1" }
    ],
    attachments: [
      { id: "att_3_1", name: "torsion_energy_report.pdf", type: "PDF", size: "310 KB", date: "2026-07-10" }
    ],
    timeline: [
      { id: "tl_3_1", event: "Created", date: "2026-07-10", author: "Alex Chen", desc: "Torsional shear matrices database initialized." },
      { id: "tl_3_2", event: "Imported", date: "2026-07-10", author: "Alex Chen", desc: "Imported AlphaFold structural vectors." },
      { id: "tl_3_3", event: "Archived", date: "2026-07-15", author: "Alex Chen", desc: "Moved dataset to long-term cold archive." }
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

    // Reset fields
    setImportName("");
    setImportDescription("");
    setImportResearchArea("");
    setImportSource("");
  };

  // Dashboard Stats calculation
  const stats = useMemo(() => {
    const total = datasets.length;
    const active = datasets.filter(d => d.status === "Active").length;
    const archived = datasets.filter(d => d.status === "Archived").length;

    // Sum rough sizes (for simulation)
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
        marginBottom: "24px",
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
              Enterprise Dataset Manager
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: T.text2 }}>
            Manage core genomics archives, reference databases, molecular simulations, and biological pipeline files.
          </p>
        </div>

        {/* Header Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => {
              setShowImportWizard(prev => !prev);
              triggerToast(showImportWizard ? "Closed import wizard." : "Import wizard opened.");
            }}
            style={{
              padding: "10px 18px",
              background: showImportWizard ? T.surf2 : `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              border: showImportWizard ? `1px solid ${T.border2}` : "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              boxShadow: showImportWizard ? "none" : `0 4px 14px ${T.accent}30`,
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>📥</span>
            <span>{showImportWizard ? "Back to Dashboard" : "Upload Dataset"}</span>
          </button>
        </div>
      </div>

      {/* ── IMPORT WIZARD (FULLY FUNCTIONAL FORM) ── */}
      {showImportWizard && (
        <div style={{
          background: T.surf,
          border: `1px solid ${T.border2}`,
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          animation: "slideIn 0.25s ease"
        }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 800 }}>Dataset Upload Form (LocalStorage)</h2>
          <p style={{ margin: "0 0 20px 0", fontSize: "0.82rem", color: T.text2 }}>
            Provide dataset parameters below to save and persist in the local system database workspace.
          </p>

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
                  <option value="PDF">PDF</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Estimated Size</label>
                <input
                  type="text"
                  value={importSize}
                  onChange={e => setImportSize(e.target.value)}
                  placeholder="e.g. 15.4 MB"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Record Count</label>
                <input
                  type="text"
                  value={importRecords}
                  onChange={e => setImportRecords(e.target.value)}
                  placeholder="e.g. 1,500"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Owner / Uploader</label>
              <input
                type="text"
                value={importOwner}
                onChange={e => setImportOwner(e.target.value)}
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Research Focus Area</label>
              <input
                type="text"
                value={importResearchArea}
                onChange={e => setImportResearchArea(e.target.value)}
                placeholder="e.g. Adaptive Alignment / Virology Maps"
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Data Source</label>
                <input
                  type="text"
                  value={importSource}
                  onChange={e => setImportSource(e.target.value)}
                  placeholder="e.g. NCBI GenBank"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>License Policy</label>
                <input
                  type="text"
                  value={importLicense}
                  onChange={e => setImportLicense(e.target.value)}
                  placeholder="e.g. CC0"
                  style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: T.text2, marginBottom: "6px", fontWeight: "bold" }}>Dataset Description</label>
              <textarea
                rows={3}
                value={importDescription}
                onChange={e => setImportDescription(e.target.value)}
                placeholder="Details about genome alignments or nucleotide records..."
                style={{ width: "100%", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px", color: T.text1, outline: "none", resize: "none", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" style={{ padding: "10px 20px", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Save Dataset</button>
              <button type="button" onClick={() => setShowImportWizard(false)} style={{ padding: "10px 20px", background: T.surf2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.text2, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── STATISTICS DASHBOARD ── */}
      {!showImportWizard && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "14px",
          marginBottom: "24px"
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

      {/* ── MAIN CONTENT GRID ── */}
      <div style={{
        display: "flex",
        gap: "24px",
        flexWrap: "wrap",
        flex: 1
      }}>
        {/* LEFT MAIN PANEL: Datasets Table & Explorer */}
        <div style={{
          flex: "2 1 600px",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Datasets Table Panel */}
          <div style={{
            background: T.surf,
            border: `1px solid ${T.border2}`,
            borderRadius: "16px",
            padding: "20px",
            boxSizing: "border-box"
          }}>
            {/* Filter controls */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "16px"
            }}>
              {/* Search bar */}
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 Search datasets by name or description..."
                style={{
                  flex: "1 1 200px",
                  background: T.surf2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: T.text1,
                  fontSize: "0.8rem",
                  outline: "none"
                }}
              />

              {/* Status filter dropdown */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: T.text1,
                    fontSize: "0.78rem"
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>

                {/* Category filter */}
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: T.text1,
                    fontSize: "0.78rem"
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="Genomics">Genomics</option>
                  <option value="Virology">Virology</option>
                  <option value="Proteomics">Proteomics</option>
                </select>

                {/* Owner filter */}
                <select
                  value={ownerFilter}
                  onChange={e => setOwnerFilter(e.target.value)}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: T.text1,
                    fontSize: "0.78rem"
                  }}
                >
                  <option value="All">All Owners</option>
                  <option value="Dr. Mei Lin">Dr. Mei Lin</option>
                  <option value="Sarah Kim">Sarah Kim</option>
                  <option value="Alex Chen">Alex Chen</option>
                </select>

                {/* Sort drop down */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: T.text1,
                    fontSize: "0.78rem"
                  }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                  <option value="updated">Sort by Updated</option>
                </select>
              </div>
            </div>

            {/* Datasets Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.78rem",
                textAlign: "left"
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T.border2}`, color: T.text2 }}>
                    <th style={{ padding: "10px" }}>Dataset Name</th>
                    <th style={{ padding: "10px" }}>Category</th>
                    <th style={{ padding: "10px" }}>Type</th>
                    <th style={{ padding: "10px" }}>Size</th>
                    <th style={{ padding: "10px" }}>Records</th>
                    <th style={{ padding: "10px" }}>Owner</th>
                    <th style={{ padding: "10px" }}>Status</th>
                    <th style={{ padding: "10px" }}>Version</th>
                    <th style={{ padding: "10px" }}>Last Updated</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDatasets.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: "30px", textTransform: "uppercase", textAlign: "center", color: T.text3 }}>
                        No datasets matched the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDatasets.map(ds => {
                      const isSelected = selectedDatasetId === ds.id;
                      const statusCol = ds.status === "Active" ? T.green : T.text3;
                      return (
                        <tr
                          key={ds.id}
                          style={{
                            borderBottom: `1px solid ${T.border}`,
                            background: isSelected ? `${T.accent}12` : "transparent",
                            cursor: "pointer",
                            transition: "background 0.15s"
                          }}
                          onClick={() => handleOpenDataset(ds.id)}
                        >
                          <td style={{ padding: "12px 10px", fontWeight: 700, color: T.text1 }}>{ds.name}</td>
                          <td style={{ padding: "12px 10px" }}>{ds.category}</td>
                          <td style={{ padding: "12px 10px", fontFamily: "monospace" }}>{ds.type}</td>
                          <td style={{ padding: "12px 10px" }}>{ds.size}</td>
                          <td style={{ padding: "12px 10px" }}>{ds.records}</td>
                          <td style={{ padding: "12px 10px" }}>{ds.owner}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <span style={{
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: `${statusCol}12`,
                              border: `1px solid ${statusCol}30`,
                              color: statusCol
                            }}>
                              {ds.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{ds.version}</td>
                          <td style={{ padding: "12px 10px" }}>{ds.lastUpdated}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <div style={{ display: "flex", gap: "6px" }} onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenDataset(ds.id)}
                                title="Open Explorer"
                                style={{
                                  background: T.surf2,
                                  border: `1px solid ${T.border2}`,
                                  color: T.cyan,
                                  padding: "3px 6px",
                                  borderRadius: "4px",
                                  cursor: "pointer"
                                }}
                              >
                                🔍
                              </button>
                              <button
                                onClick={() => handleDuplicateDataset(ds)}
                                title="Duplicate"
                                style={{
                                  background: T.surf2,
                                  border: `1px solid ${T.border2}`,
                                  color: T.yellow,
                                  padding: "3px 6px",
                                  borderRadius: "4px",
                                  cursor: "pointer"
                                }}
                              >
                                👥
                              </button>
                              <button
                                onClick={() => handleArchiveDataset(ds.id)}
                                title="Archive"
                                style={{
                                  background: T.surf2,
                                  border: `1px solid ${T.border2}`,
                                  color: T.red,
                                  padding: "3px 6px",
                                  borderRadius: "4px",
                                  cursor: "pointer"
                                }}
                              >
                                📁
                              </button>
                              <button
                                onClick={() => handleDeleteDataset(ds.id)}
                                title="Delete"
                                style={{
                                  background: T.surf2,
                                  border: `1px solid ${T.border2}`,
                                  color: T.red,
                                  padding: "3px 6px",
                                  borderRadius: "4px",
                                  cursor: "pointer"
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dataset Explorer: Data Preview Grid */}
          {selectedDataset && (
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "20px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "16px",
                borderBottom: `1px solid ${T.border}`,
                paddingBottom: "12px"
              }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 800 }}>
                    📂 Dataset Explorer: {selectedDataset.name}
                  </h3>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: T.text2 }}>
                      Format: <strong>{selectedDataset.type}</strong> | Rows: <strong>{filteredPreviewRows.length}</strong> (of {selectedDataset.records} total)
                    </span>
                  </div>
                </div>

                {/* Explorer search */}
                <input
                  type="text"
                  value={previewSearch}
                  onChange={e => {
                    setPreviewSearch(e.target.value);
                    setPreviewPage(0);
                  }}
                  placeholder="🔍 Search sample rows..."
                  style={{
                    background: T.surf2,
                    border: `1px solid ${T.border2}`,
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: T.text1,
                    fontSize: "0.75rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Grid Column Viewer / Preview Table */}
              <div style={{ overflowX: "auto", marginBottom: "12px" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.75rem",
                  textAlign: "left"
                }}>
                  <thead>
                    <tr style={{ background: T.surf2, color: T.text2 }}>
                      {(selectedDataset.columns || []).map(col => (
                        <th key={col} style={{ padding: "8px 10px", border: `1px solid ${T.border}` }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPreviewRows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${T.border}` }}>
                        {(selectedDataset.columns || []).map(col => (
                          <td key={col} style={{ padding: "8px 10px", border: `1px solid ${T.border}`, color: T.text2 }}>
                            {row[col] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination block */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.74rem",
                color: T.text2
              }}>
                <div>
                  Showing {paginatedPreviewRows.length} rows of {filteredPreviewRows.length} matched sample records.
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    disabled={previewPage === 0}
                    onClick={() => setPreviewPage(prev => prev - 1)}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      color: previewPage === 0 ? T.text3 : T.text1,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    ◀ Prev
                  </button>
                  <span style={{ alignSelf: "center", fontWeight: "bold" }}>
                    Page {previewPage + 1} of {Math.max(1, maxPreviewPages)}
                  </span>
                  <button
                    disabled={previewPage + 1 >= maxPreviewPages}
                    onClick={() => setPreviewPage(prev => prev + 1)}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border2}`,
                      color: previewPage + 1 >= maxPreviewPages ? T.text3 : T.text1,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT DRAWER / SIDE DETAILS COLUMN */}
        {selectedDataset && (
          <aside style={{
            flex: "1 1 350px",
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {/* Metadata Detail Card */}
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}>
              <h2 style={{
                margin: "0 0 16px 0",
                fontSize: "1.05rem",
                fontWeight: 800,
                borderBottom: `1px solid ${T.border2}`,
                paddingBottom: "10px"
              }}>
                📋 Metadata & Properties
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.8rem" }}>
                <div>
                  <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Dataset Name</label>
                  <div style={{ color: T.text1, fontWeight: "bold" }}>{selectedDataset.name}</div>
                </div>

                <div>
                  <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Description</label>
                  <div style={{ color: T.text2, lineHeight: 1.4 }}>{selectedDataset.description}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Research Area</label>
                    <div style={{ color: T.text2 }}>{selectedDataset.researchArea || "N/A"}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Owner</label>
                    <div style={{ color: T.text2 }}>{selectedDataset.owner}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Source</label>
                    <div style={{ color: T.text2 }}>{selectedDataset.source || "N/A"}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>License</label>
                    <div style={{ color: T.text2 }}>{selectedDataset.license || "N/A"}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Version</label>
                    <div style={{ color: T.text1, fontWeight: "bold" }}>{selectedDataset.version}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Status</label>
                    <div style={{ color: selectedDataset.status === "Active" ? T.green : T.text3 }}>{selectedDataset.status}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Record Count</label>
                    <div style={{ color: T.text1 }}>{selectedDataset.records}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", fontWeight: "bold" }}>Storage Used</label>
                    <div style={{ color: T.text1 }}>{selectedDataset.size}</div>
                  </div>
                </div>

                {/* Tags block */}
                <div>
                  <label style={{ fontSize: "0.65rem", color: T.text3, textTransform: "uppercase", display: "block", marginBottom: "6px", fontWeight: "bold" }}>Tags</label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {(selectedDataset.tags || []).map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: `${T.accent}15`,
                          border: `1px solid ${T.accent}30`,
                          color: T.accent
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Version History Card */}
            <div style={{
              background: T.surf,
              border: `1px solid ${T.border2}`,
              borderRadius: "16px",
              padding: "20px"
            }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", fontWeight: 800 }}>
                📜 Version History
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(selectedDataset.versions || []).map(ver => (
                  <div
                    key={ver.version}
                    style={{
                      background: T.surf2,
                      border: `1px solid ${T.border}`,
                      borderRadius: "8px",
                      padding: "10px",
                      fontSize: "0.74rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong style={{ color: T.cyan }}>{ver.version}</strong>
                      <span style={{ color: T.text3 }}>{ver.date}</span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: T.text2, marginBottom: "4px" }}>
                      By: <strong>{ver.author}</strong>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: T.text2 }}>{ver.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

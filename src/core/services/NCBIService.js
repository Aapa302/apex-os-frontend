/**
 * APEX OS NCBI Biological Data Service
 * Secure, reusable connection layer with the official National Center for Biotechnology Information (NCBI) API.
 * Supports configurations via environment variables and handles network failures, timeouts, and rate limits.
 */

// Read the VITE_NCBI_API_KEY from environment configurations safely (Vite standard)
const API_KEY = import.meta.env?.VITE_NCBI_API_KEY || "";

const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

/**
 * Robust fetch utility supporting AbortController timeouts and rate-limit parsing.
 */
async function ncbiFetch(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const urlObj = new URL(url);
  if (API_KEY) {
    urlObj.searchParams.set("api_key", API_KEY);
  }

  try {
    const response = await fetch(urlObj.toString(), {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.status === 429) {
      throw new Error("NCBI_RATE_LIMIT: Too many requests. Please verify your NCBI API Key or wait a moment.");
    }
    if (response.status === 403) {
      throw new Error("NCBI_FORBIDDEN: Invalid API Key or access restrictions applied.");
    }
    if (!response.ok) {
      throw new Error(`NCBI_HTTP_ERROR: Server returned code ${response.status} (${response.statusText})`);
    }

    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("NCBI_TIMEOUT: Request timed out. NCBI server failed to respond within 15 seconds.");
    }
    throw err;
  }
}

/**
 * Searches a specified NCBI database (gene, nucleotide, protein) for matching terms.
 */
export async function searchNCBIDatabase(db, term, retmax = 10) {
  if (!term || !term.trim()) {
    throw new Error("NCBI_INVALID_QUERY: Search keyword cannot be empty.");
  }

  // Construct search URL
  // Supports gene name, accession ID, organism, or keywords
  const searchUrl = `${BASE_URL}/esearch.fcgi?db=${db}&term=${encodeURIComponent(term)}&retmode=json&retmax=${retmax}`;

  try {
    const res = await ncbiFetch(searchUrl);
    const data = await res.json();
    const idList = data.esearchresult?.idlist || [];
    return idList;
  } catch (err) {
    console.error(`Error searching NCBI ${db}:`, err);
    throw err;
  }
}

/**
 * Search Gene Database
 */
export async function SearchGene(query) {
  return searchNCBIDatabase("gene", query);
}

/**
 * Search Nucleotide Database
 */
export async function SearchNucleotide(query) {
  return searchNCBIDatabase("nucleotide", query);
}

/**
 * Search Protein Database
 */
export async function SearchProtein(query) {
  return searchNCBIDatabase("protein", query);
}

/**
 * Fetches FASTA sequence format for a given sequence ID
 */
export async function FetchFASTA(accessionId) {
  if (!accessionId) throw new Error("NCBI_INVALID_ID: Accession ID is required.");
  const fetchUrl = `${BASE_URL}/efetch.fcgi?db=nucleotide&id=${encodeURIComponent(accessionId)}&retmode=text&rettype=fasta`;

  try {
    const res = await ncbiFetch(fetchUrl);
    const text = await res.text();
    if (!text.trim() || text.includes("Error") || text.includes("ID list is empty")) {
      throw new Error("NCBI_INVALID_SEQUENCE: No FASTA sequence found for the given accession ID.");
    }
    return text;
  } catch (err) {
    console.error("Error fetching FASTA:", err);
    throw err;
  }
}

/**
 * Fetches GenBank sequence format for a given sequence ID
 */
export async function FetchGenBank(accessionId) {
  if (!accessionId) throw new Error("NCBI_INVALID_ID: Accession ID is required.");
  const fetchUrl = `${BASE_URL}/efetch.fcgi?db=nucleotide&id=${encodeURIComponent(accessionId)}&retmode=text&rettype=gb`;

  try {
    const res = await ncbiFetch(fetchUrl);
    const text = await res.text();
    if (!text.trim() || text.includes("Error") || text.includes("ID list is empty")) {
      throw new Error("NCBI_INVALID_SEQUENCE: No GenBank record found for the given accession ID.");
    }
    return text;
  } catch (err) {
    console.error("Error fetching GenBank:", err);
    throw err;
  }
}

/**
 * Fetches metadata details (organism, name, etc.) for a given ID or array of IDs
 */
export async function FetchMetadata(accessionId, db = "nucleotide") {
  if (!accessionId) throw new Error("NCBI_INVALID_ID: Accession ID is required.");
  const summaryUrl = `${BASE_URL}/esummary.fcgi?db=${db}&id=${encodeURIComponent(accessionId)}&retmode=json`;

  try {
    const res = await ncbiFetch(summaryUrl);
    const data = await res.json();
    const resultDict = data.result || {};
    const meta = resultDict[accessionId] || resultDict[Object.keys(resultDict)[1]] || null;

    if (!meta) {
      throw new Error("NCBI_METADATA_ERROR: Could not retrieve metadata record from summary.");
    }

    return {
      id: accessionId,
      title: meta.title || "Unknown sequence",
      organism: meta.organism || "Unknown Organism",
      extra: meta
    };
  } catch (err) {
    console.error("Error fetching Metadata:", err);
    throw err;
  }
}

/**
 * Unified Config Check
 */
export function isNCBIConnected() {
  return {
    connected: true,
    apiKeyConfigured: !!API_KEY,
    apiKeyLength: API_KEY.length
  };
}

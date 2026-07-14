/**
 * Abstract interfaces and future-ready boundaries for external analytical/AI frameworks.
 * Stubs are prepared for Gemini, PubMed, NCBI, Crossref, Semantic Scholar, and OpenAlex.
 */

export class GeminiService {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
  }

  async generateMessage(prompt, systemInstruction = "") {
    console.warn("[Gemini API] Not integrated. Returning stubbed sequence response.");
    return {
      text: `Mock Gemini response for prompt: "${prompt.slice(0, 50)}..."`,
      tokensUsed: 140,
      confidence: 0.95
    };
  }
}

export class PubMedService {
  async searchArticles(query, limit = 5) {
    console.warn("[PubMed API] Not integrated. Returning abstract mock sequence.");
    return [
      { id: "PMID-3401201", title: `Mock study for alignment parameters in: "${query}"`, author: "Lin et al., 2026", journal: "Nature Genetics" }
    ];
  }
}

export class NCBIService {
  async fetchGeneSequence(geneId) {
    console.warn("[NCBI API] Not integrated. Returning abstract sequence.");
    return {
      geneId,
      sequence: "ATCGGCTAAGCTAGCTAGCTAGCCTAGCTA",
      organism: "Homo sapiens",
      assembly: "GRCh38"
    };
  }
}

export class CrossrefService {
  async fetchMetadata(doi) {
    console.warn("[Crossref API] Not integrated.");
    return {
      doi,
      title: "Crystalline Lattice vectors under stress structural constraints",
      publisher: "IEEE Transactions on Engineering"
    };
  }
}

export class SemanticScholarService {
  async getCitations(paperId) {
    console.warn("[Semantic Scholar API] Not integrated.");
    return {
      paperId,
      citationCount: 42,
      highlyInfluentialCitations: 3
    };
  }
}

export class OpenAlexService {
  async fetchConcepts(conceptId) {
    console.warn("[OpenAlex API] Not integrated.");
    return {
      conceptId,
      conceptName: "Quantum Decoupling Coherence Matrices",
      score: 0.985
    };
  }
}

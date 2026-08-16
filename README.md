# APEX OS — AI Company Operating System & DNA Simulation Workspace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)

**APEX OS** is an AI-powered autonomous company simulation platform and bio-digital workspace. It simulates an entire enterprise hierarchy—featuring an **AI CEO (APEX)**, specialized **AI department executives**, an **autonomous strategic execution engine**, a **multi-agent software build pipeline**, and a specialized **DNA Data Storage & Bio-Simulation Suite**.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [1. Executive AI Suite & Voice Mode](#1-executive-ai-suite--voice-mode)
  - [2. Autonomous Strategic Planner](#2-autonomous-strategic-planner)
  - [3. Multi-Agent Build Pipeline](#3-multi-agent-build-pipeline)
  - [4. Task Board & Workflows](#4-task-board--workflows)
  - [5. DNA Data Storage & Simulation Lab](#5-dna-data-storage--simulation-lab)
  - [6. Research Lab & NCBI Biological Integration](#6-research-lab--ncbi-biological-integration)
  - [7. Quality Assurance & Review System](#7-quality-assurance--review-system)
- [Architecture & Backend Proxy](#architecture--backend-proxy)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [License](#license)

---

## Overview

APEX OS reimagines corporate leadership and bio-digital engineering by combining high-level autonomous agent delegation with scientific simulation tools. Users interact with **APEX**, an executive AI CEO modeled with strategic clarity and technical depth, alongside 11 specialized AI department heads (CTO, Senior Engineer, PM, Marketing, CFO, HR, Sales, Customer Success, Designer, Data Analyst, Research Scientist).

Beyond conversational management, APEX OS contains an autonomous execution engine that translates user goals into structured multi-phase strategic plans, assigns tasks to relevant AI employees, generates production-ready software code, and runs tests on DNA data storage encoding/decoding models.

---

## Key Features

### 1. Executive AI Suite & Voice Mode
- **CEO Chat (APEX)**: Command-driven interface for high-level decision-making, task delegation, and strategic guidance.
- **Voice Conversation Mode**: Full hands-free interaction utilizing browser-native SpeechRecognition and SpeechSynthesis.
- **Wake-Word Activation & Barge-In**: Background listener for `"Hey APEX"` wake-word activation, with parallel audio monitoring for user speech interruption (`barge-in`) during TTS response playback.
- **Specialized AI Team**: 11 dedicated AI employees across Tech, Product, Marketing, Finance, Sales, HR, Design, Analytics, and Research.

### 2. Autonomous Strategic Planner
- **Goal-to-Execution Engine**: Enter high-level directives (e.g., *"Launch beta with 500 users in 30 days"*), and APEX automatically generates 4-phase execution plans.
- **Automatic Task Handoff**: Automatically distributes tasks to relevant team members, tracks dependencies, triggers reviews, and logs milestones.

### 3. Multi-Agent Build Pipeline
- **Autonomous Software Generation**: Converts natural language build requests into full, runnable codebases.
- **4-Stage Pipeline**:
  1. *Research Brief*: Technical requirements breakdown.
  2. *Software Architecture*: File/folder manifest creation.
  3. *Iterative Code Generation*: Full non-stubbed source code generation for every file.
  4. *CTO Code Review & QA*: Code quality scoring, issue detection, and automated revision passes.
- **Export Capabilities**: Client-side / server-side ZIP packaging and direct GitHub API repository export.

### 4. Task Board & Workflows
- **Interactive Kanban Board**: Complete CRUD management for task lifecycle tracking across `To Do`, `In Progress`, `Review`, and `Done` columns with drag-and-drop or column shifting.
- **Backend Task Persistence**: Real-time integration with backend task persistence endpoints.

### 5. DNA Data Storage & Simulation Lab
- **DNA Core Engine**: Conversion between digital text/files and DNA nucleotide streams (`A`, `T`, `C`, `G`) with GC-content balancing (40-60% target range).
- **Error Correction & Resilience**: XOR parity checksums, Triplication Redundancy error correction, and homopolymer de-noising filters.
- **Biometric Encryption Envelope**: Secure DNA streams under `BIO:` encrypted envelopes requiring biometric fingerprint/modal authorization.
- **Storage Architect & Local Simulation Lab**: Comparative benchmark matrices evaluating algorithms on storage density, encoding speeds, Levenshtein traceback error rates, and memory overhead.
- **File to DNA & Chunk Indexing**: Partitioning large files into 500-base indexed chunks with direct index-assisted chunk decoding.

### 6. Research Lab & NCBI Biological Integration
- **Live NCBI Services**: Real-time querying of official NCBI Entrez E-utilities (GenBank, PubMed, Gene, Protein databases).
- **FASTA Import & Execution**: Download, cache, and execute DNA storage algorithms against real genomic sequences (e.g., BRCA1, TP53, ACTB).
- **Research Memory System**: Structured citation, hypothesis, experiment, and research note persistence.

### 7. Quality Assurance & Review System
- **Automated AI Code & Output Reviews**: Automated evaluation of team outputs with scorecards (0-100), key strengths, gaps, and actionable recommendations.
- **Autonomous CEO Self-Test & Diagnostics**: Integrated `/autonomous-trigger` and `/autonomous-log` diagnostic tools for verifying background operations and decision logs.

---

## Architecture & Backend Proxy

The APEX OS architecture consists of two primary components:

1. **APEX OS Frontend** *(This Repository)*: React + Vite Single Page Application containing all UI views, voice engines, local simulation algorithms, and agent orchestration logic.
2. **APEX OS Backend Proxy** ([github.com/Aapa302/APEX-OS](https://github.com/Aapa302/APEX-OS)): Node.js / Express proxy server hosted on Render (`https://apex-os-nztm.onrender.com`).

```
┌───────────────────────────────────────┐
│           APEX OS Frontend            │
│  (React 18 + Vite + Web Speech API)   │
└───────────────────┬───────────────────┘
                    │
                    │ HTTP REST / Streams
                    ▼
┌───────────────────────────────────────┐
│           APEX OS Backend             │
│    (Node.js / Express Proxy / DB)     │
└─────────┬───────────────────┬─────────┘
          │                   │
          ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│ Google Gemini    │  │ NCBI E-utilities │
│ AI API           │  │ Services         │
└──────────────────┘  └──────────────────┘
```

> **Note**: The frontend operates resiliently; if the backend proxy is offline or unreachable, local offline fallback handlers handle core operations (DNA conversions, rule-based responses, and local storage state persistence).

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool / Bundler**: [Vite 5](https://vitejs.dev/)
- **Spreadsheet Processing**: [XLSX (SheetJS)](https://sheetjs.com/)
- **Voice Processing**: Browser Native SpeechRecognition & SpeechSynthesis APIs
- **Styling**: Pure CSS-in-JS design token system (Dark Theme Palette)
- **Data Persistence**: LocalStorage, IndexedDB (`ApexOS_v4`), and REST Endpoints

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aapa302/apex-os-frontend.git
   cd apex-os-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory (optional, sensible defaults are included in `App.jsx`):

```env
# Optional Backend Proxy URL override
VITE_PROXY_BASE_URL=https://apex-os-nztm.onrender.com

# Optional NCBI API Key for higher rate limits on NCBI Entrez queries
VITE_NCBI_API_KEY=your_ncbi_api_key_here
```

### Development Server

Start the Vite development server locally:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

To build the static application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

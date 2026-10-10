# Continuity — Project Continuity & Employee Handoff Platform

> *"We don't just transfer projects. We transfer the knowledge needed to continue them."*

Continuity is an AI-powered project continuity platform centered on structured employee-to-employee project handoffs. When an engineer leaves a project, changes teams, or takes leave, Continuity bridges the critical context gap by coupling immutable version snapshots with structured knowledge briefings, Architecture Decision Records (ADRs), runbooks, and grounded AI retrieval.

---

## 🚀 Quickstart & Running the App

### Requirements
- Node.js 18+
- npm / yarn / pnpm

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server (port 3000)
npm run dev

# 3. Build for production
npm run build
```

---

## 🧭 The Core User Journey (Interactive Demonstration)

To test the complete end-to-end handoff lifecycle:

1. **Start as Sarah Lin (Senior Staff Backend Engineer — Outgoing Owner):**
   - In the top-bar persona switcher, ensure `Sarah Lin` is active.
   - Open **Projects** $\rightarrow$ Click **Cloud Billing & Metering Service**.
   - Inspect the **Overview** (Architecture, ADRs like *PostgreSQL vs DynamoDB*, Risks), **Version History** (`v2.4.0-rc3`), **Tasks & Blockers** (Ticket *SEC-4912*), and **Files & Runbooks**.
   - Click **Start Handoff**: Choose recipient **Marcus Vance**, select pinned version `v2.4.0-rc3 (c8f912a)`, review the auto-compiled briefing, and dispatch.

2. **Switch to Marcus Vance (Backend Engineer — Inheriting Lead):**
   - Use the top-bar **Perspective Switcher** to switch to `Marcus Vance`.
   - Notice the notification counter on **Handoffs** indicating a pending review.
   - Open **Handoffs** or click the banner on the Overview dashboard.
   - Click **Inspect Package** on `HO-2026-089 (Cloud Billing & Metering Service)`.
   - Review the verified deliverables, active blockers, runbook commands, and recommended first 48 hours.

3. **Query the Grounded AI Project Assistant:**
   - Click **Ask AI Assistant** or switch to the **AI Assistant** tab.
   - Click suggested queries or ask:
     - *"How do I run and test this project?"*
     - *"What is currently unfinished and blocking deployment?"*
     - *"Why was PostgreSQL chosen over DynamoDB?"*
     - *"Which files implement Stripe webhook processing?"*
   - Observe responses backed by citations. Click any source chip to jump directly into the relevant workspace artifact.

4. **Formally Accept Responsibility:**
   - Return to the handoff package detail.
   - Click **Accept Responsibility**, add an optional sign-off note, and confirm.
   - The transfer is locked in the immutable audit log, and primary ownership is transferred to Marcus Vance.

---

## 🛠 Implemented Screens & Features

| View | Key Capabilities |
|---|---|
| **Overview Dashboard** | Real-time status cards, projects needing attention, pending handoffs awaiting your review, active projects list, and verified audit log. |
| **Projects List** | Search and filter by status (`Active`, `Transitioning`, `Review Needed`, `Stable`), modal to initialize new workspaces with baseline tags. |
| **Project Workspace** | Multi-tab inspection: Architecture summary, ADR decision logs, immutable version history timeline with diff stats, blocker tracking, and file manifests. |
| **Smart Handoff Flow** | 3-step wizard: (1) Select recipient & pin immutable snapshot hash, (2) Auto-compiled briefing review, (3) Summary confirmation. |
| **Handoffs Inbox** | Categorized view (`All`, `Received`, `Sent`, `Pending`, `Accepted`, `Completed`) with real-time status tags and search. |
| **Handoff Detail & Acceptance** | Version drift warnings, comprehensive 6-part knowledge package, clarification Q&A thread, JSON manifest export, and digital sign-off acceptance. |
| **Grounded AI Assistant** | Conversational assistant grounded in project files and ADRs. Includes source citation chips and explicit fallback when evidence is insufficient. |
| **Team Directory** | View colleagues, roles, squad assignments, project ownership, and local invite simulation. |
| **Settings & Governance** | Version pinning enforcement, automated secret scrubbing rules, and demo data reset. |

---

## 🔒 Trust & Reliability Safeguards

- **Immutable Version Pinning:** Handoffs are bound to a verified commit hash (`c8f912a`), preventing drift if newer commits land later.
- **Drift Warnings:** If active HEAD advances past the pinned handoff version, Continuity highlights a warning so the recipient knows newer commits exist.
- **Anti-Hallucination Grounding:** AI queries cite verified files and records, and explicitly decline when evidence is absent.
- **Secret Sanitization:** `.env` files, API keys, and credential stores are masked and excluded from public briefings.

---

## 📁 File Structure

```
src/
├── types/
│   └── index.ts                 # Core TypeScript types (Project, Handoff, Version, Task, ADR)
├── data/
│   └── mockData.ts              # Seed enterprise data (Billing service, SSO gateway, telemetry)
├── context/
│   └── AppContext.tsx           # Global state, actions, toast notifications, persona management
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Collapsible desktop/mobile navigation shell
│   │   └── TopBar.tsx           # Breadcrumbs, search, notification popover, persona switcher
│   ├── common/
│   │   ├── Badge.tsx            # Semantic status badges
│   │   └── Toast.tsx            # Animated notification alerts
│   ├── dashboard/
│   │   └── OverviewView.tsx     # Landing dashboard with pending action banners
│   ├── projects/
│   │   ├── ProjectsListView.tsx # Filterable projects catalog
│   │   ├── ProjectWorkspaceView.tsx # Workspace with 4 tabs (Overview, History, Tasks, Files)
│   │   └── CreateProjectModal.tsx   # Workspace registration modal
│   ├── handoffs/
│   │   ├── CreateHandoffModal.tsx   # 3-step structured handoff wizard
│   │   ├── HandoffsInboxView.tsx    # Handoffs inbox with filter tabs
│   │   ├── HandoffDetailView.tsx    # Knowledge briefing and digital acceptance
│   │   └── ClarificationModal.tsx   # Recipient clarification inquiry thread
│   ├── ai/
│   │   └── AiAssistantView.tsx  # Grounded chat engine with clickable source chips
│   ├── team/
│   │   └── TeamView.tsx         # Engineering directory & persona switcher
│   └── settings/
│       └── SettingsView.tsx     # Governance policies & prototype reset
├── App.tsx                      # Root component & view router
└── main.tsx                     # Entry point
```

---

## 🔮 Phase 2 Roadmap (Backend Integration)

In Phase 2, this frontend connects to:
- Node.js & Express API backend with PostgreSQL database.
- CLI tool (`continuity commit` / `continuity handoff`) for local Git repository integration.
- Vector database RAG pipeline for dynamic documentation indexing and LLM embeddings.
- GitHub / GitLab webhook listeners for automated snapshot verification.

# Gauntlet Project Order of Operations

**Purpose:**  
Provide a concise, outcome-driven roadmap for executing any Foundry Core project — from requirements through final submission.

---

## 0️⃣ Requirements & Documentation
- Add project assignment and requirements files to `/docs/requirements/`.
- Identify success criteria, rubric expectations, and deliverables.
- Store all official PDFs, notes, and project docs.

---

## 1️⃣ Project Setup
**Goal:** Create the repo, link it locally, and confirm a working baseline.  
**Steps:**
1. Create repository.
2. Create local folder.
3. Connect local folder to repository.
4. Install dependencies and run `pnpm dev`.
5. Verify localhost builds successfully.

---

## 2️⃣ Foundation Documents
**Goal:** Establish architecture, PRD, and development strategy.  
**Steps:**
1. Generate PRD in Ask Mode.  
2. Create architecture document.  
3. Build development checklists.  
4. Store all in `/docs/foundation/`.

---

## 3️⃣ Build Super Modules
**Goal:** Implement grouped feature sets using super-phases.  
**Steps:**
1. Use super-phase prompts (`Plan`, `Build`, `Reflect`).  
2. Capture behavioral verification where possible.  
3. Ensure each super module compiles and passes verification.

**Notes:**  
- Write all in-progress phase outputs to `/docs/operations/phases/recent/`.  
- When a phase is completed or superseded, move related artifacts from `/recent/` to `/archive/`.

---

## 4️⃣ Review for Submission
**Goal:** Validate and finalize work against rubric and functional tests.  
**Steps:**
1. Run rubric verification.  
2. Fix and re-test issues.  
3. Confirm all artifacts and documentation are complete.

---

## 5️⃣ Deploy
**Goal:** Ensure deployment is stable and linked to environment variables.  
**Steps:**
1. Configure deployment (e.g., Vercel, AWS).  
2. Verify live build works with production keys.

---

## 6️⃣ Submit & Showcase
**Goal:** Finalize the project and present deliverables.  
**Steps:**
1. Generate development log.  
2. Record professional showcase video.  
3. Submit via Gauntlet portal.  
4. Archive evidence and phase reports.

---

## 7️⃣ Continuous Improvement
**Goal:** Review system performance and refine Foundry Core.  
**Steps:**
1. Reflect on process efficiency and blockers.  
2. Update prompts, workflows, or structure for future projects.

---

## Workflow Overview
```mermaid
flowchart TD
  A[Requirements & Docs] --> B[Project Setup]
  B --> C[Foundation Docs]
  C --> D[Build Super Modules]
  D --> E[Review for Submission]
  E --> F[Deploy]
  F --> G[Submit & Showcase]
  G --> H[Continuous Improvement]
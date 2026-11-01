# Track II — Course State and Continuation Record

**Last updated:** 2026-10-16  
**Governing specification:** `Track_II_Content_Engineering_Specification.md`, v1.4  
**Current phase:** First content batch drafted; validation and owner review required before approval.  
**Context-budget status:** The generation batch was deliberately scoped to Week 1 plus prerequisite planning/governance files. No 40% stop gate was triggered. Do not assume the same scope for a future batch; assess it independently before authoring.

## 1. Confirmed curriculum contract

- Learners have basic programming and command-line familiarity; no production DevOps background is assumed.
- Main workload is one evolving React SPA + Python FastAPI API monorepo; the ASP.NET Core version is an optional comparative extension, not a second mandatory track.
- Local-first learning, then real AWS EKS labs.
- 18 weeks with 45.5 hours / 2,730 minutes of instructor-led teaching content, excluding lab execution.
- Separate Markdown lesson and lab files.
- Every generation batch must remain below 40% of the usable context window. A module can span sessions; never exceed the limit to finish it.
- Every batch updates this state file and `quality-ledger.md` with actual authored, reviewed, executed and approved status.
- Source-backed claims, exact pinned versions, complete novice-ready steps, evidence-first diagnosis and explicit disclosure of unexecuted tests are mandatory.
- The module cannot be marked approved while critical reproducibility/validation defects remain.

## 2. Current coverage

### Teaching content

- Planned teaching content denominator: **2,730 minutes / 45.5 hours**.
- Authored teaching content (draft): **150 / 2,730 minutes = 5.49%**.
- Approved teaching content: **0 / 2,730 minutes = 0%**.
- The 150 drafted minutes are Week 1's three detailed lesson files, with allocated durations of 45 + 55 + 50 minutes. The time allocation has been checked arithmetically; the lesson content has not been owner-approved.
- No outlines or maps are counted as authored teaching minutes.

### Labs

- Planned lab denominator in the draft course map: **36 lab files** (two per week); denominator remains provisional until the course map is approved.
- Labs authored: **2 / 36 planned = 5.56%**, provisional denominator.
- Labs fully source-reviewed and owner-approved: **0**.
- Labs executed against the exact pinned target versions: **0**.
- Browser end-to-end lab executions: **0**.
- AWS/EKS lab executions: **0**.
- Planned Week 1 lab effort: **180 minutes** separate from teaching time.
- Planned all-course lab effort in the draft map: **3,390 minutes / 56.5 hours**, estimate only, excluded from teaching denominator.

## 3. Artifacts and statuses

| Artifact | Path | Current status | Critical notes / next action |
|---|---|---|---|
| Governing specification | `/mnt/data/Track_II_Content_Engineering_Specification.md` | Active v1.4 | Administrative status update only; rules unchanged. |
| Environment matrix | `Track_II_Production_Engineering/environment-matrix.md` | Draft, Week 1 runtime versions source-checked | Python/Node/React/Vite/FastAPI pins proposed. Exact lockfiles absent; OS baseline unconfirmed; later Docker/Kubernetes/AWS/EKS versions are not locked. |
| Course map | `Track_II_Production_Engineering/course-map.md` | Draft | 18 teaching allocations sum to 2,730 minutes; 40 lesson IDs and 36 lab IDs planned; 3,390 lab minutes estimated. Owner review pending. |
| Week 1 module README | `week-01-groundops/README.md` | Draft | Sets scope, outcomes, lesson flow and local architecture. |
| GRO-L01 | `week-01-groundops/lessons/GRO-L01-human-infrastructure-layer.md` | Draft/source-backed | 45 teaching minutes; owner review pending. |
| GRO-L02 | `week-01-groundops/lessons/GRO-L02-trace-the-full-stack-request.md` | Draft/source-backed | 55 teaching minutes; browser request trace not executed. |
| GRO-L03 | `week-01-groundops/lessons/GRO-L03-evidence-first-operations.md` | Draft/source-backed | 50 teaching minutes; owner review pending. |
| GRO-LAB01 | `week-01-groundops/labs/GRO-LAB01-run-and-trace-the-request.md` | Draft | Exact target-version clean install/build and browser E2E remain untested. |
| GRO-LAB02 | `week-01-groundops/labs/GRO-LAB02-diagnose-the-broken-request-path.md` | Draft | Three injected failure cases are described but not executed end-to-end. |
| Starter app | `starter-app/` | Draft | `uv.lock` and `package-lock.json` absent. A release maintainer must generate/commit them after successful target-version validation. |
| Quality ledger | `Track_II_Production_Engineering/quality-ledger.md` | Current | Lists execution evidence, actual environment, blockers and gate decisions. |

## 4. Actual checks performed in this batch

### Backend in-process smoke check — PASS only for the authoring environment

Using FastAPI's `TestClient`, these checks passed:

1. `GET /health` returned HTTP 200 and `{"status":"ok"}`.
2. `GET /api/status` returned HTTP 200 and the expected JSON fields/values.
3. Allowed origin `http://127.0.0.1:5173` returned a matching `Access-Control-Allow-Origin` header.
4. Disallowed origin `http://localhost:5173` did not receive that allow-origin header.

Actual authoring environment: Python 3.13.5, FastAPI 0.128.2, Starlette 0.50.0. It differs from the planned baseline Python 3.14.8 / FastAPI 0.143.2 / Uvicorn 0.54.0. This was an in-process test, not a Uvicorn process or a browser. Do not use it as evidence that the proposed pins work.

### Frontend static checks — partial

- `package.json` parsed as valid JSON and contained the explicit direct version pins.
- `vite.config.js` passed `node --check` under the authoring container's Node 22.16.0.
- No npm package installation, Vite build, JSX compilation or browser test was performed.
- An earlier capture reported npm 10.9.0; the latest `npm --version` check reported 10.9.2. Both are authoring-environment observations and differ from the proposed Node 24.22.0/npm 11.19.1 baseline.

### Not performed

- No target-version dependency install or lockfile generation.
- No `uv sync --locked`, `npm ci`, or production build.
- No browser DevTools request capture and no execution of LAB01 or LAB02.
- No Docker, local Kubernetes, AWS or EKS tests/resources.
- No claim of independent instructor/SME approval.

An authoring-shell quoting error while creating a lab file was corrected. The incidental shell output was not a lab execution and was explicitly excluded from test evidence.

### Latest batch checks and correction

- Re-ran the backend in-process smoke checks; they passed in the authoring environment (Python 3.13.5, FastAPI 0.128.2, Starlette 0.50.0), not the target pins.
- Re-ran Python bytecode compilation and `node --check`; both passed. Rechecked Markdown non-empty/no-null-byte integrity (13 files) and frontend package JSON/direct pins.
- Statically corrected lab terminal-location instructions; no end-to-end lab run is claimed.
- Reconciled Week 1 teaching timings (45 + 55 + 50 = 150 minutes) and course-map planned totals (2,730 teaching minutes; 3,390 estimated lab minutes). Static integrity checks covered 13 Markdown files and the 22-file draft content tree.
- Refreshed the official Node 24 archive. Node 24.22.0 lists npm 11.19.1; the prior 11.9.0 value was a matrix typo, now corrected. This is source verification only, not execution of Node 24.22.0/npm 11.19.1.

## 5. Open decisions and blockers

1. **Learner OS:** primary OS remains unconfirmed. The current default is Bash-first and assumes Ubuntu on WSL2 for Windows users, with macOS/native Linux notes to be validated.
2. **Week 1 lockfiles:** generate, inspect and commit `starter-app/backend/uv.lock` and `starter-app/frontend/package-lock.json` only after the proposed pins can be installed and built successfully.
3. **Target-version execution:** verify backend with the target pins, run a frontend production build, test a clean install/replay, and execute the baseline and all three failure scenarios in a real browser.
4. **Review:** the user/course owner must review Week 1 after technical validation. Do not begin Week 2 lesson authoring until Week 1 is accepted or the user explicitly changes the sequence.
5. **Environment matrix:** later Docker, local Kubernetes, `kubectl`, AWS CLI, EKS version, ingress/load-balancing integration and observability stack remain to be researched/locked before corresponding lab authoring.

## 6. Next action (do not skip)

**Run a targeted Week 1 validation pass before writing Week 2:** confirm the cohort OS, install the exact source-checked versions, produce and commit both lockfiles, build the React app, run the API under the target dependency pins, exercise the baseline request in a browser, inject/fix all three failure scenarios, and record environment/output evidence in the quality ledger. If execution is unavailable in the current environment, report the lab as unexecuted rather than simulating success. Then request owner review of the Week 1 drafts.

## 7. Continuation prompt

> Continue Track II DevOps and Cloud Production Engineering using `Track_II_Content_Engineering_Specification.md` v1.4 and this `Track_II_Course_State.md` as governing state. Do not regenerate existing approved content; currently no lesson or lab has been approved. One evolving React SPA + Python FastAPI monorepo is the main workload; ASP.NET Core remains an optional comparison. The course has 2,730 planned teaching minutes over 18 weeks, excluding labs. Week 1 GroundOps has three draft lessons totaling 150 minutes and two draft labs planned for 180 minutes. Draft teaching coverage is 150/2,730 minutes (5.49%); approved coverage is 0%. The draft map proposes 36 lab files and 3,390 lab minutes, both provisional until the map is approved. The environment matrix source-checks Python 3.14.8, FastAPI 0.143.2, Uvicorn 0.54.0, Node 24.22.0/npm 11.19.1, React 19.3.1, Vite 8.3.4 and @vitejs/plugin-react 6.1.2, but the exact lockfiles are absent and the target toolchain/browser labs have not been run. One backend smoke check passed only on the authoring container's different Python 3.13.5/FastAPI 0.128.2/Starlette 0.50.0. Frontend package JSON and Vite config static checks passed, but no install/build/browser test occurred. First confirm the learner OS baseline and execute the Week 1 validation pass: create/commit lockfiles only after successful resolution/build, run the React production build, run the API on target pins, record browser Network/Console evidence, execute and repair the three deliberate failures, and update the quality ledger. Do not start Week 2 lesson authoring until Week 1 is reviewed. Maintain the strict 40% usable-context stop rule for each generation batch; if continuing would breach it, stop, update this state and the quality ledger, provide a fresh-chat handoff prompt and ask the user to start another chat. Update state after every generation/review/validation batch, count authored and approved content separately, and never claim execution that did not occur.

# Track II — Quality Ledger

**Last updated:** 2026-10-16  
**Status:** Active; Week 1 draft batch created. No course lesson or lab is approved for release.  
**Governing specification:** `Track_II_Content_Engineering_Specification.md` v1.4 (administrative status update only; generation policy unchanged).

## 1. Current blockers (must be resolved before release)

1. **The target lockfiles are absent.** `starter-app/backend/uv.lock` and `starter-app/frontend/package-lock.json` must be generated with the proposed pins, reviewed, and committed after a successful install/build. Until then, a clean replay is not established.
2. **Target-version validation is incomplete.** The code was smoke-tested only against the different Python/FastAPI versions installed in the authoring container. The selected Python 3.14.8 + FastAPI 0.143.2 + Uvicorn 0.54.0 target combination has not been executed here.
3. **Frontend build validation is incomplete.** `package.json` is valid JSON and `vite.config.js` passed `node --check` under the container's Node 22.16.0, but Vite/React packages were not installed, JSX was not compiled, `npm run build` was not executed, and `npm ci` was not tested.
4. **Browser end-to-end tests are not executed.** No browser Network/Console captures have been produced for the baseline request or the three injected failures.
5. **Operating system is not cohort-confirmed.** Bash-first / WSL2 is still a working assumption. macOS and native Linux compatibility checks remain open.
6. **External review remains pending.** The teaching content and lab design have not yet been independently reviewed by the course owner or another senior production engineer.

## 2. Artifact ledger

Status terms: **Draft** means content exists; **Source-checked** means the relevant primary source has been consulted; **Static-reviewed** means the local text/code/structure has been inspected; **Executed** requires actual execution evidence; **Approved** requires all relevant gates and owner review.

| ID | Artifact | Source status | Static/content status | Execution status | Release status / next action |
|---|---|---|---|---|---|
| SPEC-01 | `Track_II_Content_Engineering_Specification.md` | Governing policy | Updated to reflect work begun; policy unchanged | N/A | Active; v1.4 is administrative version/status update. |
| ENV-01 | `environment-matrix.md` | Source-checked for Week 1 versions | Draft; later Kubernetes/AWS tooling still open | No target toolchain installation test | Draft; close pins and OS support before relevant labs are approved. |
| MAP-01 | `course-map.md` | Course sources listed as anchors | Teaching-hour and proposed lab-minute totals checked; 36 lab IDs planned | N/A | Draft; user/owner review required. Lab denominator is provisional until map approval. |
| GRO-README | `week-01-groundops/README.md` | Core linked sources reviewed | Draft | N/A | Draft; review after lesson/lab technical validation. |
| GRO-L01 | `lessons/GRO-L01-human-infrastructure-layer.md` | Google SRE and Vite sources linked | Draft, instructional timings total 45 min | N/A | Draft; owner review pending. |
| GRO-L02 | `lessons/GRO-L02-trace-the-full-stack-request.md` | MDN HTTP/CORS, FastAPI and Google SRE sources linked | Draft, instructional timings total 55 min | No browser trace executed | Draft; verify request/CORS wording against real lab behavior. |
| GRO-L03 | `lessons/GRO-L03-evidence-first-operations.md` | MDN, FastAPI, Vite, GitHub and Google SRE sources linked | Draft, instructional timings total 50 min | N/A | Draft; owner review pending. |
| GRO-LAB01 | `labs/GRO-LAB01-run-and-trace-the-request.md` | Official FastAPI, MDN, uv and Vite sources linked | Draft; procedure inspected; lockfile release blocker documented | Target-version install/build/browser E2E not executed | Not approved. |
| GRO-LAB02 | `labs/GRO-LAB02-diagnose-the-broken-request-path.md` | Official MDN, FastAPI and Vite sources linked | Fault logic reviewed conceptually | Three faults not executed end-to-end | Not approved. |
| APP-API | `starter-app/backend/main.py` | FastAPI CORS/request-response sources linked in lab content | Static-reviewed | Four in-process smoke checks **passed** with authoring-container Python 3.13.5, FastAPI 0.128.2 and Starlette 0.50.0. This is not the proposed target version and is not a browser test. | Not approved; rerun in pinned environment. |
| APP-FE | `starter-app/frontend/` | React/Vite package sources linked in matrix | `package.json` valid JSON; `vite.config.js` passed `node --check` under Node 22.16.0 | Package installation and production build not executed | Not approved; create lockfile and test under Node 24.22.0. |

## 3. Executed checks — precise scope

### Check group A: backend unit/smoke-level checks

The following checks were run through FastAPI's in-process `TestClient` in the authoring container:

- `/health` returned HTTP 200 with `{"status":"ok"}`.
- `/api/status` returned HTTP 200 with the four expected fields and values.
- The configured allowed origin `http://127.0.0.1:5173` received the matching `Access-Control-Allow-Origin` header.
- The unapproved origin `http://localhost:5173` received no `Access-Control-Allow-Origin` header.

**Environment used:** Python 3.13.5; FastAPI 0.128.2; Starlette 0.50.0. The container also reported Uvicorn 0.48.0 and Node 22.16.0. An earlier capture reported npm 10.9.0; the latest `npm --version` check returned 10.9.2. Both are authoring-environment observations and differ from the proposed Node 24.22.0/npm 11.19.1 course baseline. Tests were in-process, not a running Uvicorn process and not a real browser.

### Check group B: frontend metadata/config checks

- `package.json` parsed as valid JSON and the direct versions matched the file's intended pins.
- `vite.config.js` passed `node --check` under Node 22.16.0.

These checks do not prove package installation, React JSX compilation, Vite production build, browser operation or compatibility with the proposed Node 24.22.0 baseline.

### Not executed

- No `uv sync` against Python 3.14.8 / FastAPI 0.143.2 / Uvicorn 0.54.0.
- No `npm install`, `npm ci`, `npm run build`, or frontend package resolution.
- No browser click-through, DevTools capture or end-to-end check.
- No execution of the deliberate wrong-port, stopped-API or wrong-origin lab scenarios.
- No Docker, Kubernetes, EKS, AWS, billable resource or cloud operation.

An authoring-shell quoting mistake was corrected while creating the lab guide. Incidental shell output from that document-generation failure is **not** test evidence and has not been counted as a lab run.

## 4. Source-quality review

Important implementation claims are grounded in primary product documentation or the applicable web-platform guidance:

- [FastAPI First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [MDN HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [Vite environment variables and modes](https://vite.dev/guide/env-and-mode)
- [uv locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/)
- [GitHub Actions secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Postmortem Culture](https://sre.google/workbook/postmortem-culture/)

A citation's presence supports only the specific linked claim; it is not evidence that the entire file or lab has been executed, independently endorsed, or approved.

## 4A. Additional checks in the current generation batch

- Re-ran the backend in-process smoke checks against the same authoring-container environment; `/health`, `/api/status`, allowed-origin CORS and disallowed-origin CORS assertions passed. This remains **not** a target-version, Uvicorn-process or browser test.
- Re-ran Python bytecode compilation for `starter-app/backend/main.py` and `node --check` for `starter-app/frontend/vite.config.js`; both passed in the current authoring environment.
- Rechecked all Markdown artifacts for non-empty content and null bytes; 13 Markdown files passed. Parsed `package.json` and checked the direct React/Vite pins; passed.
- Reconciled file-level lesson timings: GRO-L01 = 45 min, GRO-L02 = 55 min, GRO-L03 = 50 min (150 min total). Rechecked the planned course totals: 2,730 teaching minutes and 3,390 separate estimated lab minutes. These remain plan/draft totals, not evidence that the whole course has been authored.
- Statically reviewed the lab commands and corrected terminal working-directory instructions. The CORS scenario now avoids a redundant `cd backend` when the Uvicorn terminal is already in that directory.
- Re-checked the official Node 24 archive. For Node 24.22.0 it lists npm 11.19.1; corrected the earlier matrix typo of npm 11.9.0. This source check does not imply that Node/npm were installed or exercised at the target versions.

## 5. Gate decisions

| Gate | Current result | Reason |
|---|---|---|
| G1 — Scope and learning outcomes | Partial pass | Week 1 is scoped to the course thread; owner review pending. |
| G2 — Source and technical claims | Partial pass | Sources checked and linked; target-version behavior not fully tested. |
| G3 — Reproducibility | Fail / blocker | Required lockfiles absent; clean replay not tested. |
| G4 — Safety and operational risk | Partial pass | Local-only labs, no secrets/cloud resources; procedure execution not verified. |
| G5 — Execution and expected evidence | Fail / blocker | No target-version or browser end-to-end execution. |
| G6 — Novice clarity and completeness | Draft pending review | Detailed steps and acceptance criteria are present; learner walk-through not yet observed. |
| G7 — Owner review / release | Not started | Await content-owner review after technical blockers are addressed. |

**Current decision: NOT APPROVED FOR RELEASE.** This does not mean the drafts are unusable for review; it means the evidence requirements for a released learning module are not complete.

# Track II — DevOps and Cloud Production Engineering

## Current generation batch: Week 1 GroundOps

This bundle contains the initial environment matrix and course map, Week 1 GroundOps lessons/labs, starter React + FastAPI application, quality ledger, and the governing specification/course state.

## Start here

1. `Track_II_Content_Engineering_Specification.md` — governing instructions and quality contract.
2. `Track_II_Course_State.md` — current coverage, execution evidence, blockers and exact next action.
3. `quality-ledger.md` — file-level status, real checks completed and validation still required.
4. `environment-matrix.md` — proposed Week 1 versions and open decisions.
5. `course-map.md` — teaching minutes, lesson/lab IDs and separate lab effort.
6. `week-01-groundops/README.md` — Week 1 teaching and lab sequence.

## Week 1 content

### Instructor-led lessons (150 minutes total, exclusive of labs)

- `week-01-groundops/lessons/GRO-L01-human-infrastructure-layer.md` — 45 minutes.
- `week-01-groundops/lessons/GRO-L02-trace-the-full-stack-request.md` — 55 minutes.
- `week-01-groundops/lessons/GRO-L03-evidence-first-operations.md` — 50 minutes.

### Hands-on labs (180 minutes estimated; not included in the teaching total)

- `week-01-groundops/labs/GRO-LAB01-run-and-trace-the-request.md` — 90 minutes.
- `week-01-groundops/labs/GRO-LAB02-diagnose-the-broken-request-path.md` — 90 minutes.

### Starter source

- `starter-app/backend/` — FastAPI API.
- `starter-app/frontend/` — React + Vite frontend.

## Important status

All Week 1 materials are **drafts, not approved for release**. The backend routes/CORS behavior passed an in-process smoke check on the authoring container's older/different Python/FastAPI versions. The exact target toolchain, lockfiles, frontend build, browser E2E and three deliberate failure scenarios have not yet been executed. These limitations are documented in `quality-ledger.md` and `Track_II_Course_State.md`.

The proposed course OS baseline is still not confirmed by the audience. Do not claim support for every OS before testing it.

# GroundOps Week 1 — Starter Application

This is a deliberately small **local training** application: a React SPA served by Vite and a FastAPI API served by Uvicorn. It exists to make the request path observable; it is not a production-ready template.

## Components

- `frontend/`: React + Vite browser UI.
- `backend/`: FastAPI API with `/health` and `/api/status`.
- CORS default: only `http://127.0.0.1:5173` is allowed to read the API response from browser JavaScript.
- API URL default: `http://127.0.0.1:8000`. It is an endpoint URL and intentionally not a credential.

## Important draft limitation

The exact direct package versions are recorded in [package.json](frontend/package.json) and [pyproject.toml](backend/pyproject.toml). This generated bundle does **not** include `package-lock.json` or `uv.lock`. For a one-off exploratory run, `npm i` (short for `npm install`) in `frontend/` and `uv sync` in `backend/` create the respective lockfiles locally. For a cohort release, the maintainer must validate the pinned baseline, commit both lockfiles, and make learners use `npm ci` and `uv sync --locked`. Until then, this starter is a draft rather than an approved reproducible release.

## New to Python or React? Start here

Follow [LAB01's beginner setup and run instructions](../week-01-groundops/labs/GRO-LAB01-run-and-trace-the-request.md#0-first-time-using-python-react-or-a-terminal) before running commands. It covers tool installation, terminal basics, making a working copy, installing Python and frontend packages, running two servers, checking the browser, and stopping/resuming safely.

The source is already provided: do not create another React project or install FastAPI globally. After verifying the lab's tool versions, use the appropriate install command **inside the indicated working-copy folder**:

| Folder | First-time draft setup (lockfile absent) | Later clean install (lockfile present) |
|---|---|---|
| `backend/` | Select Python as shown in LAB01, then `uv sync` to create `uv.lock` and `.venv/`. | `uv sync --locked` |
| `frontend/` | `npm i` to create `package-lock.json` and `node_modules/`. | `npm ci` |

**Do not run `npm ci` before generating or receiving `package-lock.json`.** A successful `npm i` already installs the packages; next run `npm run dev`, not another install. Preserve supplied lockfiles and stop on installation errors rather than deleting them or changing versions.

The first-time commands are for this unlocked draft. If an approved locked course pack is missing a lockfile, request the complete pack instead of generating a replacement.

## Expected local endpoints

- Frontend: `http://127.0.0.1:5173`
- API status: `http://127.0.0.1:8000/api/status`
- API health: `http://127.0.0.1:8000/health`
- FastAPI interactive docs: `http://127.0.0.1:8000/docs`

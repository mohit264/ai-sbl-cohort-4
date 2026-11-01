# GroundOps Week 1 — Starter Application

This is a deliberately small **local training** application: a React SPA served by Vite and a FastAPI API served by Uvicorn. It exists to make the request path observable; it is not a production-ready template.

## Components

- `frontend/`: React + Vite browser UI.
- `backend/`: FastAPI API with `/health` and `/api/status`.
- CORS default: only `http://127.0.0.1:5173` is allowed to read the API response from browser JavaScript.
- API URL default: `http://127.0.0.1:8000`. It is an endpoint URL and intentionally not a credential.

## Important draft limitation

The exact direct package versions are recorded in `package.json` and `pyproject.toml`. This generated bundle does **not** include `package-lock.json` or `uv.lock`, because those files must be resolved and checked after the exact target versions are installed and built. For a one-off exploratory run, `npm install` and `uv sync` create lockfiles locally. For a cohort release, the maintainer must validate the pinned baseline, commit both lockfiles, and make learners use `npm ci` and `uv sync --locked`. Until then, this starter is a draft rather than an approved reproducible release.

## Expected local endpoints

- Frontend: `http://127.0.0.1:5173`
- API status: `http://127.0.0.1:8000/api/status`
- API health: `http://127.0.0.1:8000/health`
- FastAPI interactive docs: `http://127.0.0.1:8000/docs`

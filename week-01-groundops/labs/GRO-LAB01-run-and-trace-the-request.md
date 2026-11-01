# GRO-LAB01 — Run the Application and Trace One Request

**Planned learner time:** 90 minutes, separate from the 150-minute teaching allocation.  
**Status:** Draft; source-checked, not approved. Exact pinned-version build and clean replay are not yet verified.  
**Lab type:** Baseline build/run and evidence collection.  
**Risk:** Local-only. No AWS resources, external credentials or billable cloud services are required.

## Objective

Start the React frontend and FastAPI API independently, exercise one user action, and produce evidence for each boundary in the request path. The goal is not only to see a green UI; it is to explain which observation supports each claim.

## Learning outcomes

By completion you should be able to:

- identify the repository component and command responsible for each process;
- verify the Python and Node toolchains instead of assuming a prerequisite is installed;
- start the API and frontend in separate terminals;
- prove the API route is reachable using `curl -i`;
- inspect the browser request URL, status and response headers;
- explain what direct API success does and does not prove about the browser path;
- capture a reproducible evidence record and stop processes cleanly.

## Prerequisites

- Bash shell. On Windows use Ubuntu in WSL2 for the lab; do not run half the commands in PowerShell and half in Bash.
- Python tooling: `uv`. The source-checked baseline is CPython 3.14.8.
- Node.js 24.22.0 with npm 11.19.1 as proposed in `environment-matrix.md`.
- A current Chromium-based browser with DevTools.
- `curl` available in the shell.
- The `starter-app/` folder in this content bundle.
- Permission to create a working copy in a writable local directory. Record the absolute path so separate terminal sessions use the same project.

> **Reproducibility status:** this draft includes exact direct dependency versions but not the generated Python and npm lockfiles. The first local run resolves and writes lockfiles. A course release must build successfully, commit `uv.lock` and `package-lock.json`, and change clean setup to `uv sync --locked` and `npm ci`. Do not describe this draft as a fully locked/replay-verified release yet.

## Timebox

| Step | Time |
|---|---:|
| 1. Inspect toolchain and starter structure | 10 min |
| 2. Resolve dependencies and start the API | 20 min |
| 3. Start the frontend | 15 min |
| 4. Verify the API directly | 10 min |
| 5. Trace the browser request | 20 min |
| 6. Record evidence and clean up | 15 min |

## Step 1 — Create your working copy

Choose a writable working directory that contains the supplied `starter-app/` folder. In the terminal, navigate to that parent directory first. Confirm you are in the expected location:

```bash
pwd
test -d starter-app && echo 'starter-app found'
```

If the second command does not print `starter-app found`, stop and navigate to the directory that actually contains the `starter-app/` folder; do not run the copy command from an unknown location. Then create the working copy:

```bash
cp -R starter-app groundops-week-01
cd groundops-week-01
pwd
find . -maxdepth 3 -type f -not -path '*/node_modules/*' -not -path '*/.venv/*' | sort
```

Record the absolute directory printed by `pwd`. You will need it when opening separate terminal windows below. This prevents an easy novice mistake: assuming that every new terminal starts in the same directory.

Expected source paths include:

```text
./.gitignore
./README.md
./backend/main.py
./backend/pyproject.toml
./frontend/index.html
./frontend/package.json
./frontend/vite.config.js
./frontend/src/App.jsx
./frontend/src/main.jsx
./frontend/src/style.css
```

**Why:** begin from a known source tree. The `find` output is evidence of what files are actually present, not proof that they execute correctly.

## Step 2 — Check the toolchain before running anything

```bash
python3 --version
uv --version
node --version
npm --version
curl --version | head -n 1
```

Compare results against `environment-matrix.md`. If a version differs, do not quietly continue and later claim the target baseline was tested. Record the actual version and resolve the mismatch first. A version print alone proves which executable answered, not that the whole application is compatible.

If `uv` is missing, follow the official [uv installation instructions](https://docs.astral.sh/uv/getting-started/installation/). Do not paste an unreviewed installation script into a privileged shell. If Node is missing or wrong, use the official [Node.js archive](https://nodejs.org/en/download/archive/v24) or the cohort's approved version manager.

## Step 3 — Resolve the API dependencies

```bash
cd backend
uv python install 3.14.8
uv python pin 3.14.8
uv sync
uv run python --version
uv run python -c 'import fastapi; print("FastAPI", fastapi.__version__)'
```

Expected observations:

- `uv` finishes without a dependency-resolution error.
- `uv run python --version` reports Python 3.14.8.
- FastAPI's printed version is 0.143.2.
- `uv.lock` is created in `backend/` if it was not already supplied.

If these observations differ, stop and capture the full error. Do not manually edit package files to suppress a resolution problem; the compatibility matrix and pins must be reviewed.

**Reproducible rerun rule:** once the maintainer has validated and committed `uv.lock`, a clean clone uses `uv sync --locked`. Do not regenerate a lockfile and call it the same environment without reviewing the diff.

## Step 4 — Start the API process

Still in `backend/`:

```bash
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open. Expected startup output indicates Uvicorn is listening on `http://127.0.0.1:8000`. The exact log phrasing may differ by runtime version; use the actual listening address and process status, not a memorized screenshot.

Open another terminal. Use the absolute path you recorded in Step 1 to navigate to the project root, then verify the location before continuing. For example, replace `/absolute/path/to/groundops-week-01` with the real path printed by `pwd` in the first terminal:

```bash
cd /absolute/path/to/groundops-week-01
pwd
test -d backend && test -d frontend && echo 'project root verified'
```

Do not type the example path literally. If it fails, use the recorded path from your own run. Keep this terminal at the project root for Step 5.

## Step 5 — Verify the API from the shell

From the project root:

```bash
curl -i http://127.0.0.1:8000/health
curl -i http://127.0.0.1:8000/api/status
```

Expected `/health` response includes a successful HTTP status and JSON equivalent to:

```json
{"status":"ok"}
```

Expected `/api/status` response is JSON equivalent to:

```json
{
  "service": "groundops-api",
  "status": "available",
  "message": "The browser reached the FastAPI endpoint.",
  "version": "0.1.0"
}
```

The JSON whitespace and header order may differ. The relevant evidence is the HTTP status and exact field values. If the command fails, capture the error and API terminal before changing anything.

Now run a request that supplies the expected origin:

```bash
curl -i -H 'Origin: http://127.0.0.1:5173' http://127.0.0.1:8000/api/status
```

Expected response headers include `access-control-allow-origin: http://127.0.0.1:5173` (header casing is not significant). This proves the response has the expected CORS header for the supplied origin; `curl` itself does not enforce browser CORS restrictions.

## Step 6 — Resolve frontend dependencies and start Vite

Open a third terminal. Use the absolute path you recorded earlier to navigate to the project root, then enter `frontend/`:

```bash
cd /absolute/path/to/groundops-week-01
cd frontend
pwd
npm install
npm ls --depth=0
npm run dev
```

Expected direct package versions:

- `react@19.3.1`
- `react-dom@19.3.1`
- `vite@8.3.4`
- `@vitejs/plugin-react@6.1.2`

Vite should report a local URL. The configuration uses `http://127.0.0.1:5173` and `strictPort: true`, so it should fail rather than silently move to another port. If port 5173 is in use, stop the conflicting process or change the port and update the API's CORS allowlist accordingly. Do not let the app silently run on another origin while believing it is using the baseline.

Open `http://127.0.0.1:5173` in the browser.

**Build vs development note:** `npm run dev` runs a development server. It is appropriate for this request-tracing lab; it is not a substitute for the production build. A later lab will validate `npm ci` and `npm run build` with a committed lockfile.

## Step 7 — Trace one request in the browser

1. Open browser DevTools (usually F12 or right-click → Inspect).
2. Select **Network**. Enable **Preserve log** if available and clear old entries.
3. In the page, select **Check API** once.
4. Find the request to `/api/status`.
5. Record the full Request URL, method, status, response body and relevant response headers.
6. Look for the matching request line in the FastAPI terminal.
7. Confirm the UI shows `groundops-api`, `available` and the message returned by the API.
8. Inspect the Console for JavaScript or browser-policy errors.

Expected baseline outcome:

- The network entry targets `http://127.0.0.1:8000/api/status`.
- The request method is `GET`.
- The HTTP response is successful and contains the expected JSON fields.
- The response allows `http://127.0.0.1:5173` as the origin.
- The UI presents the returned message without an error panel.

Do not infer that the browser sent the request only because the UI button changed. Use the Network panel and backend observations. Do not infer that the endpoint is secure or production ready: this local lab has no authentication, TLS setup, database or real AI provider.

## Step 8 — Complete the request-trace record

Copy this table into your lab notes and fill it with actual values; don't copy the example as if it were an observation.

| Evidence field | Your observation |
|---|---|
| Date/time and machine/OS |  |
| Python / uv / Node / npm versions |  |
| Frontend URL and browser origin |  |
| API target shown in Network |  |
| HTTP method + path |  |
| Response status |  |
| Response body fields |  |
| CORS response header |  |
| Matching API process log |  |
| Console warnings/errors |  |
| User-visible result |  |
| What each observation proves |  |
| What remains unproven |  |

## Acceptance criteria

The lab passes only when the learner can demonstrate all of the following:

- [ ] The API process and frontend process were started separately and are independently stoppable.
- [ ] Direct `curl -i` tests show the required response status and JSON values.
- [ ] The browser Network panel shows the actual frontend-to-API request and response.
- [ ] The browser response is permitted by the configured CORS origin.
- [ ] The UI renders the actual API result rather than a hardcoded success message.
- [ ] The evidence table is completed with observations from the learner's run.
- [ ] The learner explains at least two claims the successful lab does **not** establish.
- [ ] Any version mismatch, warning, skipped test or unexpected behavior is recorded rather than concealed.

## Cleanup

- Stop Vite with `Ctrl+C` in the frontend terminal.
- Stop Uvicorn with `Ctrl+C` in the backend terminal.
- Keep `uv.lock` and `package-lock.json` once created; they are part of the reproducibility evidence, not temporary clutter.
- No cloud resources were created by this lab.

## Sources

- [FastAPI — First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [FastAPI — CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN — HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [uv — Locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/)
- [Vite — Getting started](https://vite.dev/guide/)

## Validation disclosure

**Not yet verified at the exact pinned versions:** frontend dependency installation, Vite build, clean `npm ci` replay, exact Python 3.14.8 + FastAPI 0.143.2 installation, exact `uv sync --locked` replay, and browser execution across the supported OS matrix. Do not mark this lab approved until those checks have evidence in `quality-ledger.md`.

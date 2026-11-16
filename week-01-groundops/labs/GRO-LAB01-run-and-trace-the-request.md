# GRO-LAB01 — Run the Application and Trace One Request

**Planned learner time:** 90 minutes, separate from the 150-minute teaching allocation. Allow **20–40 additional minutes for first-time tool/path setup**; this is not extra teaching credit.
**Lab type:** Baseline build/run and evidence collection.
**Risk:** Local-only. No AWS resources, external credentials or billable services.

## What you are trying to prove

Start two separate programs: Vite serves the React page; Uvicorn runs the FastAPI API. Then follow one button click from the browser to the API and back. A page appearing is not enough: collect the request address, HTTP status, response body, browser permission header and matching server log.

Start with the beginner setup below, then read the [request-path lesson](../lessons/GRO-L02-trace-the-full-stack-request.md) for the diagram. Use [evidence-first operations](../lessons/GRO-L03-evidence-first-operations.md) when a result differs.

## 0. First time using Python, React or a terminal?

You do not need to write Python or React code for this lab. The application is already supplied; your job is to install its dependencies, start it and observe a request.

### Understand the pieces

| Term | Meaning in this lab |
|---|---|
| Python | The language/runtime used by the backend. |
| FastAPI | The Python framework defining URLs such as `/api/status`; it returns data as JSON (named values in a text format). |
| Uvicorn | The server process that listens for HTTP requests and runs the FastAPI app. |
| uv | The tool that installs Python and the backend's Python packages in a project-local environment. |
| `.venv` | An isolated Python environment inside `backend/`. `uv run` uses it; manual activation and global `pip install` are not needed here. |
| React | The JavaScript library that renders the page and updates it after a button click. |
| Node.js / npm | Node runs frontend tooling on your machine. npm installs its packages and runs scripts; React's UI code runs in the browser. |
| Vite | The local development server that serves the frontend to your browser. |
| Manifest / lockfile | `package.json` and `pyproject.toml` declare dependencies. `package-lock.json` and `uv.lock` record resolved versions, including dependencies of dependencies. Do not hand-write lockfiles. |

The request path is: **browser button -> FastAPI URL -> JSON response -> React page update**. Vite and Uvicorn are separate programs, so both must stay running. There is no database, Docker setup or React project-generation step in this lab.

### Prepare your tools before starting the timed lab

1. Choose one environment:
   - **Windows:** follow Microsoft's [WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install), open **Ubuntu**, and perform all remaining setup there. Do not install Node in Windows and then try to use it from Ubuntu.
   - **macOS:** open **Terminal** from Applications > Utilities.
   - **Linux:** open your terminal application. The proposed Linux baseline is Ubuntu 24.04.
2. Install **Node.js 24.22.0**, which supplies **npm 11.19.1**, using the [official Node downloads](https://nodejs.org/en/download) for your chosen environment. Select the course version, not an unrelated "latest" release. Follow the installer instructions and reopen the terminal afterward.
3. Install **uv 0.13.1** using the [official uv installation instructions](https://docs.astral.sh/uv/getting-started/installation/), including their specific-version instructions. Reopen your terminal so the new command can be found. Section 3 uses uv to install Python **3.14.8**; you do not need to install a separate system Python first.
4. Have a Chromium-based browser and a text editor available (for example, Chrome and VS Code). Check `curl` and `lsof` in section 2. If either is missing, use your OS's approved installation process or ask the instructor; do not paste commands intended for a different OS.
5. Obtain the course files: download and extract the repository ZIP, or use the instructor's supplied folder. Open that folder in your editor. Find the folder containing `starter-app/`, `week-01-groundops/` and `environment-matrix.md`; that is the repository root used below.

Tool installation may require administrator approval or network access. On a managed computer, use your approved software channel. If the pinned version is unavailable, retain the error and ask the instructor rather than substituting a different version. These are setup directions, not a claim that every OS has been tested.

### Read and run commands

- A terminal accepts commands; an editor changes files; a browser opens URLs. Paste each block labelled `bash` into the terminal named by that step, not into a Python prompt, browser or source file.
- Start Bash by typing `bash` and pressing Enter. Do not copy the Markdown backticks or a prompt symbol such as `$`. Run one command at a time and wait for its result.
- `cd "path"` changes the current folder; quote paths containing spaces. `pwd` shows the current folder, `ls` lists files, and `cd ..` moves up one level. Each terminal has its own current folder.
- Replace `/absolute/path/to/...` examples with your actual folder path; they are not literal paths to paste unchanged.
- A successful command may print nothing. An error is not a completed setup step: keep the full error and the output of `pwd` for troubleshooting.
- Once a server is running, leave that terminal open. Open another tab/window for the next terminal; stop a server with `Ctrl+C` in its own terminal.

## Before starting

- Use Bash. On Windows use Ubuntu in WSL2, not PowerShell. In macOS Terminal, type `bash` if your current shell is zsh. Open all lab terminals in the same operating environment.
- Required tools: `uv` **0.13.1**, Node.js **24.22.0**, npm **11.19.1**, `curl`, `lsof`, and a Chromium-based browser. The API baseline is CPython **3.14.8**, FastAPI **0.143.2**, Uvicorn **0.54.0**. See the [environment matrix](../../environment-matrix.md).
- This repository's **draft starter has no lockfiles**. For its first exploratory run, section 3 uses `uv sync` to create `backend/uv.lock` and section 6 uses `npm i` to create `frontend/package-lock.json`. An approved cohort pack must already include both: if either is missing from a pack advertised as locked, STOP and request the complete pack.
- Do not change package versions to get past an error. Missing tools require the setup process above before this lab; do not run system-wide package installs while troubleshooting the application.
- These instructions are interactive: run one numbered action, read its result, then continue. Do not paste the whole page as a script. A **STOP** means do not run later actions until the discrepancy is resolved.

## Your workspace and evidence

Use three terminal tabs/windows and name them if your terminal permits:

| Name in this lab | Directory after setup | Job |
|---|---|---|
| **API** | `groundops-week-01/backend` | Runs Uvicorn; stays occupied |
| **CHECKS** | `groundops-week-01` | Runs short checks and collects evidence |
| **WEB** | `groundops-week-01/frontend` | Runs Vite; stays occupied |

An occupied terminal has no prompt because its server is still running. Do not type another command into it. `Ctrl+C` stops that terminal's server and returns the prompt; it does not stop the other server.

Create a text document **outside the application folder**, for example `GRO-LAB01-evidence.txt` in your course notes. Paste actual commands and outputs after each step. Save screenshots beside it, not in the source tree. The names below are suggested evidence filenames, not shell commands.

| Work | Original timebox |
|---|---:|
| Toolchain and starter inspection | 10 min |
| API setup/run | 20 min |
| Frontend setup/run | 15 min |
| Direct API checks | 10 min |
| Browser trace | 20 min |
| Evidence and cleanup | 15 min |

## 1. Find the supplied files and make a working copy

1. In **API**, navigate to the repository root or extracted course folder that directly contains `starter-app/`. This repository does not require a `students/` subfolder. Type `cd ` (with a trailing space), then a quoted absolute folder path from your file manager, and press Enter. For example, replace the example path before running:

   ```bash
   cd "/absolute/path/to/ai-sbl-cohort-4"
   pwd
   ls
   ```

   `cd` changes directory; `pwd` prints it; `ls` lists its contents. Expect to see `starter-app` and week folders. If not, STOP and select the correct folder.

2. Check the source and destination **before copying**:

   ```bash
   test -f starter-app/backend/pyproject.toml && test -f starter-app/backend/main.py && test -f starter-app/frontend/package.json && echo "Starter source found"
   if [ -e groundops-week-01 ]; then
     echo "STOP: groundops-week-01 already exists; preserve it"
   else
     echo "Destination is available"
   fi
   ```

   `test -f` checks for a file; `&&` runs the next check only after success. `[ -e ... ]` checks whether a path already exists. Continue only with **both** `Starter source found` and `Destination is available`. No source message means STOP. Do not copy over an existing attempt or nest a new copy inside it.

   Check the lockfiles separately:

   ```bash
   ls starter-app/backend/uv.lock starter-app/frontend/package-lock.json
   ```

   For this draft, `No such file or directory` is expected for the absent lockfiles: use the first-time setup branches below. For an approved locked pack, both paths must be listed; missing files mean STOP. Preserve any supplied lockfile rather than deleting it to force a fresh install.

3. Copy and enter the new folder:

   ```bash
   cp -R starter-app groundops-week-01
   ```

   `cp -R` copies the directory and its contents. Success is usually silent. If any copy error appears, STOP; do not use an incomplete copy.

   ```bash
   cd groundops-week-01
   pwd
   ls -a
   ```

   `ls -a` includes names beginning with `.`, such as `.gitignore`. Expect `backend`, `frontend`, `README.md` and `.gitignore`. Write the **absolute path printed by `pwd`** in your evidence; all three terminals must use this same copy.

## 2. Verify the tools

1. In **API**, still at the working-copy root, run:

   ```bash
   uv --version
   node --version
   npm --version
   curl --version
   command -v lsof
   ```

   The first four report versions (curl also prints capabilities). `command -v` reports where a tool is found; no path means it is unavailable. Expect uv `0.13.1`, Node `v24.22.0` and npm `11.19.1`. Record the actual versions.

2. STOP on `command not found`, a missing `lsof` path, or a version mismatch. Use the [environment matrix](../../environment-matrix.md) and approved setup support; do not upgrade npm globally or silently substitute versions. Python will be checked inside the managed project in the next step, not inferred from another system Python.

3. Check inherited environment settings in **API** now, and repeat this check in **WEB** when you open it in section 6:

   ```bash
   if [ "${VITE_API_BASE_URL+x}" = x ] || [ "${ALLOWED_ORIGINS+x}" = x ]; then
     echo "STOP: inherited lab settings exist; ask setup support before continuing"
   else
     echo "No inherited lab settings"
   fi
   ```

   `${NAME+x}` checks whether a shell setting exists without printing its value. Continue only with the second message in each terminal. An exported setting can override a file or the application's default even in a fresh source copy. Do not edit startup files or unset unrelated settings to bypass this check.

## 3. Install the Python API environment

1. In **API**, enter the backend and verify the path:

   ```bash
   cd backend
   pwd
   ```

   The path must end in `groundops-week-01/backend`.

2. Obtain the specified Python using the existing uv tool, then select it for this project:

   ```bash
   uv python install 3.14.8
   uv python pin 3.14.8
   ```

   The first command may download a uv-managed interpreter; the second writes the project's `.python-version`. They do not replace your system Python. If downloading is blocked or the version is unavailable, STOP and save the error. `No download found` can also mean an older uv lacks the required Python download metadata: recheck the installer version from section 2 before diagnosing a missing release. Do not change Python pins to bypass it.

3. Install dependencies. Choose **one** command based on whether `uv.lock` exists in this backend folder (use `ls` to inspect it).

   **First-time draft setup, without `uv.lock`:**

   ```bash
   uv sync
   ```

   This reads `pyproject.toml`, resolves Python packages, writes `uv.lock` and creates the local `.venv` directory. Wait for successful completion. Then run `ls uv.lock` to confirm the file was created. Keep it for later installs and LAB02; generating it does not make this draft an approved release.

   **Supplied lockfile or subsequent clean setup:**

   ```bash
   uv sync --locked
   ```

   `sync` creates/updates the local `.venv`; `--locked` refuses to change `uv.lock`. Expect completion without errors; repeat runs can report that packages are already installed. A failure may mean a missing/stale lockfile, network problem, or unavailable interpreter/package—read the actual message rather than assuming one cause. Do not fall back to unlocked `uv sync` to bypass a stale or incompatible supplied lockfile.

4. Verify the environment that will actually run the API:

   ```bash
   uv run python --version
   uv run python -c 'import fastapi, uvicorn; print("FastAPI", fastapi.__version__); print("Uvicorn", uvicorn.__version__)'
   ```

   `uv run` selects the project environment. Python's `-c` executes the quoted short check. Expect:

   ```text
   Python 3.14.8
   FastAPI 0.143.2
   Uvicorn 0.54.0
   ```

   Save the output. STOP if it differs. Do not move or rename this folder afterward: environments can contain absolute paths. If you already moved it, preserve the evidence and make a fresh copy at its final location rather than continuing with a broken `.venv`.

## 4. Start the API

1. In **API**, at `backend/`, inspect port 8000:

   ```bash
   lsof -nP -iTCP:8000 -sTCP:LISTEN
   ```

   `lsof` lists open files/network sockets. `-nP` keeps addresses/ports numeric; `-iTCP:8000` selects TCP port 8000; `-sTCP:LISTEN` selects listeners. **No output** usually means no visible listener (exit status 1 is normal for no match). A permission/tool error is not proof the port is free. If a process is listed, STOP: identify it and use its own terminal's `Ctrl+C` only if it is your previous lab server. Never kill an unknown process or change ports to bypass this baseline.

2. Start the server:

   ```bash
   uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

   `main:app` means the `app` object in `main.py`; `--reload` watches for source changes; `--host 127.0.0.1` listens only locally; `--port 8000` chooses the API port. Expect lines similar to:

   ```text
   Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   Application startup complete.
   ```

   Leave this terminal running. An import error means check `pwd` and the dependency step; “address already in use” means return to the port check, not start another copy.

## 5. Ask the API directly

1. Open **CHECKS**. Replace the example path with your recorded working-copy root:

   ```bash
   cd "/absolute/path/to/groundops-week-01"
   pwd
   test -d backend && test -d frontend && echo "Working-copy root confirmed"
   ```

   Continue only if that message appears and `pwd` matches your record.

2. Run each request and save its output:

   ```bash
   curl -i --max-time 5 http://127.0.0.1:8000/health
   curl -i --max-time 5 http://127.0.0.1:8000/api/status
   ```

   `curl` makes an HTTP request; `-i` includes response headers; `--max-time 5` limits each request to five seconds. Expect `HTTP/1.1 200 OK`, then JSON. `/health` returns `{"status":"ok"}`. `/api/status` returns these values (spacing may differ):

   ```json
   {"service":"groundops-api","status":"available","message":"The browser reached the FastAPI endpoint.","version":"0.1.0"}
   ```

   If connection is refused, inspect **API** and port 8000. If HTTP 404 appears, compare the path exactly. HTTP 500 is a server error: save the API log and STOP. Curl can exit successfully even for HTTP errors; read the status line.

3. Send the browser's expected origin:

   ```bash
   curl -i --max-time 5 -H 'Origin: http://127.0.0.1:5173' http://127.0.0.1:8000/api/status
   ```

   `-H` adds the quoted request header. Expect `access-control-allow-origin: http://127.0.0.1:5173` (header letter case does not matter). Curl shows the permission header but **does not enforce** the browser's CORS policy. This is not yet a browser test.

## 6. Install and start the frontend

1. Open **WEB** and navigate explicitly:

   ```bash
   cd "/absolute/path/to/groundops-week-01/frontend"
   pwd
   ls -a
   ```

   Replace the example path. Inspect for local `.env` files. For this baseline, no custom `.env`, `.env.local` or mode-specific override should be present. If one exists, STOP and identify it; do not overwrite someone else's configuration.

   Repeat the inherited-settings check from section 2 in this WEB terminal before continuing.

2. Install the React/Vite dependencies. First confirm that `ls` lists `package.json` in this **frontend** folder. Choose **one** command:

   **First-time draft setup, without `package-lock.json`:**

   ```bash
   npm i
   ```

   `npm i` is short for `npm install`. It reads `package.json`, downloads packages into `node_modules/` and generates **`package-lock.json` in this same folder**. Wait for the command to finish successfully, then confirm the file exists:

   ```bash
   ls package-lock.json
   ```

   Keep this generated lockfile. Do not create it by hand or run `npm ci` first: `npm ci` requires an existing lockfile. You do not need to run `npm ci` immediately after a successful `npm i`; continue to step 3.

   **Supplied lockfile or subsequent clean setup:**

   ```bash
   npm ci
   ```

   `ci` installs the lockfile's dependency set; it replaces `node_modules` if present. It fails if package metadata and lockfile disagree. Do not replace a failing locked install with `npm i` or delete a supplied lockfile to bypass the failure. Save the output; STOP on an actual error.

   npm 11 may warn about optional macOS `fsevents@2.3.3` install scripts not covered by `allowScripts`. Do not run `npm install-scripts approve` merely to silence a warning. Also ignore npm's upgrade notice: the baseline remains npm **11.19.1**.

3. List the direct packages:

   ```bash
   npm ls --depth=0
   ```

   `--depth=0` hides nested dependencies. Expect React and React DOM **19.3.1**, Vite **8.3.4**, and `@vitejs/plugin-react` **6.1.2**. STOP on missing/invalid packages.

4. Check port 5173 with the same rules as the API port:

   ```bash
   lsof -nP -iTCP:5173 -sTCP:LISTEN
   ```

5. Start Vite:

   ```bash
   npm run dev
   ```

   This runs the `dev` script in `package.json`. Expect `Local: http://127.0.0.1:5173/`. Leave **WEB** running. The supplied `strictPort: true` means an occupied port produces an error rather than selecting another port. STOP on that error; do not change the origin.

   This is a development server, not a production build. A later lab builds the bundle; a successful `npm run dev` does not establish that build result.

### Common first-run setup errors

| Symptom | Next check/action |
|---|---|
| `npm: command not found` or `uv: command not found` | Return to section 0, finish the relevant tool installation in this OS environment, reopen the terminal, and repeat version checks. |
| npm reports `ENOENT` / cannot find `package.json` | Run `pwd` and `ls`; navigate to the working copy's `frontend/`, not the repository root or `backend/`. |
| `npm ci` says a lockfile is required | For this unlocked draft only, run `npm i` in `frontend/` first. For a locked pack, request the missing file. |
| uv cannot find `pyproject.toml` | Navigate to the working copy's `backend/` before running uv project commands. |
| An install reports an unavailable version, certificate error or network failure | Save the exact error and tool versions; resolve it with setup support. Do not change package pins or disable certificate verification. |
| `No module named fastapi` | Use `uv run` from `backend/` after successful synchronization, not an unrelated system Python. |
| Browser cannot open the page | Check that WEB is still running and open its exact `http://127.0.0.1:5173` URL in the browser. |
| Page loads but **Check API** fails | Check API is still running, then repeat section 5. A working React page alone does not prove the Python server is reachable. |

## 7. Trace one browser action and save evidence

1. In the **browser address bar**, enter `http://127.0.0.1:5173`. Do not use `localhost`; it is a different browser origin. Confirm the page displays that browser origin and API base URL `http://127.0.0.1:8000`.
2. Open DevTools: right-click a blank page area → **Inspect**. Alternatives: **Ctrl+Shift+I** on Linux/Windows or **Command+Option+I** on macOS. Select **Network** (use the `»` overflow menu if hidden). Keep DevTools open while clicking the page.
3. Enable **Preserve log**. Clear old requests using the clear icon; enter `api/status` in the filter box. If nothing appears after the next action, remove the filter and make sure Network recording is enabled.
4. Click **Check API** **once** on the page. Select the resulting `status`/`api/status` row. Under **Headers**, expand **General** and **Response Headers**. Record the full URL, method `GET`, status `200`, and allow-origin header.
5. Select the request's **Response** tab. Copy the actual JSON into your evidence file. Save a screenshot of Headers as `GRO-LAB01-network.png` and of Response as `GRO-LAB01-response.png` using your OS screenshot tool. Do not include unrelated tabs or personal data.
6. In **API**, locate the matching line, such as `GET /api/status HTTP/1.1" 200 OK`. Copy that line and its time, if shown, into the notes. A shell curl request also creates a log entry: use the order/time of your single click to correlate it.
7. Select DevTools **Console**. Save any error text or explicitly record “no errors observed after this click.” A warning is not automatically a failure. Save the rendered **Response received** card as `GRO-LAB01-ui.png`.
8. If the page renders but the request fails, do not call the whole lab passing. Compare the requested port, direct curl result, API log and allow-origin header. Save the failure before troubleshooting; [LAB02](GRO-LAB02-diagnose-the-broken-request-path.md) explores those boundaries.

## 8. Finish the record, pause or resume

Include actual OS/browser/tool versions, absolute working-copy path, frontend origin, request URL/method/status, response body/header, API log, Console findings, UI result, and what each observation supports. State any skipped check and what remains unproven: this local app has no authentication, TLS, database or real AI provider.

If a terminal closes, do not rerun the copy or installs automatically. Reopen the named terminal and `cd` to the **recorded absolute path** (API adds `/backend`, WEB adds `/frontend`, CHECKS uses the root). Check the appropriate port from CHECKS before restarting its server. If the port is occupied but you cannot identify the owner, STOP instead of launching another copy. No shell variables are needed to resume this lab.

## Acceptance and cleanup

- [ ] Both servers were started separately and the paths/tool versions were recorded.
- [ ] Direct requests show the expected HTTP status and JSON.
- [ ] Browser evidence shows the real request, permitted origin, response and rendered result.
- [ ] The API log is correlated with the browser action.
- [ ] Unexpected output, warnings, mismatches and skipped checks are retained honestly.
- [ ] You can explain two things a successful local request does not prove.

Stop **WEB** with `Ctrl+C`, then **API** with `Ctrl+C`. In **CHECKS**, rerun the two `lsof` checks; no listener output is expected for these stopped lab processes. If another process remains, identify it rather than killing it. Keep the working copy and lockfiles for LAB02. No cloud cleanup is needed.

## Sources

- [FastAPI first steps](https://fastapi.tiangolo.com/tutorial/first-steps/) and [CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) and [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [uv locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/)
- [Vite getting started](https://vite.dev/guide/)

## Validation disclosure

Prior evidence records a locked install and production build on one macOS machine: Python 3.14.8/FastAPI 0.143.2, and Node 22.22.3 plus the Node 24.22.0/npm 11.19.1 baseline. Direct API checks were also recorded. That does not validate every extracted pack or operating system.

**Bounded author replay, 2026-11-08:** clean native setup on macOS arm64 passed with uv 0.13.1, the listed Python/packages and Node/npm pins. Direct API/CORS checks and an integrated Chromium button request returned the expected response; owned servers were stopped. This is not a novice-observed walkthrough or a Windows/Linux claim. Record your own output rather than treating example text as captured evidence.

**Candidate check, 2026-11-10:** a clean application copy passed the pinned locked install, API tests, frontend tests/build and scripted Chromium request/response/log checks on macOS 27.2 arm64. The browser harness used Uvicorn reload mode, checked actual results and verified listener cleanup. It did not perform a learner's manual DevTools/screenshot routine or establish beginner timing/resume usability. This does not certify a newly distributed archive.

# GRO-LAB02 — Diagnose the Broken Request Path

**Planned learner time:** 90 minutes, separate from teaching time. Allow **15–25 extra minutes** if reopening the tools and practising evidence capture for the first time.
**Prerequisite:** Complete [GRO-LAB01](GRO-LAB01-run-and-trace-the-request.md) and retain its passing evidence.
**Risk:** Local-only; no AWS resources, credentials or production changes.

## What you will investigate

Three controlled changes can all make the page display “Request failed”: a different API target port, a stopped API process, and a mismatched allowed browser origin. For each, capture the symptom, write a hypothesis, run a test that separates possible causes, restore the baseline, and verify again.

Review [LAB01's terminal basics](GRO-LAB01-run-and-trace-the-request.md#read-and-run-commands) if needed. Keep the same `groundops-week-01` working copy, exact tool/package versions and lockfiles from LAB01, including those generated during first-time draft setup. There is no need to run `npm i` or regenerate `uv.lock` for this lab. Do not change dependencies, disable browser security, or allow every origin as a workaround.

## 1. Reopen your workspace and establish a baseline

1. Open three Bash terminals named **API**, **WEB** and **CHECKS**. In each, replace the example path with the absolute working-copy path saved in LAB01:

   **API**:

   ```bash
   cd "/absolute/path/to/groundops-week-01/backend"
   pwd
   ```

   **WEB**:

   ```bash
   cd "/absolute/path/to/groundops-week-01/frontend"
   pwd
   ```

   **CHECKS**:

   ```bash
   cd "/absolute/path/to/groundops-week-01"
   pwd
   test -d backend && test -d frontend && echo "Working-copy root confirmed"
   ls -a frontend
   ```

   `pwd` prints your current directory. Continue only if each path matches its label and CHECKS prints the confirmation. The frontend should have no custom environment overrides. If an existing `.env.local` is not demonstrably from your own previous attempt, STOP and preserve it.

   In **API** and **WEB**, check inherited environment settings before establishing the baseline:

   ```bash
   if [ "${VITE_API_BASE_URL+x}" = x ] || [ "${ALLOWED_ORIGINS+x}" = x ]; then
     echo "STOP: inherited lab settings exist; ask setup support before continuing"
   else
     echo "No inherited lab settings"
   fi
   ```

   The test checks presence without printing values. Continue only with `No inherited lab settings` in both terminals. Scenario C later uses a command-local prefix, not an exported shell setting. An exported Vite setting would override Scenario A's file and invalidate the experiment.

2. In **CHECKS**, inspect both ports:

   ```bash
   lsof -nP -iTCP:8000 -sTCP:LISTEN
   lsof -nP -iTCP:5173 -sTCP:LISTEN
   ```

   `-nP` keeps addresses and ports numeric; the remaining options select listeners on the named TCP port. No output usually means no visible listener (exit 1 is normal for no match). A permission/tool error is not a free-port result. If a server is already running, use its existing terminal; do not start duplicates. If you cannot identify a listed process as yours, STOP.

3. If not already running, start **API** at `backend/`:

   ```bash
   uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

   `uv run` uses the locked project environment; `main:app` selects the API in `main.py`; `--reload` watches source changes; `--host` and `--port` set the local listener. Expect the listening URL and `Application startup complete`. Leave the terminal occupied.

4. If not already running, start **WEB** at `frontend/`:

   ```bash
   npm run dev
   ```

   This starts Vite's development-server script. Expect `http://127.0.0.1:5173/`. If either start fails, STOP and resolve it using LAB01; do not inject a fault into an already failing baseline.

5. In **CHECKS**, confirm the API:

   ```bash
   curl -i --max-time 5 http://127.0.0.1:8000/health
   curl -i --max-time 5 -H 'Origin: http://127.0.0.1:5173' http://127.0.0.1:8000/api/status
   ```

   `-i` shows response headers, `--max-time 5` bounds the wait, and `-H` adds the quoted Origin header. Expect HTTP `200`, health `{"status":"ok"}`, status JSON containing `groundops-api`/`available`, and `access-control-allow-origin: http://127.0.0.1:5173`. Curl does not enforce CORS; the browser check is separate.

6. In the **browser**, visit `http://127.0.0.1:5173` and click **Check API**. Confirm **Response received**, then save baseline evidence using the next section.

### Evidence routine — use it before and after each repair

1. Right-click the page → **Inspect**, or use **Ctrl+Shift+I** (Linux/Windows) / **Command+Option+I** (macOS). Select **Network**; use the `»` menu if hidden.
2. Turn on **Preserve log**, clear old rows, type `api/status` in the filter box, then click **Check API** once.
3. Select the new request row. Under **Headers**, record **Request URL**, **Request Method**, any HTTP **Status Code**, request **Origin**, and response **access-control-allow-origin** if present. Record “not shown” rather than inventing a value when a failed request has no headers.
4. Open the request's **Response** tab. Save the body or record that it is unavailable. Then select DevTools **Console** and copy the error text, or write “no errors observed.”
5. Copy the matching API log line, if any, from **API**. State when no matching line was observed; absence alone does not prove where a request stopped.
6. Use your OS screenshot tool to save Headers and the visible page result. Use names such as `A-before-network.png`, `A-after-network.png`, and equivalent names for B/C, in a notes folder **outside the app**. Copy terminal commands/results into `GRO-LAB02-evidence.txt`. Do not capture other browser sessions or unrelated personal data.

Create one worksheet per scenario:

```text
Scenario / time:
Expected behavior:
Observed symptom:
Request URL / status / Origin / allow-origin header:
Direct API test and actual output:
Matching API log, or no matching line observed:
Hypothesis BEFORE the discriminating test:
Predicted result if the hypothesis is correct:
Actual result (including contradictions):
Root cause supported by these observations:
Smallest correction:
After-repair evidence filenames and results:
Prevention control:
Tests not executed / remaining uncertainty:
```

## 2. Scenario A — Change only the frontend API target

### A1. Prepare and inject

1. In **CHECKS** at the working-copy root, ensure the test port is not already in use:

   ```bash
   lsof -nP -iTCP:8001 -sTCP:LISTEN
   ```

   Expect no listener output. If another service is listed, STOP this scenario; do not send requests to or stop an unknown service.

2. Confirm that you will not overwrite an existing override:

   ```bash
   if [ -e frontend/.env.local ]; then
     echo "STOP: preserve the existing override before proceeding"
   else
     echo "Ready to create this scenario's override"
   fi
   ```

   Continue only with the Ready message.

3. Write this lab's override from **CHECKS**, still at the root:

   ```bash
   cat > frontend/.env.local <<'EOF'
   VITE_API_BASE_URL=http://127.0.0.1:8001
   EOF
   cat frontend/.env.local
   ```

   `>` writes/replaces a file; `<<'EOF'` supplies literal lines until the closing `EOF`, which must be alone on its line. File creation is silent; the second command must print the one setting. This endpoint is public configuration, not a secret.

4. In **WEB**, press `Ctrl+C`. Wait for the prompt. In **CHECKS**, rerun the port-5173 `lsof` check; expect no listener. Then in **WEB** at `frontend/` run `npm run dev` again. Vite reads environment files at startup, so changing the file without restarting is insufficient.
5. Reload the browser at `http://127.0.0.1:5173`. Confirm its displayed configured API URL now ends in `8001`. Click **Check API** and save **A-before** evidence.

### A2. Predict, then discriminate

1. In your worksheet, write which address you believe is wrong and what a direct request to each port should show.
2. In **CHECKS**, run these separately:

   ```bash
   curl -i --max-time 3 http://127.0.0.1:8000/api/status
   ```

   ```bash
   curl -i --max-time 3 http://127.0.0.1:8001/api/status
   ```

   The first should return HTTP 200 and status JSON. The second is **intentionally expected to fail**, commonly `curl: (7) Failed to connect ... port 8001`. The prompt returning with a nonzero exit is evidence, not a reason to close the terminal. Continue to recovery; do not chain this command with `&&`.
3. If 8000 also fails, STOP this scenario and restore its previously working API baseline. If 8001 returns an HTTP response, stop and inspect the unexpected listener; do not label it the intended lab result.

### A3. Restore and verify

1. In **CHECKS**, confirm the file still contains only the override you just created:

   ```bash
   cat frontend/.env.local
   ```

2. Only for that lab-owned file, remove it and check:

   ```bash
   rm frontend/.env.local
   if [ -e frontend/.env.local ]; then
     echo "STOP: override still exists"
   else
     echo "Override removed"
   fi
   ```

   `rm` deletes this single file; it normally prints nothing. Do not delete other environment files.
3. Stop **WEB**, verify port 5173 is no longer listening from **CHECKS**, restart `npm run dev` in **WEB**, then reload the browser.
4. Repeat the evidence routine as **A-after** and repeat the direct request to port 8000. The browser must now target 8000 and render the response. Explain from your observations why changing the target was sufficient; propose one configuration check that would detect this mismatch.

## 3. Scenario B — Stop only the API

### B1. Inject and record

1. Confirm Scenario A is repaired: browser target is port 8000, no `frontend/.env.local` remains, and the browser request succeeds.
2. In **API**, press `Ctrl+C` and wait for shutdown and the prompt. Do **not** stop WEB.
3. In **CHECKS**, inspect port 8000 with `lsof -nP -iTCP:8000 -sTCP:LISTEN`. No listener output is expected. A remaining listener means STOP and identify it before continuing.
4. Click **Check API** and save **B-before** evidence. Write a hypothesis predicting the direct health result.

### B2. Test before restarting

1. In **CHECKS**:

   ```bash
   curl -i --max-time 3 http://127.0.0.1:8000/health
   ```

   This is another **expected nonzero failure**. Connection refused and timeout are different observations; record the exact one. Do not “repair” the frontend because the API request failed.
2. Compare the visible page, actual target URL, direct health failure and stopped process. Explain why the page can still be visible. If health returns HTTP 200, investigate another listener instead of claiming the stopped-process experiment worked.

### B3. Restore and verify

1. In **API**, whose directory is still `backend/`, run:

   ```bash
   uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

2. In **CHECKS**, repeat the two baseline curl commands in section 1. Then repeat the browser evidence routine as **B-after**. All must pass before Scenario C.
3. Record the bounded cause and a prevention idea. This experiment deliberately stops a process; it does not establish why a real production process would crash or whether manual restart is an adequate operational control.

## 4. Scenario C — Allow a different browser origin

### C1. Inject only the origin mismatch

1. Confirm the browser address is **`http://127.0.0.1:5173`**, not `localhost`. In **API**, stop Uvicorn with `Ctrl+C`; in **CHECKS**, confirm port 8000 is no longer listening.
2. In **API** at `backend/`, start:

   ```bash
   ALLOWED_ORIGINS=http://localhost:5173 uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

   The `NAME=value command` prefix supplies an environment value to **this command only**. It does not permanently configure your shell. `localhost` and `127.0.0.1` are different origin hostnames even when both reach your machine.
3. Click **Check API** and save **C-before** evidence. Write a hypothesis predicting whether the server receives the request and which permission header should be present or missing.

### C2. Compare HTTP success with browser permission

1. In **CHECKS**, request without an Origin header:

   ```bash
   curl -i --max-time 5 http://127.0.0.1:8000/api/status
   ```

2. Request with the browser's actual Origin header:

   ```bash
   curl -i --max-time 5 -H 'Origin: http://127.0.0.1:5173' http://127.0.0.1:8000/api/status
   ```

   Both can return HTTP 200 and JSON. Inspect whether the second response allows the **actual** origin. Curl does not enforce the browser's cross-origin read restriction. A browser may show an HTTP response but block JavaScript from reading it.
3. Compare those headers with Console and API logs. If curl cannot connect at all, you have not isolated an origin-policy fault: STOP and inspect API startup. Do not infer “never reached the API” merely from a CORS message.

### C3. Restore the specific allowed origin

1. Stop **API**, confirm port 8000 is free from **CHECKS**, then start this in **API** at `backend/`:

   ```bash
   ALLOWED_ORIGINS=http://127.0.0.1:5173 uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

2. Repeat the curl request with the Origin header and the browser evidence routine as **C-after**. Expect the matching allow-origin header and a readable response rendered by the UI.
3. Explain what changed and what remained reachable during the incident. CORS is not authentication: do not allow `*`, reflect arbitrary origins, or enable credentials to evade this lab's policy check.

## 5. Compare, submit, and clean up

Submit the three worksheets and before/after evidence. Build your own comparison table with these rows: frontend renders; direct port-8000 request result; actual browser target; HTTP status available; allow-origin header; server log evidence; minimal correction. Use your results, not assumptions based on an error message.

Acceptance checks:

- [ ] A passing baseline was established before each single fault.
- [ ] Each hypothesis predicted a result before the discriminating test.
- [ ] Actual failure output was preserved, including intentionally nonzero curl results.
- [ ] Each correction was followed by direct API **and** browser checks.
- [ ] You distinguish response reachability, browser read permission and authentication.
- [ ] Remaining uncertainty is explicit: no proxy, TLS, cluster, authentication or AWS path was tested.

In **CHECKS**, inspect `frontend/.env.local` only if it still exists; remove it only if it is the single lab-owned Scenario A override. Stop **WEB** and **API** with `Ctrl+C`, and check ports 5173/8000 from CHECKS. Keep lockfiles and evidence. No cloud resources were created.

### Resuming after a break

Use your saved absolute working-copy path to reopen the three directories in section 1. No shell variables need to be reconstructed. Do not recopy or reinstall blindly. Read the latest worksheet: if stopped during a fault, first inspect the override file and running processes. Restore that scenario's baseline, record the interruption, then repeat the scenario from its beginning with new evidence. For Scenario C, restart with the explicit **correct** `ALLOWED_ORIGINS` value; a new terminal does not remember the previous command prefix.

## Sources

- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) and [CORS errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/) and [first steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)

## Validation disclosure

**Bounded author replay, 2026-11-08:** the native macOS arm64 baseline used uv 0.13.1 and the pinned Python/Node/package versions. Wrong target port, stopped API and mismatched allowed origin each produced the intended distinct evidence, followed by direct HTTP and integrated Chromium recovery checks. Owned servers were stopped and the lab override removed. A novice-observed walkthrough, Windows/Linux execution and accessibility review remain open; this is not release approval.

**Candidate check, 2026-11-10:** scripted Chromium 158.0.8127.18 on macOS 27.2 arm64 reproduced all three distinct faults and their repairs with the pinned native application. The wrong port left the intended API reachable; stopping the API removed its listener; CORS mismatch retained direct HTTP 200 while browser access failed. The override and owned listeners were removed. Manual evidence collection, learner interruption/resume, timing and other platforms remain pending.

# GRO-LAB02 — Diagnose the Broken Request Path

**Planned learner time:** 90 minutes, separate from teaching time.  
**Status:** Draft; fault scenarios reviewed conceptually, not yet executed at pinned versions.  
**Prerequisite:** Complete GRO-LAB01 and retain its passing evidence record.  
**Risk:** Local-only; no AWS resources, credentials or destructive operations.

## Objective

Diagnose three faults that can produce a similar user-visible symptom:

1. the frontend targets the wrong API port;
2. the API process is stopped;
3. the API is configured to allow the wrong browser origin.

For each failure, prove which boundary is broken, restore service with the smallest appropriate change, repeat the verification, and identify one prevention control. Do not jump straight to restarting everything.

## Rules of engagement

- Use the same application and the same browser window from LAB01.
- For each scenario, navigate explicitly from a new terminal to the working copy's root, `groundops-week-01`. The commands below assume this project root is the current directory unless the step says to change into `frontend/` or `backend/`. Use `pwd` to verify; do not guess from a terminal tab name.
- Change only the fault specified for a scenario.
- Capture the baseline and failure evidence before making a correction.
- Write a hypothesis before running the discriminating test.
- Record exact commands and actual outputs, including results that contradict your guess.
- Do not disable browser security. Do not widen CORS to an arbitrary origin as a shortcut.

## Incident worksheet

Complete a new copy for each scenario:

```text
Scenario ID:
Expected behavior:
Observed symptom:
Observation 1:
Observation 2:
Hypothesis:
Test and expected discriminating result:
Actual test result:
Root cause (bounded to evidence):
Smallest safe correction:
Verification after correction:
Prevention control:
Tests not executed / remaining uncertainty:
```

## Scenario A — The API target is wrong

### Inject the fault

1. Confirm the baseline request works.
2. In a terminal whose current directory is the project root `groundops-week-01`, create a local-only frontend environment file:

```bash
cd frontend
cat > .env.local <<'EOF'
VITE_API_BASE_URL=http://127.0.0.1:8001
EOF
```

3. Restart the Vite development process (`Ctrl+C`, then `npm run dev`). Vite reads env files at startup; a restart makes the changed value effective.
4. Open the page at `http://127.0.0.1:5173` and select **Check API**.

### Observe before fixing

- Inspect the exact Request URL in the browser Network panel.
- Inspect the Console error.
- In a separate shell, request the known API route directly:

```bash
curl -i http://127.0.0.1:8000/api/status
curl -i --max-time 3 http://127.0.0.1:8001/api/status
```

Expected observation: port 8000 serves the expected API response. Port 8001 fails to establish the expected API HTTP response unless another service happens to be listening there; if another service does respond, record that unexpected fact and inspect it rather than assuming the test setup.

Write a hypothesis that names the mismatched port. Do not write “network is broken” as the root cause.

### Repair and verify

1. Remove the local override:

```bash
rm .env.local
```

2. Restart Vite.
3. Retry once in the browser with the Network panel open.
4. Verify the request URL, status, response header, body and rendered UI.
5. Compare with the original baseline evidence.

**Expected root cause for the prescribed setup:** frontend configuration points to port 8001 while the lab API listens on 8000. This conclusion is valid only if your evidence confirms those values.

**Prevention idea:** a browser integration test should assert that the UI invokes the documented API path in the test topology. In later production modules, environment-specific endpoint configuration and deployment verification will be addressed explicitly.

## Scenario B — The API process is stopped

### Inject the fault

1. Remove any `.env.local` file left from Scenario A; if you are in the project root, run `rm -f frontend/.env.local`. Verify the default API URL is visible in the UI.
2. Stop Uvicorn with `Ctrl+C` in its terminal. Do not stop the frontend.
3. Select **Check API** in the browser.

### Observe before restarting

Run:

```bash
curl -i --max-time 3 http://127.0.0.1:8000/health
```

Record the actual failure. A stopped listener commonly causes a connection-refused error; the exact wording depends on the operating system and client. A timeout can have a different cause, so record it precisely.

Compare four observations:

- the frontend still renders;
- the browser API request fails;
- the direct health request fails;
- the API process has stopped.

The UI loading is expected because HTML and frontend JavaScript are served independently of the API process. Do not conclude that the application is healthy because the frontend still displays.

### Repair and verify

Start the API again from the `backend/` directory. From the project root, first run `cd backend`; then start it:

```bash
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Then verify in order:

1. `curl -i http://127.0.0.1:8000/health`
2. `curl -i http://127.0.0.1:8000/api/status`
3. browser Network panel for `/api/status`
4. rendered status card

**Root cause scope:** the API listener was unavailable because the process was intentionally stopped. This lab does not simulate or explain why a production process might terminate unexpectedly.

**Prevention idea:** the later runtime module will distinguish process supervision, startup/readiness/liveness signals and dependency health. Do not prematurely infer that the right fix in production is simply to start a manual terminal process.

## Scenario C — CORS is configured for a different origin

### Inject the fault

1. Ensure the browser's frontend URL is `http://127.0.0.1:5173`.
2. Stop the API with `Ctrl+C` in the API terminal. That terminal should still have `backend/` as its current directory because Uvicorn was started there in LAB01. If you closed that terminal, open a new one, navigate to the project root `groundops-week-01`, then run `cd backend` once.
3. In the terminal whose current directory is `backend/`, start the API with an intentionally mismatched origin allowlist:

```bash
ALLOWED_ORIGINS=http://localhost:5173 uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The browser origin remains `http://127.0.0.1:5173`, but the API is configured to allow `http://localhost:5173`. Those origins are different because the hostname differs.

### Observe before fixing

1. Select **Check API** in the browser.
2. Inspect the Network and Console tabs. Capture the origin and the CORS-related response header behavior.
3. From the shell, run the direct request without an `Origin` header:

```bash
curl -i http://127.0.0.1:8000/api/status
```

4. Then send the browser's origin explicitly:

```bash
curl -i -H 'Origin: http://127.0.0.1:5173' http://127.0.0.1:8000/api/status
```

Expected interpretation: the API can still return a successful HTTP response, while the response for the unapproved browser origin does not include the matching `Access-Control-Allow-Origin` value. `curl` reports the HTTP response; it does not enforce the browser's cross-origin read policy. The browser blocks JavaScript from reading the response when the policy check fails.

Do not say “the request never reached the API” unless server-side evidence supports that conclusion. CORS failures can occur after the request reaches the server; some request types also involve a preflight `OPTIONS` request.

### Repair and verify

1. Stop Uvicorn with `Ctrl+C`.
2. Start it with the correct allowlist:

```bash
ALLOWED_ORIGINS=http://127.0.0.1:5173 uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

3. Repeat the browser request and the `curl -i` request with the `Origin` header.
4. Verify that the response includes the correct allow-origin header and the UI renders the JSON payload.

**Root cause for the prescribed setup:** the API's configured browser-origin allowlist does not match the actual frontend origin. Confirm this with observed values before writing it as the cause.

**Security rule:** do not respond by allowing every origin by default, reflecting any arbitrary `Origin`, or enabling credentials without an explicit requirement and security review. CORS is not authentication. See [MDN CORS guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) and the [FastAPI CORS tutorial](https://fastapi.tiangolo.com/tutorial/cors/).

## Compare the three incidents

| Signal | Wrong API port | API stopped | CORS mismatch |
|---|---|---|---|
| Frontend page renders | Yes | Yes | Yes |
| Expected API direct request to port 8000 | Succeeds | Fails while stopped | Succeeds |
| Browser request target | Wrong port | Correct port | Correct port |
| Backend may receive the intended request | Not if it targets another port | No listener to receive it | Yes, often; confirm logs/response |
| HTTP response available in browser JS | No successful API response from wrong port | No | Response can exist but is blocked from JS by CORS policy |
| First fix to test | Correct endpoint URL | Start/recover the process and investigate why it stopped in real incidents | Correct the specific allowlist and retest |

This table describes the intentionally injected lab setups. Real systems may have proxies, service meshes, DNS, TLS, auth middleware, browser extensions and other boundaries; do not mechanically reuse the table without new evidence.

## Required submission

Submit one incident worksheet per scenario plus:

- a screenshot or export of browser Network evidence before and after each repair;
- the direct `curl -i` output for the API status route;
- one sentence that distinguishes the root cause from the visible symptom;
- one regression-prevention control per scenario;
- a short statement of what was not tested (for example, no proxy/cluster path, no authentication, no TLS, no real AWS environment).

## Acceptance criteria

- [ ] All three failure scenarios are injected exactly as instructed or deviations are documented.
- [ ] The learner records observations before restoring each fault.
- [ ] Each hypothesis makes a checkable prediction.
- [ ] The test evidence distinguishes the prescribed fault from at least one competing explanation.
- [ ] A minimal correction restores the expected request path.
- [ ] Post-fix verification repeats direct API and browser checks.
- [ ] CORS is not confused with API authentication or server availability.
- [ ] Remaining uncertainty and unexecuted tests are recorded honestly.
- [ ] Local `.env.local` is removed after Scenario A and no secrets are introduced.

## Cleanup

- Stop Vite and Uvicorn with `Ctrl+C`.
- Remove `frontend/.env.local` if it remains:

```bash
# Run from the project root, groundops-week-01
rm -f frontend/.env.local
```

- Keep the lockfiles once the official course baseline has been validated and committed.
- No cloud resources were created.

## Sources

- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN — CORS errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors)
- [FastAPI — CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [FastAPI — First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [Vite — Env Variables and Modes](https://vite.dev/guide/env-and-mode)

## Validation disclosure

These fault scenarios have been reviewed for causal consistency, but have **not yet been executed end-to-end** using the exact pinned versions in the environment matrix. The CORS behavior, application start/build, clean-install replay, and browser captures must be executed and recorded before approval.

# GRO-L03 — Evidence-First Operations

**Teaching time:** 50 minutes  
**Status:** Draft; source-checked, not approved.  
**Central mystery:** How do we move from “something is broken” to a justified repair without guessing, causing avoidable disruption, or declaring success too early?

## Instructor run sheet

| Minutes | Activity | Purpose |
|---:|---|---|
| 0–7 | Review the request trace; define the observation/hypothesis boundary | Teach disciplined statements. |
| 7–17 | Build the system-state ladder | Match health claims to evidence. |
| 17–28 | Walk the diagnostic loop with a worked case | Show falsifiable hypothesis tests. |
| 28–38 | Safe-change and AI-generated-artifact review | Establish blast-radius and rollback thinking. |
| 38–46 | Learner exercise: write an incident record | Practice clear operations communication. |
| 46–50 | Quick assessment and Week 2 bridge | Consolidate the operating method. |

## 1. Observe, infer, and assume are different verbs

An incident investigation becomes unreliable when guesses silently turn into “facts.” Use the following labels:

- **Observation:** a directly recorded signal with time and scope, such as “At 10:14:07 the browser request to `http://127.0.0.1:8000/api/status` failed with a connection error.”
- **Inference:** a conclusion supported by one or more observations, such as “The failure appears to be before a valid HTTP response was received.”
- **Hypothesis:** a testable explanation, such as “The API is not listening on port 8000.”
- **Test:** an action chosen to distinguish hypotheses, such as `curl -i http://127.0.0.1:8000/api/status` while checking the process terminal.
- **Root cause:** the causal condition that the evidence demonstrates was responsible for the incident in the investigated scope. Be careful: finding one failed setting is not always the full organizational root cause.
- **Fix:** the change that removes or mitigates the demonstrated cause.
- **Verification:** evidence that the expected behavior is restored and no known regression was introduced.
- **Prevention:** a change to tests, configuration validation, automation, documentation, monitoring or ownership that reduces recurrence or impact.

Not all failures need a formal postmortem. The same discipline scales from a local lab to a production incident: make uncertainty visible and avoid inventing certainty after the fact.

## 2. The system-state ladder

A useful ladder moves from low-level evidence to user outcomes. Evidence at one rung is useful, but it does not automatically establish every higher rung.

| Rung | Claim | Possible evidence | Example false conclusion to avoid |
|---|---|---|---|
| 1. Artifact present | Required code/config exists | File diff, commit, artifact registry metadata | “The file exists, so it works.” |
| 2. Process started | Runtime process is alive | Process output, process table, container status | “The process runs, so the route is reachable.” |
| 3. Listener reachable | Caller can connect to host/port | TCP connection, direct HTTP check | “The port is open, so correct behavior is served.” |
| 4. Route responds | Requested method/path returns a response | `curl -i`, API test, response body | “The route returns 200, so every response is semantically correct.” |
| 5. Contract holds | Response matches documented request/response expectations | Tests for status, schema, validation, error cases | “The API contract holds, so the browser can read it.” |
| 6. End-to-end path works | The real or representative client can complete the path | Browser Network record + rendered UI state | “The UI works once, so capacity and reliability are adequate.” |
| 7. User outcome holds under the required conditions | Correct feature outcome under meaningful scenarios | Acceptance test and product-level evidence | “One happy-path test proves production readiness.” |

This ladder is a teaching model, not a formal industry standard. It is designed to stop evidence from being overextended. A production readiness claim may need additional rungs for authentication, authorization, persistence, performance, resilience, accessibility, data protection, deployment safety and business invariants.

## 3. Diagnostic loop: one hypothesis at a time

Use this operating loop in every FailureCore lab:

```text
Symptom
  → Locate the failing boundary
  → Observe without changing state
  → Form a falsifiable hypothesis
  → Choose a discriminating test
  → Compare test result with expectation
  → Identify cause in the investigated scope
  → Make the smallest safe correction
  → Verify intended and user-visible behavior
  → Record regression prevention
```

The word **falsifiable** matters. “Something is wrong with networking” is too broad to test. “The React browser request uses port 8001, but the known API listener is on port 8000” makes a concrete prediction that can be checked.

### Worked case

**Symptom:** the React page loads but the API status card fails.

**Observation 1:** the browser Network tab shows the request is sent to `http://127.0.0.1:8001/api/status`.  
**Observation 2:** `curl -i http://127.0.0.1:8000/api/status` returns the expected body.  
**Hypothesis:** the frontend is configured with the wrong API port.  
**Discriminating test:** inspect the configured API base URL and compare it with the URL in the Network tab and the known API listener.  
**Result:** frontend config points to port 8001; backend logs show no matching request.  
**Root cause (bounded statement):** for this run, the frontend requested the wrong port, so the intended API route was not targeted.  
**Fix:** correct the development base URL to port 8000 and restart/rebuild the frontend as required by how the config is loaded.  
**Verification:** confirm the browser request now targets port 8000, inspect the response and `Access-Control-Allow-Origin`, and verify the UI displays the body.  
**Prevention:** add a startup/config check or browser integration test that asserts the deployed frontend calls the expected API path. Store the URL in a documented environment-specific configuration mechanism and ensure no secret is placed in a public client bundle.

The evidence does not justify stating that all networking is healthy. It justifies a narrow conclusion about this particular failure and its repair.

## 4. Choose the smallest safe next action

A useful diagnostic action should maximize information while minimizing risk. Before running it, ask:

1. What hypotheses are still plausible?
2. What result would I expect if each hypothesis were true?
3. Which command or observation distinguishes them?
4. Does this action change system state?
5. Could it expose data, destroy work, increase cost, widen permissions or affect other users?
6. Is there a safe rollback or cleanup step?

Prefer read-only observations until the likely cause is narrow enough to justify a change. Examples of useful first actions include inspecting the exact request URL, calling a documented health endpoint, checking recent logs, examining a deployment diff, or confirming the image digest attached to a running workload. Do not run destructive cleanup commands or restart critical workloads just because they are familiar.

## 5. Review AI-generated operational artifacts as executable decisions

An AI-generated Dockerfile, Kubernetes manifest, GitHub Actions workflow or shell script should be reviewed as an executable proposal. Syntax validity is only one gate. Use a review matrix:

| Review dimension | Questions |
|---|---|
| Intent | Does this change solve the requirement that was requested? |
| Context | Does it match the repo layout, environment, target versions, port mapping and deployment topology? |
| Permissions | Does it ask only for the authority required? Are workflow token permissions and cloud role policies scoped? |
| Secrets/data | Could any key, token, personal data or internal URL be embedded in source, logs, image layers or frontend bundles? |
| Failure behavior | What happens on timeout, unavailable dependency, invalid configuration, non-2xx response, restart or partial failure? |
| Observability | What signal would show success and what signal would expose failure? Are the signals accessible to the on-call operator? |
| Reversibility | Can the change be undone? What data or external side effect would not be undone by rollback? |
| Verification | What exact evidence proves the relevant outcome after the change? |

For workflows, use GitHub's official [secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use) as a source for secret handling and least privilege. For browser-build variables, use [Vite's documented secret exposure warning](https://vite.dev/guide/env-and-mode). Do not over-generalize: product-specific controls should be reviewed against their respective official documentation in the relevant module.

## 6. “Fixing the symptom” vs reducing recurrence

Suppose restarting FastAPI temporarily restores service. That may be a valid mitigation if the service is unavailable and recovery is urgent. It does not automatically establish the cause. The process might have exited due to invalid configuration, crashed on a request, been killed by resource pressure, or never started because a dependency could not be imported. The correct sequence may require both **mitigation now** and **cause investigation afterward**.

In a real incident, restoring service and preserving evidence can be competing goals. The operator should prioritize user safety and business impact under the incident process, but capture essential evidence when doing so does not worsen impact. This course's local labs can pause before mutation; actual production incidents may require triage under time pressure.

After the immediate fix, prevention should be specific. “Be more careful” is not an engineering control. Examples are a contract test for the API path, a workflow permission check, a config validator, an alert on a user-visible symptom, a deployment check against the image digest, or a documented rollback procedure. A prevention action should have an owner and an observable completion criterion if it is tracked as work.

Google's SRE Workbook describes postmortems as a way to preserve incident facts and turn them into actionable system improvements. See [Postmortem Culture](https://sre.google/workbook/postmortem-culture/). The course adopts that learning orientation while retaining the organization's normal security, compliance and accountability processes.

## 7. Incident note template

Have learners complete this without adding assumptions:

```text
Incident / lab ID:
Time window:
User-visible symptom:
Expected behavior:
Actual behavior:
Impact and scope:
Relevant revision / artifact version:
Direct observations (with source and timestamp):
Hypotheses considered:
Tests performed and results:
Root cause (bounded to demonstrated evidence):
Mitigation / correction:
Verification evidence:
Known remaining uncertainty:
Prevention action:
Cleanup completed:
Tests not executed:
```

The “tests not executed” field is deliberately present. It prevents absence of evidence from being silently turned into evidence of success.

## 8. Exit assessment

### Question 1
A CLI command returns exit code 0 after applying configuration. Is the service healthy?

**Expected answer:** not established. The command's exit status is evidence that the command completed according to its own semantics. Inspect effective state and verify relevant behavior from the appropriate caller's perspective.

### Question 2
`curl` to the FastAPI endpoint succeeds, but browser `fetch` fails with a CORS message. Does that prove the API is down?

**Expected answer:** no. It may show that direct HTTP access works from the shell while the browser's cross-origin response policy prevents JavaScript from reading the response. Inspect the browser's actual origin, request and response headers, and the API's configured origin list.

### Question 3
The API process is restarted and the UI now works. Can the incident be closed with “resolved by restart” as root cause?

**Expected answer:** the immediate mitigation may be recorded, but a restart is an action, not a causal explanation. State what is known, what remains unknown, and what evidence or follow-up is needed to prevent recurrence.

### Question 4
An AI-created workflow asks for broad write permission. It uses correct YAML and passes linting. Should it merge?

**Expected answer:** not until the permissions are justified and scoped, the workflow's trusted/untrusted inputs are reviewed, secrets are protected, and its operational behavior is tested. Syntax correctness is necessary but insufficient.

## Bridge to Week 2

GroundOps establishes the habit of inspecting the actual system and preserving evidence. Week 2 begins GitCore. This is not a change of philosophy: before we can safely change an application, we need to understand how the exact source state, commit, reference and history are represented. That provenance becomes important later when an image or deployment must be tied to a particular source revision.

## Sources

1. MDN, [CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).
2. FastAPI, [CORS tutorial](https://fastapi.tiangolo.com/tutorial/cors/).
3. Vite, [Environment variables and modes](https://vite.dev/guide/env-and-mode).
4. GitHub Docs, [Secure use reference for GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use).
5. Google SRE Workbook, [Postmortem Culture](https://sre.google/workbook/postmortem-culture/).
6. Google SRE, [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

# GRO-L03 — Evidence-First Operations

**Teaching time:** 50 minutes  
**Central mystery:** How do we move from “something is broken” to a justified repair without guessing, causing avoidable disruption, or declaring success too early?

**Prerequisites:** GRO-L01's bounded claims and GRO-L02's request path. No code-writing knowledge is required.

## Before the explanation: predict

The page still loads. One teammate says, “The API is down; restart it.” Another says curl to port 8000 returns the expected body. Predict an observation that could distinguish a stopped API from a browser using another address. Write what each explanation predicts before reading the worked case.

You already know one symptom can cross several boundaries. This lesson turns that model into a repeatable investigation and a record another person can continue.

**Reading route:** use the 50-minute core for prediction, labels, ladder, worked case, safe-action decision and transfer. Fleet-scale details are reference/extension reading. These minutes are planned, not learner-timed; labs and setup remain separately allocated.

## Mapped model and its limits

Think of a parcel marked “delivered” when the intended recipient has nothing. A tracking entry, an explanation and a remedy are different things.

| Parcel investigation | Operational mapping |
|---|---|
| Time-stamped scan at an address | Observation from a named instrument and vantage point |
| “Perhaps it went to the next building” | Hypothesis predicting a different destination |
| Compare the label with the recorded destination | Discriminating test comparing intended and effective API URL |
| Redirect the parcel, then confirm receipt | Targeted correction followed by the user's original outcome check |

**Limit:** a network request is not a physical parcel. Copies, retries, caches and concurrent operations can produce several records; a scan or log may be incomplete. The analogy labels claims, not packet behavior. Return to browser URL, HTTP response and process evidence for the actual test.

## 1. Observe, infer, and assume are different verbs

An incident investigation becomes unreliable when guesses silently turn into “facts.” Use the following labels:

- **Observation:** a directly recorded signal with time and scope, such as “At 10:14:07 the browser request to `http://127.0.0.1:8000/api/status` failed with a connection error.”
- **Inference:** a conclusion supported by one or more observations, such as “The failure appears to be before a valid HTTP response was received.”
- **Hypothesis:** a testable explanation, such as “The API is not listening on port 8000.”
- **Test:** an action chosen to distinguish hypotheses, such as `curl -i http://127.0.0.1:8000/api/status` while checking the process terminal.
- **Root cause:** a causal condition demonstrated in the investigated scope. There may be multiple contributing causes; finding one failed setting is not always the full organizational explanation. A hypothesis surviving one test does not automatically become the only cause.
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

**Illustrative, not captured execution.** Assume one laptop, the browser page at `http://127.0.0.1:5173`, the API listening at port 8000, no listener at 8001, and no simultaneous changes. Times below illustrate order, not measured durations.

**Symptom:** the React page loads but the API status card fails.

**Observation 1, 10:14:07:** the browser Network tab shows a request to `http://127.0.0.1:8001/api/status` with connection refused and no HTTP status.

**Observation 2, 10:15:30:** `curl -i http://127.0.0.1:8000/api/status` returns HTTP 200 and the expected body.

**Hypothesis:** the frontend is configured with the wrong API port.  
**Discriminating test:** inspect the configured API base URL and compare it with the URL in the Network tab and the known API listener.  
**Result:** frontend config points to port 8001; backend logs show no matching request.  
**Root cause (bounded statement):** for this run, the frontend requested the wrong port, so the intended API route was not targeted.  
**Fix:** correct the development base URL to port 8000 and restart/rebuild the frontend as required by how the config is loaded.  
**Verification:** confirm the browser request now targets port 8000, inspect the response and `Access-Control-Allow-Origin`, and verify the UI displays the body.  
**Prevention:** add a startup/config check or browser integration test that asserts the deployed frontend calls the expected API path. Store the URL in a documented environment-specific configuration mechanism and ensure no secret is placed in a public client bundle.

**Illustrative after-state, 10:18:00:** after changing only the effective URL and reloading the restarted Vite page, Network shows `GET http://127.0.0.1:8000/api/status`, HTTP 200, a matching allow-origin header and the supplied JSON; the UI shows **Response received**. This explicit after-state is what the proposed verification must actually collect in the lab. The earlier curl response could not establish it.

The evidence does not justify stating that all networking is healthy. It justifies a narrow conclusion about this particular failure and its repair.

**Changed condition:** suppose the file now says 8000, but Network still shows 8001. Predict before changing anything: is the intended file enough to prove the page's effective setting changed? Vite reads env files at startup; inherited shell environment has higher priority. A stale page or a higher-priority override can preserve the wrong address. Inspect only the relevant non-secret setting, restart the correct process and reload; do not dump all environment variables into evidence.

One logged curl request shows that some logging works, not that every browser request is logged. Matching source, time and target matters. Conversely, if Network shows port 8000 after repair but the request still fails, the wrong-port explanation does not cover the remaining failure: investigate the newly observed boundary rather than declaring success.

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

For workflows, use GitHub's official [secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use) as a source for secret handling and least privilege (grant only the authority the task needs). A workflow is an automated job specification; YAML is its text format. A linter checks selected rules, not every effect of running it. For browser-build variables, use [Vite's documented secret exposure warning](https://vite.dev/guide/env-and-mode). Product-specific configuration belongs in later modules; no hosted workflow or permission change is required today.

## 6. “Fixing the symptom” vs reducing recurrence

Suppose restarting FastAPI temporarily restores service. That may be a valid mitigation if the service is unavailable and recovery is urgent. It does not automatically establish the cause. The process might have exited due to invalid configuration, crashed on a request, been killed by resource pressure, or never started because a dependency could not be imported. The correct sequence may require both **mitigation now** and **cause investigation afterward**.

In a real incident, restoring service and preserving evidence can be competing goals. The operator should prioritize user safety and business impact under the incident process, but capture essential evidence when doing so does not worsen impact. This course's local labs can pause before mutation; actual production incidents may require triage under time pressure.

After the immediate fix, prevention should be specific. “Be more careful” is not an engineering control. Examples are a contract test for the API path, a workflow permission check, a config validator, an alert on a user-visible symptom, a deployment check against the image digest, or a documented rollback procedure. A prevention action should have an owner and an observable completion criterion if it is tracked as work.

Google's SRE Workbook describes postmortems as a way to preserve incident facts and turn them into actionable system improvements. See [Postmortem Culture](https://sre.google/workbook/postmortem-culture/). The course adopts that learning orientation while retaining the organization's normal security, compliance and accountability processes.

## 7. Incident note template

Complete this using actual evidence. Label assumptions and inferences rather than placing them among observations:

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
Prevention action (owner and observable completion criterion):
Cleanup completed:
Tests not executed:
```

The “tests not executed” field is deliberately present. It prevents absence of evidence from being silently turned into evidence of success.

## Production pain pattern

The local approach of matching one click to one nearby log fails when many people change many instances and telemetry (recorded system signals) is partial.

| Failure mechanism | Evidence/control | Trade-off and limit |
|---|---|---|
| A healthy fleet average hides a failing region/version | Break results into cohorts: groups sharing region/version; compare user-visible error rates and slow requests | More dimensions cost storage; a percentile such as p99 describes the threshold exceeded by the slowest 1%, not every user's result |
| Host clocks or ingestion delays reorder logs | Record event versus collection time and correlate request/trace IDs | An ID joins related records but cannot by itself order all events or repair clock skew |
| Sampling drops the request you need | Record the retention/sampling policy; tail sampling can prefer errors after an operation finishes | Missing evidence may be uncollected, dropped or delayed; do not label it “not sampled” without evidence |
| Alert floods hide consequential failures | Define a user-visible reliability target (SLO) and alert on consumption of its allowed failure budget | Thresholds depend on traffic and service needs; high CPU alone is not the same as user harm |
| Several simultaneous repairs obscure causation | Coordinate one owner of changes and keep a shared action log | Coordination costs time; urgent mitigation can precede full diagnosis under the incident process |
| Restarting erases the failed state | Preserve inexpensive logs first; isolate a failed instance only under an authorized plan | Dumps can contain secrets and preserving evidence must not prolong harm |

An illustrative SRE Workbook calculation uses a 30-day window: `30 × 24 = 720 hours`. A **14.4× burn rate** for **1 hour** spends `14.4 / 720 = 0.02`, or **2% of that window's error budget**, assuming comparable request rates. This is an alert-design example, not a measured lab threshold or a universal rule. The Workbook uses both long and short windows to balance detection and recovery behavior.

The transferable control is a bounded claim: name population, time window, instrument and uncertainty. One working browser, one green average or one surviving hypothesis is not evidence about everything else.

**Sampling and ordering limits:** a uniform head sampler can drop rare errors like successes, but other head policies can use attributes already known at request start. Tail sampling can prefer later-observed errors; it needs buffering/resources and cannot recover data already dropped upstream. Missing telemetry remains **unknown** until sampling, export failure, missing instrumentation, delay, expiry or another cause is demonstrated. A trace ID joins related records; it is not sortable time. Parent-child span relationships supply causal structure, not a total order of concurrent sibling operations. Combine them with event/collection times and clock uncertainty.

**Recovery limits:** restart/replacement can discard volatile state without erasing persisted logs or making diagnosis impossible. Preserve safe, inexpensive evidence under an authorized plan, and record what could not be collected. Dumps may contain credentials or personal data; do not collect or retain them casually.

## 8. Exit assessment

### Question 1
A CLI command returns exit code 0 after applying configuration. Is the service healthy?

### Question 2
`curl` to the FastAPI endpoint succeeds, but browser `fetch` fails with a CORS message. Does that prove the API is down?

### Question 3
The API process is restarted and the UI now works. Can the incident be closed with “resolved by restart” as root cause?

### Question 4
An AI-created workflow asks for broad write permission. It uses correct YAML and passes linting. Should it merge?

## Bridge to Week 2

GroundOps establishes the habit of inspecting the actual system and preserving evidence. Week 2 begins GitCore. This is not a change of philosophy: before we can safely change an application, we need to understand how the exact source state, commit, reference and history are represented. That provenance becomes important later when an image or deployment must be tied to a particular source revision.

## Transfer and lab handoff

A service's global error rate is within its target, but customers in one region cannot complete an order. Predict what a region-by-version breakdown could show that the global average hides. Choose a low-risk observation, then name a result that would contradict your favored explanation. Do not propose a fleet-wide restart as a substitute for that reasoning.

Use your [GRO-LAB01](../labs/GRO-LAB01-run-and-trace-the-request.md) baseline in [GRO-LAB02](../labs/GRO-LAB02-diagnose-the-broken-request-path.md). For each controlled fault, record prediction → actual evidence → bounded cause → one correction → repeated direct and browser checks. Carry the incident note, exact source/artifact identifier if available, unknowns and owned prevention action into Week 2. A filled checklist is not proof the commands or checks ran.
## Sources

1. MDN, [CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).
2. FastAPI, [CORS tutorial](https://fastapi.tiangolo.com/tutorial/cors/).
3. Vite, [Environment variables and modes](https://vite.dev/guide/env-and-mode).
4. GitHub Docs, [Secure use reference for GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use).
5. Google SRE Workbook, [Postmortem Culture](https://sre.google/workbook/postmortem-culture/).
6. Google SRE, [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).
7. Google SRE Workbook, [Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) — error-budget burn rates and multiwindow alerts.
8. Google SRE, [Managing Incidents](https://sre.google/sre-book/managing-incidents/) — coordinated roles and a working record.
9. OpenTelemetry, [Sampling](https://opentelemetry.io/docs/concepts/sampling/) — head/tail decisions and evidence limits.
10. W3C, [Trace Context](https://www.w3.org/TR/trace-context/) — request correlation.
11. OpenTelemetry, [Traces](https://opentelemetry.io/docs/concepts/signals/traces/) — span context and parent relationships.
12. Prometheus, [Instrumentation](https://prometheus.io/docs/practices/instrumentation/) — label-cardinality resource costs.
13. Uvicorn, [server behavior](https://raw.githubusercontent.com/Kludex/uvicorn/main/docs/server-behavior.md) — an ASGI exception before response start produces HTTP 500; it does not by itself establish worker death.

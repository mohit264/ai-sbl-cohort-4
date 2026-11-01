# GRO-L01 — The Human Infrastructure Layer

**Teaching time:** 45 minutes  
**Status:** Draft; source-checked, not approved.  
**Prerequisites:** Basic programming and command-line familiarity. No production DevOps experience assumed.  
**Central mystery:** If AI can generate code and operational configuration quickly, what still makes a human engineer accountable for a running service?

## Instructor run sheet

| Minutes | Activity | Expected learner shift |
|---:|---|---|
| 0–5 | Introduce the incident: the AI-assisted change is merged, the deployment job is green, but users cannot use the feature. | Stop treating a green check as proof of user outcome. |
| 5–13 | Separate artifact, intended state, observed state and outcome. | Identify different kinds of truth and evidence. |
| 13–23 | Map the human operational responsibilities: context, authorization, observation, diagnosis, recovery, verification and learning. | See ownership as a lifecycle, not a final approval click. |
| 23–33 | Work through an AI-generated change review. | Ask what the artifact assumes, exposes and proves. |
| 33–41 | Small-group decision exercise: choose the next evidence-gathering action. | Prefer discriminating tests over random changes. |
| 41–45 | Exit check and transition to request tracing. | Articulate an operational contract. |

## 1. Start with the incident, not the vocabulary

Imagine an AI engineering assistant is asked to add a “Summarize document” feature to a web application. It creates a React button, a FastAPI route, and a local environment variable for the API base URL. A developer accepts the patch after a quick review. A CI workflow runs, the image builds, the deploy command exits successfully, and a dashboard says the frontend process is running.

A user clicks the button and receives “Unable to reach the service.”

At this moment, several statements may all be true:

- The source change exists in Git.
- The CI workflow completed.
- A frontend artifact was built.
- A deployment tool accepted a desired configuration.
- A frontend process is running.
- The feature does not work for the user.

There is no contradiction. These statements describe different stages and different boundaries. The error arises when one statement is used to claim more than it proves. “The pipeline is green” is evidence about the pipeline's checks. Unless the pipeline includes an end-to-end test of the relevant workflow against the deployed version, it is not proof that a real user can use the feature.

**Instructor prompt:** Which of these facts would you trust first? Which one is closest to the user's experienced failure? What is the next observation that could distinguish a bad API URL from an unavailable backend?

Do not accept “restart the backend” as an answer yet. It is a change to the system without a supporting diagnosis.

## 2. Four different things often collapsed into one

Use this model throughout the course:

```text
Artifact → Intended state → Observed state → Verified outcome
```

### Artifact

An artifact is a thing we can inspect or move: source code, a Docker image, a Kubernetes manifest, a workflow file, a deployment package, or a configuration value. An artifact can be valid text and still be wrong for this environment. YAML that parses can grant excessive permissions. A frontend build can contain the wrong API URL. A manifest can reference an image tag that points to a different image than the reviewer expected.

### Intended state

Intended state describes what we want the system to become: two API replicas, a certain image version, one permitted frontend origin, a resource request, or a particular route. It is not itself evidence that the system currently matches the intention. Later Kubernetes modules will study declarative desired state and reconciliation in depth; here we establish the distinction without prematurely teaching controller internals.

### Observed state

Observed state is what a tool or instrument reports at a particular boundary and time. Examples include a process list, an HTTP response, a Pod condition, an application log, a browser network record, or an AWS API response. Every observation has a scope and blind spots. `ps` can show a process without proving its HTTP listener works. An HTTP `200` can prove a server returned a successful status for one request, but not that a broader workflow is correct.

### Verified outcome

A verified outcome is a claim backed by checks that correspond to the requirement. If the requirement is “a user can load the frontend and obtain the API status,” the verification must exercise the browser-to-API path or a clearly stated equivalent, not merely start each process. Evidence should include the deployed version or source revision so that the check is tied to the artifact under test.

These distinctions align with the wider operational practice of combining user-visible, symptom-oriented signals with internal telemetry. Google SRE's monitoring guidance differentiates black-box signals about externally observed behaviour from white-box signals about internal state; both matter, and neither replaces the other. See [Google SRE, “Monitoring Distributed Systems”](https://sre.google/sre-book/monitoring-distributed-systems/).

## 3. Why AI changes the speed of creation, not the ownership model

AI tools can reduce the effort of drafting code, configuration, tests and runbooks. They can also reproduce a mistaken assumption at scale, select a plausible but incompatible option, omit a failure path, or produce configuration that is syntactically valid but unsafe in the actual environment. Those are risk patterns to assess; this module does not claim a particular error rate or that every AI-generated artifact has such a defect.

The engineer's work therefore shifts toward a more explicit set of controls:

1. **Context:** confirm the intended environment, constraints, versions, API contract, security boundary and consequences.
2. **Review:** inspect what the generated artifact changes, including indirect effects and permissions.
3. **Verification:** select checks that test the user requirement and the component contracts, not merely the presence of a file or exit code.
4. **Operation:** observe actual state and behavior after a change.
5. **Recovery:** know which action is safe, reversible and proportionate if the system is unhealthy.
6. **Learning:** preserve a factual record of symptoms, diagnosis, repair and prevention.

This is not an argument against automation. The point of reliable automation is to carry out a bounded, understood procedure repeatedly and predictably. Human judgment establishes the context and guardrails, defines acceptance criteria, reviews dangerous decisions and remains responsible for consequences. The aim is not manual work forever; it is automation with a clear operational contract.

Google's SRE materials treat incident learning and blameless postmortems as mechanisms for improving the system after failure, rather than stopping at a quick fix. See [Google SRE Workbook — Postmortem Culture](https://sre.google/workbook/postmortem-culture/). In this course, “blameless” means investigating system conditions and decisions without personal attack; it does not mean ignoring security, negligence or governance requirements.

## 4. The GroundOps operating contract

For every production-facing change, a professional should be able to answer the following questions before calling it done:

| Contract question | Why it matters | Example evidence |
|---|---|---|
| What user or business outcome is required? | Prevents optimizing for a command rather than the need. | Acceptance criterion written as an observable behavior. |
| Which components and boundaries change? | Makes blast radius and ownership visible. | Architecture/request-path sketch; list of affected services. |
| What exact artifact/version is intended? | Avoids “latest” and ambiguous-image mistakes. | Commit SHA, image digest, build identifier or release version. |
| Which permissions and secrets are needed? | Prevents convenience from becoming unnecessary authority or disclosure. | Reviewed permission diff; no credential in source or client bundle. |
| What should healthy look like? | Converts an opinion into a check. | HTTP status/body, UI behavior, expected telemetry and threshold. |
| What observations would distinguish likely failures? | Makes diagnosis falsifiable. | A planned check for each important boundary. |
| What is the safe repair or rollback? | Limits damage while restoring service. | Known-good version, recovery steps, data impact notes. |
| How will the result be verified and recorded? | Stops the fix at the evidence boundary rather than at command exit. | Before/after observations and revision identifiers. |

These questions are a course checklist synthesized from operational reasoning, not a quoted industry standard. They should be adapted to the risk and scope of the change.

## 5. Worked review: AI generated “fix” for a broken frontend

The generated patch contains this line:

```javascript
const API_BASE_URL = "http://localhost:8000";
```

At first glance, it appears reasonable because the API is running on the developer's machine at port 8000. But what does `localhost` mean here? The JavaScript executes in the browser. The browser resolves the URL from the computer running the browser, not from the source-code author's mental model or a remote container's filesystem. It works in one local development setup and is often wrong when the same compiled bundle is served to another machine or when the browser's origin points elsewhere.

The patch also assumes HTTP is acceptable in every target context, the port is reachable, and the backend is configured to accept requests from the frontend origin. These are separate questions. The code is not proven correct simply because its syntax is valid.

A stronger review asks:

- Is this value intended to be development-only or part of the production artifact?
- Is it a public endpoint URL or a secret? An API URL is generally configuration, not a credential, but exposing a secret in browser code is unsafe.
- Which origin does the browser actually use to load the frontend?
- Can the browser reach the API host and port?
- Does the API permit this origin through CORS where cross-origin browser access is intended?
- Does the UI handle non-success HTTP status codes and network/CORS failure separately enough to show a useful user state?
- How do we verify the same behavior after packaging and deployment?

Vite explicitly states that variables prefixed with `VITE_` are exposed in client-side bundles and should not contain sensitive information. See [Vite — Env Variables and Modes](https://vite.dev/guide/env-and-mode). This is why “frontend environment variable” must never be treated as synonymous with “secret storage.”

## 6. Practice: choose the next observation

Present this evidence:

- The frontend's home page loads.
- The API process is running.
- The user-visible status card shows “Could not fetch status.”
- No API access log for the attempted request is available yet.

Ask students to choose one next action:

A. Restart both services.  
B. Increase the API timeout to 60 seconds.  
C. Open browser DevTools → Network, attempt the action once, inspect the request URL and error/status, then compare it with a direct request to the API.  
D. Rebuild the frontend image.

**Best first action: C.** It is an observation designed to distinguish hypotheses without changing the system. The other choices may be appropriate later if evidence supports them, but right now each introduces a change without identifying the failing boundary.

A careful student should also say that a missing access log is not conclusive proof the request never reached the application: logging may be disabled, filtered, delayed, or emitted elsewhere. The absence of a signal is meaningful only if we understand how reliably that signal is produced.

## 7. Key takeaways

- Generated artifacts are proposals; the running system and user-visible behavior must be verified.
- A successful step proves only what that step checks.
- “Running,” “reachable,” “healthy,” and “correct for the user” are different claims.
- Observations have a scope, a timestamp and blind spots.
- Evidence-first work is compatible with automation; it makes automation safer and more useful.
- The engineer's job is to own the outcome, not merely the artifact or command.

## Exit check

Ask each student to finish this sentence in one or two sentences: **“I will not treat ______ as proof of ______ unless I also verify ______.”** Strong examples state the boundary clearly, e.g. “I will not treat a green build as proof that users can reach the deployed API unless I also exercise and observe the request path against the deployed version.”

## Sources

1. Google SRE, [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — black-box versus white-box signals and layered diagnostics.
2. Google SRE Workbook, [Postmortem Culture](https://sre.google/workbook/postmortem-culture/) — learning after incidents and blameless postmortem practice.
3. Vite, [Env Variables and Modes](https://vite.dev/guide/env-and-mode) — client-visible build-time variables and secret exposure warning.
4. MDN, [Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) — request/response boundaries.

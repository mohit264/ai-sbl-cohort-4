# GRO-L01 — The Human Infrastructure Layer

**Teaching time:** 45 minutes  
**Prerequisites:** None beyond using a browser and opening a file. No programming, command-line or production experience assumed.

**Central mystery:** If AI can generate code and operational configuration quickly, what still makes a human engineer accountable for a running service?

## Before the explanation: predict

A document app has a **Summarize document** button. Its automated checks report success, but nobody has clicked the button in the environment customers use. Predict: can we promise a customer will receive a summary? Write your reason and one observation that would change your mind before continuing.

The document story is illustrative, not a feature supplied by the lab. In the lab, **Check API** asks for a small status message instead; there is no document upload or AI provider. The same question remains: did the promised action work, or did an earlier step merely finish?

## Vocabulary before the incident

- **Browser:** the application that opens websites and runs page code.
- **Frontend:** the buttons, text and behavior the person interacts with. React is the library used to build this lab's screen.
- **Backend/service:** a running program that answers requests. FastAPI is the library used to define this lab's API.
- **API:** an agreed way for programs to ask for work or data and understand the reply.
- **Source/patch:** editable program text / a proposed change to it. Git records versions; no Git commands are needed today.
- **CI/pipeline:** automated jobs such as checks and builds. **Build** means preparing files for execution or delivery; **deploy** means making a version available in a target environment.
- **Process:** one running instance of a program. **Configuration** means settings such as the destination address. **Production** is the environment real users rely on.
- **Terminal/CLI:** a window where you type a command and read its output. Labs explain each command before use; these lessons do not require you to execute the examples.

**Reading route:** spend the 45 teaching minutes on the prediction, four claims, worked trace, practice and handoff. The scale cases and detailed contract are reference/extension reading, not extra timed lab work. This is a draft teaching allocation, not measured novice completion time.

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

**Pause and consider:** Which of these facts would you trust first? Which one is closest to the user's experienced failure? What is the next observation that could distinguish a bad API URL from an unavailable backend?

Treat “restart the backend” as an intervention, not a diagnosis. First collect evidence that distinguishes possible causes.

Return to your prediction: green checks support only the properties they exercised. Dismissing all checks also fails: a successful build rules out some packaging problems. We need the next observation because neither “everything works” nor “nothing is known” follows from a green pipeline.

## Mapped model and its limits

Think of ordering a meal. A printed recipe is not a meal delivered to the right customer.

| Familiar entity/action | Technical mapping |
|---|---|
| Recipe card | Artifact: source/configuration we can inspect |
| Order specifying the meal and table | Intended state: required behavior and target environment |
| Cook reports the oven is on | Observed state: a process or tool reports one local fact |
| Correct meal reaches the customer | Verified outcome: the actual action produces the required result |

**Limit:** software requests can be concurrent, cached or retried; a kitchen story does not model browser policy or prove correctness. It only separates a plan from an observation from an outcome. Return to the app: identify the caller, address, response and rendered result rather than treating an “oven on” signal as a completed order.

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

**Predict first:** the same page is opened on a second person's laptop. The API still runs only on the developer's laptop. Will this address reach that API? Name the program interpreting the address and explain your prediction.

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

### Complete worked trace — illustrative, not a captured run

Assume the developer's browser and API share one laptop; the API listens on port 8000, the frontend on 5173, and the allowed browser origin matches. A **port** is a numbered network endpoint, not a password. A URL's **scheme** chooses the protocol, its **host** the destination, and its **path** the operation.

1. The developer loads the page. That supplies page files, not proof about the API.
2. The click makes browser code interpret `http://localhost:8000`. Here `localhost` refers to this laptop, so the intended API can answer.
3. A response arrives with HTTP status (a result number), headers (message metadata), and body (data). Browser code must be allowed to read it and interpret the data before drawing a useful result.
4. Change only the browser's location: a colleague opens the same bundle on another laptop with no listener on port 8000. The destination becomes that colleague's loopback interface. The API on the developer's laptop has not moved.
5. The second browser cannot obtain the intended result. Its Network panel can reveal the destination; the backend may show no matching request. A missing log alone does not establish cause.
6. A reviewed, reachable environment-specific API address is a candidate correction. Repeat the click and check response plus rendered result from the colleague's location; do not infer success from editing the file.

The trade-off is explicit: a hard-coded local address is easy to understand on one laptop but is not portable. A shared setting avoids editing many callers, but its effective loaded value and permissions still need verification.

## Production pain pattern

The simple approach is to send one apparently valid change everywhere and declare success after one check. It fails when a shared mistake reaches many users, when only one version was checked, or when recovery tools depend on the failing service.

| Concrete case / mechanism | What to observe | Control and cost |
|---|---|---|
| Cloudflare's 2019 firewall-rule rollout exhausted CPU globally through excessive regular-expression backtracking. A configuration change can have code-like blast radius. | Errors aligned to rollout time across locations, not just syntax checks | Release to a small group first and compare errors before widening; slower rollout buys a chance to stop |
| During an illustrative mixed-version rollout, one working instance does not represent every instance. | Outcomes grouped by version and location | Compare groups rather than one average; instrumentation and storage cost effort |
| Meta's October 2021 backbone outage also made internal recovery tools unavailable. | Whether the recovery path depends on the failed network | Rehearse a separate authorized recovery path; extra tooling must itself be maintained |
| AWS's February 2017 S3 incident removed more capacity than intended after an incorrect command input. | Capacity removed and dependencies affected | Enforced minimum-capacity/rate limits in the tool; a playbook alone cannot reject an unsafe input |

These are source-backed case studies, not outages to reproduce. No cloud changes are part of Week 1. A canary (small initial release group) cannot prove every environment safe; choose representative checks and retain a way back.

## 6. Practice: choose the next observation

Consider this evidence:

- The frontend's home page loads.
- The API process is running.
- The user-visible status card shows “Could not fetch status.”
- No API access log for the attempted request is available yet.

Choose one next action and explain what each possible result would tell you:

A. Restart both services.  
B. Increase the API timeout to 60 seconds.  
C. Open browser DevTools → Network, attempt the action once, inspect the request URL and error/status, then compare it with a direct request to the API.  
D. Rebuild the frontend image.

State whether your choice observes or changes the system. Explain one limit of an absent API log. Keep your reasoning for discussion rather than replacing it with a memorized letter.

## 7. Key takeaways

- Generated artifacts are proposals; the running system and user-visible behavior must be verified.
- A successful step proves only what that step checks.
- “Running,” “reachable,” “healthy,” and “correct for the user” are different claims.
- Observations have a scope, a timestamp and blind spots.
- Evidence-first work is compatible with automation; it makes automation safer and more useful.
- The engineer's job is to own the outcome, not merely the artifact or command.

## Exit check

Finish this sentence in your own words: **“I will not treat ______ as proof of ______ unless I also verify ______.”** Name the caller, environment and evidence your proposed verification needs.

## Transfer and lab handoff

A mobile ordering app says “order accepted,” but the customer has no receipt. Without assuming a web browser or CORS is involved, separate the artifact, intention, observation and required outcome. Predict what a check at the order service versus the customer's screen could establish. What would remain unproven if the screen showed a receipt?

Carry a one-paragraph acceptance criterion and a caller → service → reply sketch into [GRO-L02](GRO-L02-trace-the-full-stack-request.md) and [GRO-LAB01](../labs/GRO-LAB01-run-and-trace-the-request.md). Replace the illustrative summary feature with the actual **Check API** action. Leave blank spaces for observed URL, status/body and rendered result; a completed plan is not execution evidence.

## Sources

1. Google SRE, [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — black-box versus white-box signals and layered diagnostics.
2. Google SRE Workbook, [Postmortem Culture](https://sre.google/workbook/postmortem-culture/) — learning after incidents and blameless postmortem practice.
3. Vite, [Env Variables and Modes](https://vite.dev/guide/env-and-mode) — client-visible build-time variables and secret exposure warning.
4. MDN, [Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) — request/response boundaries.
5. MDN, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — browser cross-origin response reading.
6. Cloudflare, [July 2, 2019 outage](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/) — rule rollout and backtracking.
7. AWS, [S3 disruption, February 2017](https://aws.amazon.com/message/41926/) — incorrect input, recovery and tool guardrails.
8. Meta Engineering, [October 4 outage details](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/) — backbone and recovery dependencies.

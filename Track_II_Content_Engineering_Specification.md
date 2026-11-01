# Track II — DevOps and Cloud Production Engineering
## Content Engineering Specification

**Version:** 1.4  
**Status:** Active content-generation contract; Week 1 content drafted, none approved for release  
**Prepared:** 2026-10-16  
**Delivery shape:** 18-week structured course, documented as Markdown files  

**v1.4 change note:** Administrative state update only. The first generation batch now includes a draft environment matrix, file-level course map, Week 1 GroundOps lessons/labs, starter app, and quality ledger. No previously agreed generation, source, safety, context-budget, or approval rule has been relaxed. The Week 1 artifacts remain unapproved until the exact pinned toolchain and browser labs are validated and the owner reviews the material.  

---

## 1. Mission and learning promise

Track II must teach production engineering, not command memorisation. A learner should be able to reason about an end-to-end software delivery system, build and operate it, investigate failures using evidence, recover it safely, and explain the trade-offs behind the chosen solution.

The main end-to-end workload is one evolving, AI-oriented full-stack application: a React single-page frontend and a Python FastAPI backend in one repository. It moves from source control through CI/CD, containerisation, Kubernetes, AWS EKS, runtime operations, observability, fault diagnosis, and recovery. The previously selected ASP.NET Core API remains included as an optional comparative implementation/extension, not a second mandatory 18-week path. This keeps the main hands-on journey aligned to the AI-background audience without duplicating every platform lab across two backend stacks.

The course must develop three connected capabilities:

1. **Understand:** explain the problem a component solves, its contracts, assumptions, boundaries, failure modes, and trade-offs.
2. **Engineer:** build and configure the component, execute commands, inspect resulting state, and verify expected behaviour.
3. **Operate:** diagnose discrepancies, act safely, verify recovery, and reduce the chance or impact of recurrence.

The teaching thread is:

`React change + FastAPI change → Git history/review → CI and tests → Frontend build + backend tests/build → Versioned frontend/API images → Registry → Kubernetes/EKS deployment → Ingress/HTTP/browser-to-API path → Configuration/secrets → Health and telemetry → Incident → Recovery → Prevention`

The UI and API are separate deployable components with an explicit HTTP/API contract. Every module must make their boundary visible: building or starting the frontend does not prove that the API is reachable, and a healthy API process does not prove that a browser request succeeds end to end.

A module is incomplete if it teaches a command or resource without showing where it sits in this chain, what it guarantees, and what it does not guarantee.

## 2. Confirmed decisions and working assumptions

### Confirmed

- **Learner baseline:** basic programming and command-line familiarity; no production DevOps experience assumed.
- **Environment progression:** local hands-on labs first, followed by real AWS EKS exercises.
- **Application and audience update:** an end-to-end React frontend (single-page application) plus Python FastAPI backend is the primary evolving workload, suitable for learners with an AI/software background. The earlier ASP.NET Core choice is preserved as an optional comparative implementation/extension, not a second full parallel course.
- **Continuity:** one evolving monorepo and one user-facing application across the course; its frontend and backend are separately built, tested, versioned, deployed, observed, and troubleshot. The optional .NET example lives outside the mandatory path.
- **Cadence:** 18-week structured course.
- **Evidence standard:** source-backed, reproducible procedures; transparently disclose tests that were not executed.
- **Files:** separate Markdown lesson files and Markdown lab files.

### Working assumptions to avoid blocking authoring

- Use a **Bash-first command style**. Windows learners should use Ubuntu on WSL2 with the agreed container tooling; macOS and native Linux differences must be called out whenever they affect commands, paths, permissions, line endings, networking, or output. Do not silently mix PowerShell and Bash syntax in one command block.
- Select exact supported tool versions during the environment lock step before authoring hands-on labs. Re-check lifecycle/support information on the date content is authored and again before publication.
- Use a supported Python version selected after checking the FastAPI/tooling compatibility and the requirements of any optional AI libraries. Pin dependencies with a committed lock file and demonstrate reproducible installation. Do not assume that the newest Python release is automatically the best choice for every AI dependency.
- Select a supported Node.js LTS line and lock frontend dependencies. Use React with a documented, maintained build tool such as Vite for the course SPA; do not use deprecated Create React App setup instructions. The React/Vite choice and exact versions must be re-checked before lab authoring.
- Preserve a .NET 10 sample as the optional ASP.NET Core comparison path; Microsoft’s lifecycle page currently lists .NET 10 support through November 15, 2028. Re-validate before authoring that sample; do not treat any version choice as timeless. Source: [Microsoft .NET lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-and-net-core).
- Local Kubernetes will be used before EKS. The exact local Kubernetes distribution and cluster version remain to be chosen in the environment lock step, based on reproducibility and compatibility with the EKS stage.
- The cloud stage requires an AWS account and creates billable resources. Every AWS lab must include cost warnings, budget-conscious defaults, a cost-estimation pointer, cleanup commands, and a final resource-existence check. Where a learner cannot use AWS, a clearly labelled local alternative may support practice, but it must not be described as a verified EKS result.

## 3. Instructional doctrine

### 3.1 Problem before vocabulary

Start each lesson with an engineering mystery, production symptom, failed assumption, or design constraint. Introduce terminology only when learners need it to explain the evidence.

### 3.2 Derive the design

Use the following reasoning sequence where applicable:

`Need or constraint → Naive design → Hidden assumption → Failure or scaling limit → Evidence → Better design → Trade-offs → Operational contract`

This is a teaching structure, not permission to invent real-world incidents. Simulated failures must be labelled as constructed lab scenarios. Claims about actual incidents require primary postmortems or credible sources.

### 3.3 Trace ownership and boundaries

For every component, make explicit:

- What input it receives and what output/state it produces.
- Which component owns the next step.
- What success looks like at this boundary.
- What that success does **not** prove.
- Which failure signals appear here and which appear elsewhere.
- How a decision at this layer affects upstream and downstream layers.

### 3.4 Observe before changing

Failure exercises must make students collect evidence before changing state. Students must distinguish observation from hypothesis, test plausible explanations, and explain why the selected fix addresses the root cause.

### 3.5 Production safety is part of the lesson

Teach least privilege, controlled blast radius, secrets hygiene, reversible changes, safe rollout/rollback, verification, cost awareness, and prevention as engineering requirements—not as an appendix added after the commands.

### 3.6 Label simplifications

Every deliberately simplified model must state:

- What the model includes.
- What it deliberately omits.
- Which conclusions remain valid despite the omission.
- Which real-world questions require later study.

Do not present an analogy or teaching model as the literal implementation of a product.

## 4. Source and citation policy

### 4.1 Source hierarchy

Use sources in this order, depending on the claim:

1. **Primary product documentation** for commands, APIs, configuration, current support, operational behaviour, service limits, and security controls.
2. **Specifications and standards** for protocol and interface semantics; use the relevant specification or authoritative standard where one exists.
3. **Original research or recognised engineering literature** for systems principles, reliability, and empirical claims.
4. **Authoritative engineering books and practitioner research** such as the Google SRE books and DORA research for operational practices and research findings.
5. **Maintainer or vendor engineering posts, documented postmortems, and practitioner articles** for context or examples. Corroborate important technical claims with primary sources where possible.
6. Community Q&A can help identify common failure modes, but should not be the sole authority for important behavioural or security claims.

Examples of appropriate starting points include the [Git Book: Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects), [React installation and setup](https://react.dev/learn/installation), [Vite production builds](https://vite.dev/guide/build), [Vite environment variables and secret exposure](https://vite.dev/guide/env-and-mode), [FastAPI in containers](https://fastapi.tiangolo.com/deployment/docker/), [FastAPI CORS guidance](https://fastapi.tiangolo.com/tutorial/cors/), [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/), [Docker build best practices](https://docs.docker.com/build/building/best-practices/), [Kubernetes workload concepts](https://kubernetes.io/docs/concepts/workloads/), [Kubernetes probe semantics](https://kubernetes.io/docs/concepts/workloads/pods/probes/), [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Amazon EKS documentation](https://docs.aws.amazon.com/eks/), the [Amazon EKS Best Practices Guide](https://docs.aws.amazon.com/eks/latest/best-practices/introduction.html), [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/), and [DORA research](https://dora.dev/research/).

### 4.2 What needs a citation

Cite claims that are specific, non-obvious, version-dependent, empirical, safety/security-related, attributed to an expert, or likely to influence an operational decision. Examples include:

- Command syntax, flags, defaults, API behaviour, compatibility, support windows, and feature status.
- Kubernetes controller/probe/scheduling behaviour, Docker build behaviour, Git object/reference semantics, and GitHub Actions workflow/security behaviour.
- AWS IAM, EKS access, networking, identity, pricing, and resource lifecycle claims.
- Reliability principles and claims about the relationship between engineering practices and outcomes.
- Quotes, named frameworks, incident lessons, benchmarks, and statistics.

Common explanatory transitions do not need a citation in every sentence, but source-backed paragraphs must make it clear which claims the cited source supports.

### 4.3 Citation form

- Use inline Markdown links close to the claim: `Kubernetes treats readiness separately from liveness ([Kubernetes probes](URL)).`
- Link to the most specific relevant page or section, not merely a vendor homepage.
- Include a `## Sources and further reading` section at the end of every lesson and lab. For each source, record title, organisation/author, URL, useful section, and access date. Add publication/update date when the source provides one.
- For version-sensitive claims, state the tool/product version to which the instruction applies and link the corresponding versioned documentation when available.
- For primary research, include the paper/report title, author or organisation, publication year/date, and DOI or canonical URL when available.
- Do not fabricate authors, titles, publication dates, quotes, page numbers, DOI values, or source content.
- Do not use a citation as decoration. The source must support the nearby claim, not merely mention a related topic.
- Prefer paraphrase. If a short quotation is materially useful, keep it brief, exact, attributed, and linked; do not reproduce large amounts of source text.

### 4.4 Facts, judgments, and teaching examples

Distinguish these categories whenever confusion is possible:

- **Documented fact:** supported by an authoritative source.
- **Engineering judgment:** reasoned recommendation that depends on constraints and trade-offs.
- **Lab scenario:** constructed environment or injected failure for teaching.
- **Simplified model:** intentionally incomplete representation used to explain a concept.
- **Unverified hypothesis:** an explanation under investigation, not yet proven.

Never call a synthetic failure a real incident. Never invent an expert endorsement or imply that a source recommends something it does not. Where sources disagree, describe the disagreement and its applicability rather than hiding it.

### 4.5 Currentness and source validation

Before generating a module and again before publication:

1. Re-open every critical technical source.
2. Check product/version applicability and whether the page is current, archived, preview, or deprecated.
3. Verify the cited section supports the actual wording.
4. Prefer an official deprecation/support notice for lifecycle claims.
5. Record the date checked for time-sensitive information.
6. Re-test affected steps when documentation changes materially.

## 5. Tool and environment version lock

Before writing executable labs, maintain a course-level `environment-matrix.md` recording:

- Operating system and shell baseline.
- Python version, FastAPI version, dependency manager and lock format (for example, `uv` with `uv.lock` or a rigorously pinned requirements file), test tooling, and ASGI server/runtime configuration.
- Node.js LTS version, package manager, React version, Vite version, and committed lockfile (`package-lock.json` if npm is selected).
- Optional .NET SDK and ASP.NET Core target/runtime for the comparative extension.
- Git version.
- Docker Engine/Desktop and BuildKit/buildx versions where used.
- Local Kubernetes distribution, Kubernetes version, and `kubectl` version.
- GitHub Actions runner image, action versions/references, and workflow permissions.
- AWS CLI version, EKS Kubernetes/platform version, and selected provisioning approach.
- Container registry and image reference/tagging policy.
- Observability tool versions when introduced.

Pin version-sensitive examples where practical. Use immutable references where security or reproducibility requires it. Explain why a pin is used and how it is updated. Do not present a moving `latest` tag as a reproducible version.

When a tool cannot be meaningfully pinned (for example, a managed service version selected by AWS), state the tested/configured version and the selection procedure instead.

## 6. Course continuity and application contract

### 6.1 Primary evolving application

The mandatory 18-week workload is a small, AI-oriented web application with two independently packaged components:

- **Frontend:** React single-page application built for production as static assets, using a maintained build tool selected during the environment lock step (provisionally Vite).
- **Backend:** Python FastAPI HTTP API with a documented request/response contract and automated tests.
- **Repository:** one monorepo, with separate frontend and backend directories and shared infrastructure/workflow assets.
- **Deployment:** frontend and backend have separate container images, Kubernetes workloads, Services, health/readiness checks, and release evidence. The frontend calls the backend through an explicitly documented browser-reachable URL or path-based ingress route; it must never rely on a browser calling a Kubernetes-only Service name.

The purpose is to teach software delivery and production ownership, not frontend or AI application development in depth. The application should therefore have minimal UI and business logic, but enough real behaviour to demonstrate a complete request path from browser to API and back. Keep any AI-specific operation behind a backend interface. The default lab provider should be deterministic and local so core labs do not require model credentials, incur inference costs, or depend on a third-party API. A real model/provider integration may be an optional extension and must have its own cost, privacy, rate-limit, secret-management, timeout, and fallback treatment.

The starter workload should eventually include:

- A React screen that submits a clearly defined request to the API and renders the result and error states.
- A FastAPI endpoint with typed request/response schemas, predictable validation errors, and API documentation.
- Separate tests for frontend build/behaviour and backend unit/API behaviour, plus at least one integration check of the browser/API boundary where practical.
- Liveness and readiness semantics appropriate to the API; frontend health semantics must not falsely claim the backend is healthy unless it actually checks the dependency and the trade-off is explicitly explained.
- Structured API logs, request correlation where appropriate, and observable request/error/latency signals.
- Configuration injected separately from code and secret handling demonstrated without committing credentials.
- A deterministic simulated AI/task provider, with an optional replaceable provider adapter so the curriculum can discuss external inference failure without making it a hard dependency.
- Separate frontend and API container builds, registry identities, Kubernetes Deployment/Service resources, ingress/routing configuration, resource requests/limits, safe rollout, rollback, and scaling.
- CI that builds/tests both components and makes it clear which commit and dependency versions produced each artifact.
- ECR and EKS for the real-cloud progression.

### 6.2 Critical frontend/backend boundaries

Every relevant lesson must explain the following rather than relying on diagrams alone:

1. **Browser versus cluster network:** the browser runs on a learner's device; it cannot resolve an internal Kubernetes Service name unless a supported network path explicitly exposes it. The design must provide a reachable API URL or an ingress/reverse-proxy path.
2. **HTTP and CORS:** when frontend and API origins differ, explain origin (scheme, host, and port), preflight where relevant, allowlist configuration, and how to distinguish CORS rejection from DNS, routing, TLS, authentication, or API errors. Do not “fix” CORS by allowing every origin without explaining the security consequences.
3. **Build-time versus runtime configuration:** values embedded into a Vite-built bundle are client-visible. `VITE_*` values must never carry credentials or other secrets. API endpoints can be public configuration; model/API credentials belong only on the backend.
4. **Separate release artifacts:** frontend and backend images may be released independently. The course must show how API contract compatibility, frontend/backend version skew, and rollback are handled.
5. **Health boundaries:** a successful static asset response, a responsive API process, an API dependency check, and a successful user journey are different evidence. Teach what each test does and does not prove.
6. **Dependency failures:** any optional database, queue, object store, model provider, or third-party API must be added only when needed to teach a stated objective. Its local setup, configuration, fault modes, reset, privacy/cost effects, and cloud implications must be documented.

### 6.3 Preserve the ASP.NET Core decision without duplicating the course

The previous ASP.NET Core selection remains part of the deliverable as an **optional comparative workload/extension**. It should demonstrate how the same core delivery principles apply to another backend runtime, with a concise equivalent API, test, Docker image, and deployment path. It must not force students to repeat all 18 weeks twice or make the mandatory capstone depend on running two different backend implementations at once. If a later scope decision requires both backends to be independently delivered end to end, revise the week plan and validation effort explicitly before authoring.

### 6.4 Security and privacy

Do not put real passwords, access keys, model/API keys, personal data, uploaded private documents, or production information in the repository or example output. Fake credentials must be visibly fake. Secrets must not be passed to the browser bundle, committed to Git, logged, baked into images, or displayed in Markdown. Any sample AI/document workflow must use synthetic input by default and must not upload student data to a third-party service unless a separately documented optional exercise explicitly requires it.

## 7. Markdown repository layout

Use a predictable layout that separates concept lessons from executable labs and makes the two primary deployable components visible:

```text
track-ii-devops-cloud-production-engineering/
├── README.md
├── course-state.md             # Mandatory persistent progress, coverage, and handoff state
├── environment-matrix.md
├── architecture/
│   ├── end-to-end-system.md
│   ├── browser-to-api-request-flow.md
│   ├── deployment-and-release-boundaries.md
│   └── failure-boundaries.md
├── app/
│   ├── web/                    # React SPA, Vite/build config, tests, lockfile
│   ├── api/                    # FastAPI app, schemas, tests, dependency lock
│   └── examples/
│       └── dotnet-api/         # Optional ASP.NET Core comparison path
├── infra/
│   ├── compose/
│   ├── containers/
│   ├── kubernetes/
│   └── aws/
├── tests/
│   └── integration/            # Cross-component/API checks
├── .github/
│   └── workflows/
├── 00-course-foundations/
├── 01-groundops/
│   ├── lessons/
│   ├── labs/
│   └── assessments/
├── 02-gitcore-gitgraph/
│   ├── lessons/
│   ├── labs/
│   └── assessments/
├── 03-containercore-runtime-capsule/
├── 04-cluster-core-desired-state/
├── 05-service-network-config-storage/
├── 06-releasecore-ci-cd/
├── 07-deploycore-cloud-deployment/
├── 08-operatecore-runtime-health-scaling-releases/
├── 09-obscore-observability-diagnosis/
├── 10-failurecore-production-troubleshooting/
├── 11-groundops-production-build/
├── shared-lab-assets/
├── quality-ledger.md           # Mandatory file-by-file review and validation ledger
└── sources/
    └── source-register.md
```

The exact directory casing and naming can be normalised when the repository is created. The mandatory path should remain simple enough for novices to navigate. The optional .NET extension must be clearly marked as optional in the README and relevant week plans. Every lesson and lab must have a stable unique ID, clear prerequisites, and links to its prerequisites and follow-on material. Keep full files in the repository when learners need to create or edit them; do not force learners to reconstruct large configuration files from fragments.

## 8. Lesson-file template

Every concept lesson should use the following structure. Omit a heading only when it genuinely does not apply, and state why for critical sections rather than silently skipping them.

```markdown
---
id: L-XX-YY
title: "Descriptive engineering question"
module: "Module name"
week: X
estimated_time: "XX minutes"
status: draft
prerequisites:
  - "ID and title"
version_scope:
  - "Product/tool versions relevant to this lesson"
---

# <Engineering question, not just a product feature>

## The situation
Describe the realistic need, symptom, constraint, or failure. Label synthetic scenarios as simulations.

## What must we explain or decide?
State one primary architectural question and measurable learning outcomes.

## Start with what we can observe
Describe the evidence available before terminology or a solution is introduced.

## Derive the design
Walk from need to naive approach, assumptions, failure modes, and a better design. Cite factual claims inline.

## Architecture and responsibility boundaries
Explain component roles, inputs, outputs, state, ownership, and interaction flow. Include a text diagram where useful and explain each transition in prose.

## What the mechanism does — and does not — guarantee
Name limitations, trade-offs, timing assumptions, scope boundaries, and relevant failure behaviour.

## Connect it to the SDLC
Explain upstream inputs, downstream consumers, and how this mechanism affects the end-to-end application.

## Common wrong assumptions
Describe tempting but inaccurate interpretations and the evidence that disproves them.

## Check your understanding
Questions that require causal reasoning, prediction, or evidence interpretation—not only definitions.

## Engineering decision record
Summarise the chosen approach, alternatives, trade-offs, and conditions that would change the decision.

## Sources and further reading
Specific, claim-supporting sources with useful sections and access dates.
```

A lesson should normally investigate one central question. Supporting concepts are allowed only when they help answer that question; postpone unrelated concepts and explicitly point to the later lesson that resolves them.

## 9. Lab-file template

Labs must be runnable without oral instructions from an instructor. Each step should say where to run commands, what they do, why they are needed, what state changes, and how to verify the outcome.

```markdown
---
id: LAB-XX-YY
title: "Build or investigate <specific outcome>"
module: "Module name"
week: X
estimated_time: "XX minutes"
status: not-run
risk: low | medium | high
prerequisites:
  - "Lesson/lab ID"
environment:
  - "OS/shell"
  - "Tool and version"
cost: "Local only / estimated cloud resources and cost notes"
cleanup_required: true | false
---

# Lab objective
State the observable result and the engineering question.

## What you will build or investigate
Describe the starting state, target state, and system boundary.

## Safety and cost notes
List required permissions, possible destructive effects, cloud resources/costs, secret-handling rules, and the safe environment to use.

## Prerequisites and environment check
Give exact checks and explain how to interpret the results. Include tool versions.

## Starting state
Show the exact repository directory, file tree, branch/commit assumptions, cluster/account assumptions, and any resources already present.

## Architecture and flow
Show the relevant components and explain the flow in words. Do not rely on a diagram alone.

## Step-by-step procedure
For every step use this pattern:

### Step N — <action>
**Run in:** local shell / repository / container / Kubernetes context / AWS account / GitHub UI.  
**Why:** Explain the purpose and the relevant first principle.  
**Command or file:** Provide the complete command or complete file content.  
**Expected observation:** Give exact or version-qualified representative output. Clearly label placeholders.  
**Verify:** Give an independent check of resulting state or behaviour.  
**Interpret:** Explain what the evidence establishes and what it does not establish.  
**If different:** Give diagnostic next steps without guessing at one root cause.

## Inject or reproduce the failure
State the preconditions, exact fault injection, expected symptom, and safe boundary. Do not inject into production or any account that contains unrelated workloads.

## Investigate using evidence
Collect logs, status, events, graph/history, metrics, or other relevant evidence. List plausible hypotheses and a test that distinguishes each one.

## Fix and verify
Make the smallest justified change. Verify both the previously failing path and any relevant neighbouring behaviour. Explain why the fix addresses the root cause.

## Prevent recurrence
Recommend proportionate tests, guardrails, alerts, automation, documentation, or design changes. Separate required controls from optional enhancements.

## Cleanup and reset
Provide exact cleanup commands, how to verify resources are removed, what state is intentionally retained, and how to reset for a fresh run. AWS labs must include a final resource/cost check.

## Completion checklist
Use observable acceptance criteria, not "command ran without errors" alone.

## Troubleshooting table
Symptom | Evidence to collect | Possible explanations | Next discriminating test

## Validation record
- Status: not-run | locally-verified | AWS-verified | partially-verified | blocked
- Verified date:
- OS/shell:
- Tool versions:
- Exact path/commit or lab revision:
- Steps executed:
- Steps not executed:
- Known deviations/limitations:

## Sources and further reading
Direct sources for important product behaviour, commands, safety constraints, and architectural claims.
```

## 10. Rules for commands, files, outputs, and diagrams

- Use numbered, small steps. One step should not conceal many unrelated actions.
- Explain flags and non-obvious syntax when first introduced. Reuse established commands later, but link back to the deeper explanation.
- Identify the working directory and shell for each non-trivial command. Use placeholders such as `<AWS_ACCOUNT_ID>` consistently, and explain how to obtain them. Never let a placeholder look like literal output.
- For the React app, distinguish development-server behaviour from a production build and static-file serving. Do not present `vite preview` as a production server; use it only for the local preview its documentation describes.
- For the FastAPI app, distinguish local development serving from the container/cluster runtime, and explain process lifecycle, graceful shutdown, concurrency/workers, and Kubernetes replica scaling when relevant. Do not recommend deprecated FastAPI base images.
- Explain the frontend/backend API contract and request path. Any CORS configuration must name the intended origins and avoid broad wildcards unless the lab's purpose is to analyse that specific risk.
- Explain that frontend variables compiled into browser assets are public. Never place an API key, model credential, database password, or other secret in a React/Vite `VITE_*` variable or frontend image.
- Provide complete, copyable configuration files when the learner is asked to create them. Mark filenames and their exact paths. Avoid ellipses in files that are meant to be run.
- Separate command, output, and explanation. Label output as `expected`, `representative`, or `captured`; never fabricate a captured transcript.
- Where output varies by version, region, ID, timing, or account, state which fields vary and show how to verify invariant conditions.
- Explain asynchronous operations and eventual convergence: what should change, how long the learner should allow for it where documented, and which observations prove the change occurred.
- Diagrams must show direction, ownership, and relevant trust/state boundaries. Follow every meaningful diagram with a step-by-step prose walkthrough. Avoid unexplained arrows.
- Any diagram or teaching abstraction must agree with the actual service behaviour described in cited documentation.
- Include both the successful path and at least one meaningful failure path for operational topics.

## 11. Troubleshooting and fault-injection standard

Use this loop consistently:

`Symptom → Locate → Observe → Form hypothesis → Test → Root cause → Fix → Verify → Prevent regression`

For each failure lab:

1. Start from a known-good baseline and show how to verify it.
2. Introduce one primary fault at a time so its effect can be distinguished. Multi-fault incidents may be used later as an advanced assessment and must explain the extra ambiguity.
3. State exactly what was changed and how to reverse it.
4. Require evidence before remediation.
5. Give at least two plausible hypotheses where that reflects the real diagnostic space, and show a discriminating test instead of listing guesses.
6. Verify system behaviour, not just object/process status.
7. Check for regressions at adjacent boundaries, such as application health versus Pod readiness, or a successful CI run versus a deployable image.
8. Include a short prevention discussion and, for larger incidents, a blameless incident summary with impact, detection, cause, remediation, and follow-up actions.

Fault scenarios must cover the failure classes in the agreed curriculum: broken Git history/collaboration; container build, configuration, permissions, networking and crash problems; Kubernetes scheduling, image, config, readiness and resource failures; pipeline/authentication/registry/deployment failures; and user-to-service-to-Pod-to-process tracing.

## 12. Validation gates

Every content file progresses through these gates. A gate may fail; do not continue to publication with a failed mandatory gate.

### Gate 0 — Scope and learning design

- One central lesson question or one lab outcome is explicit.
- Prerequisites, learner level, estimated effort, and success criteria are clear.
- The content connects to the wider SDLC and does not duplicate unrelated lessons.
- Simplifications and postponed topics are declared.

### Gate 1 — Evidence and citation integrity

- Each consequential technical claim has an appropriate source.
- Sources are real, accessible, relevant, and sufficiently specific.
- Claims match cited text and stated product versions.
- Expert attributions and quotations are exact and correctly attributed.
- Time-sensitive claims include a checked date.
- No source, output, test result, incident, or endorsement has been invented.

### Gate 2 — Safety, security, and cost

- Dangerous/destructive commands are clearly marked and constrained to the lab environment.
- IAM permissions are explained and scoped to the required actions; long-lived credentials are not encouraged where short-lived/role-based access is appropriate.
- No secret is committed, logged, baked into an image, or shown in an output.
- Public exposure, deletion, privilege escalation, cluster changes, and billable AWS resources receive explicit warnings and verification steps.
- Cleanup is practical, and cloud resource deletion is verified rather than assumed.
- The lab cannot accidentally target a learner's unrelated production context without an explicit guard/check.

### Gate 3 — Reproducibility and completeness

- A novice can determine prerequisites, directory, branch, shell, context/account, and initial state.
- All required files are complete and placed at exact paths.
- Commands are ordered, copyable, internally consistent, and version-aware.
- Expected output and verification conditions are present.
- Failure paths, reset, cleanup, and known limitations are documented.
- Links between prerequisites and follow-up files resolve.

### Gate 4 — Execution status and technical verification

- Locally executable steps are actually run wherever the chosen validation scope permits.
- Success path, fault injection, diagnosis, recovery, and cleanup are separately checked.
- Record exact tool versions, date, and tested revision.
- Any step not run is explicitly marked not executed; do not infer success from reading a command or from a partial run.
- For AWS steps, distinguish configuration review from an actual run in AWS. Mark AWS-dependent labs `partially-verified` or `blocked` when the cloud run was not performed.
- If only part of a lab is executed, list passed and unexecuted steps separately.

### Gate 5 — Learning and operational quality

- Each command explains what it does and why it is needed at the learner's current level.
- Success is checked from actual state/behaviour, not exit code alone.
- The diagnostic path tests hypotheses with evidence.
- The solution explains root cause and trade-offs and verifies recovery.
- The learner can explain what the result does not guarantee.
- The lesson connects to upstream/downstream SDLC stages.

### Gate 6 — Publication readiness

- Markdown syntax, code fences, links, diagrams, filenames, and IDs are checked.
- Version matrix and source register are updated.
- Source links are rechecked.
- Completion checklists and validation status are accurate.
- Known limitations and cloud costs are visible before the learner starts.
- No lab is labelled production-ready or fully verified unless the evidence justifies that label.

### Status vocabulary

Use only these statuses:

- `draft` — content is being written; not ready to use.
- `source-reviewed` — claim/source review passed; execution may not have occurred.
- `not-run` — no execution evidence exists.
- `locally-verified` — defined local scope was executed successfully; record exact scope.
- `AWS-verified` — documented AWS steps ran successfully in an AWS environment; record region, relevant versions and scope without exposing account secrets.
- `partially-verified` — some but not all required steps were executed.
- `blocked` — execution or validation could not proceed; explain why.
- `approved` — all mandatory gates for the declared validation scope passed.

A status must never imply broader verification than the evidence supports.

## 13. Suggested 18-week sequencing

This is a sequencing proposal for the confirmed Track II scope, revised to include the React + FastAPI system as the main full-stack workload. Exact lesson counts and student effort should be set in the course map. GroundOps, evidence discipline, source quality, safety, and troubleshooting are continuous threads throughout the 18 weeks.

| Week | Primary focus | Teaching content hours (labs excluded) | End-of-week evidence |
|---|---|---:|---|
| 1 | GroundOps foundations and system orientation: shell, files/processes/network observations, repository layout, React-to-FastAPI request path | 2.5 | Learner can run the local application and explain the browser, frontend, API, and observed state boundaries |
| 2 | GitCore: objects, hashes, trees, commits, refs, HEAD and content-addressed storage | 2.5 | Learner can explain the monorepo's commit graph and inspect Git state beyond the command surface |
| 3 | GitGraph: branches, merges, rebases, divergent history, conflict handling and recovery | 2.5 | Learner can recover a broken local history with a justified, verified procedure |
| 4 | GitHub collaboration: pull requests, reviews, protection, governance and branching trade-offs | 2.0 | A reviewed change to either frontend or API moves through a controlled collaboration path |
| 5 | ContainerCore: separate frontend/API images, build context, layers, cache, multi-stage builds and runtime capsule | 2.5 | Both components can be built and run separately, and learner can verify each component's behaviour |
| 6 | Container operations: Compose, frontend-to-API networking, ports, CORS, environment/configuration, secrets and registry | 2.5 | A multi-container local system works, and learner can diagnose a broken request path without guessing |
| 7 | ClusterCore: control plane, workers, API resources, Pods, ReplicaSets and Deployments for both components | 2.5 | Learner can explain how the frontend and API workloads are represented in cluster state |
| 8 | Desired state and reconciliation: controllers, scheduling, deployment conditions, rollouts and diagnosis | 2.5 | Learner can explain and investigate mismatch between desired and actual state for either workload |
| 9 | Service and network engineering: browser → ingress/edge → frontend/API Services → Pods, DNS, ports and HTTP flow | 2.5 | Learner can trace an actual request across the boundary and distinguish browser reachability from in-cluster reachability |
| 10 | Configuration and storage: ConfigMaps, Secrets, environment, frontend public config versus backend secrets, volumes and persistence | 2.0 | Learner can inject configuration safely, diagnose wrong API URLs/credentials, and prove no secrets enter frontend assets |
| 11 | ReleaseCore: GitHub Actions workflows, frontend/backend test jobs, dependency locks, build jobs and workflow permissions | 2.5 | A source change runs reproducible validation for both components with interpretable evidence |
| 12 | Delivery pipeline: separate image build/tag/publish, artifact identity, registry access, contract checks and deploy gates | 2.5 | Learner can trace a commit to the matching frontend and API images and diagnose a pipeline failure |
| 13 | AWS foundations: identity, least-privilege permissions, ECR repositories, image identity and release versioning | 2.5 | Learner can authenticate safely, publish both images, and explain the access path without exposing credentials |
| 14 | DeployCore: EKS architecture, cluster access, ingress/routing, frontend/API workload deployment and end-to-end verification | 3.0 | The full-stack application runs on learner-controlled EKS; a browser-initiated API request succeeds through the real route |
| 15 | OperateCore: probes, resources, scaling, rolling updates, frontend/API compatibility and rollback | 2.5 | Learner can make a controlled release, test the user journey, and recover from a bad API or frontend rollout |
| 16 | ObserveCore: frontend-visible errors, API logs, Kubernetes events, metrics, latency, correlation and dependency health | 2.5 | Learner can follow a browser symptom into API and infrastructure evidence, and state what the signals do not prove |
| 17 | FailureCore: broken Git/builds, image pull, routing/CORS, config, readiness, resource pressure, API failures and optional model-provider timeout | 3.0 | Learner diagnoses injected failures through evidence, verifies the recovery, and proposes proportionate prevention |
| 18 | GroundOps Production Build: end-to-end build/release/operate capstone, handover and postmortem | 3.0 | Learner demonstrates delivery and safe ownership of both frontend and API, including a failed release and evidence-backed recovery |

The optional ASP.NET Core comparison extension can be delivered as a clearly labelled alternative lab after the core API/container concepts or as instructor enrichment. Do not let it displace the required React + FastAPI integration work in the core 18-week sequence.

## 14. Capstone acceptance criteria

The capstone is not complete merely because the app is visible in a browser. At minimum, the learner must be able to:

- Trace separate frontend and backend changes from Git commit through review, CI, build, image identity, registry, deployment, and running workloads.
- Prove which exact application version is running.
- Explain the purpose and ownership of the browser, React static frontend, API contract, FastAPI backend, Kubernetes Services/Ingress, and underlying workloads.
- Trace a real browser request through the published route to the API and back; explain CORS behaviour when origins differ.
- Demonstrate a health/readiness distinction relevant to the API and distinguish it from end-to-end user journey success.
- Trace a request across frontend, backend, and infrastructure boundaries using observable evidence.
- Diagnose at least one injected failure without applying random fixes.
- Perform a justified recovery or rollback and verify the result.
- Explain secret and permission boundaries and show that no credentials were committed or baked into the image.
- Show the final state and cleanup of billable training resources.
- Submit a short operational handover/postmortem covering design choices, observed failure, root cause, evidence, recovery, and prevention actions.
- Demonstrate that frontend build-time configuration contains no secrets and that backend-only credentials never reach the browser or image layers.

## 15. Authoring workflow

1. Lock the environment matrix and application requirements.
2. Create the course map and dependency map across weeks/modules.
3. Research the central question for one lesson; build a source ledger before drafting claims.
4. Draft the lesson and its linked lab outline.
5. Create the complete reproducible lab and all supporting files.
6. Perform source, version, security, and cost reviews.
7. Execute the lab according to the declared validation scope; record results honestly.
8. Conduct a novice-readability pass and confirm that the learner can tell where each command runs and how to interpret the result.
9. Pass all publication gates.
10. Use one representative module as a calibration sample. Do not bulk-generate all 18 weeks until that sample meets the contract.

## 16. Initial source register

The following sources were checked as appropriate starting points on 2026-10-16. They are not blanket citations for every future claim; each lesson must cite the particular source that supports its wording. The exact version and support state must be checked again when each lab is authored and before publication.

- React team, **Installation** — current React starting options; also records that Create React App is deprecated: https://react.dev/learn/installation (accessed 2026-10-16).
- Vite, **Building for Production** and **Deploying a Static Site** — production build output and distinction between preview and production serving: https://vite.dev/guide/build and https://vite.dev/guide/static-deploy (accessed 2026-10-16).
- Vite, **Env Variables and Modes** — client-visible build-time variables and prohibition on placing secrets in `VITE_*`: https://vite.dev/guide/env-and-mode (accessed 2026-10-16).
- FastAPI, **FastAPI in Containers — Docker** — container packaging, dependency installation, command form, and runtime discussion: https://fastapi.tiangolo.com/deployment/docker/ (accessed 2026-10-16).
- FastAPI, **CORS (Cross-Origin Resource Sharing)** — browser origin semantics and allowed-origin configuration: https://fastapi.tiangolo.com/tutorial/cors/ (accessed 2026-10-16).
- npm, **npm ci** — clean dependency installation behaviour for automated environments: https://docs.npmjs.com/cli/commands/npm-ci/ (accessed 2026-10-16).
- Python, **Status of Python versions** — version lifecycle and support status; use this to choose a compatible version rather than blindly selecting the newest release: https://devguide.python.org/versions/ (accessed 2026-10-16).
- Microsoft, **.NET lifecycle** — support windows and lifecycle checks: https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-and-net-core (accessed 2026-10-16).
- Microsoft Learn, **Run an ASP.NET Core app in Docker containers (.NET 10 view)** — ASP.NET Core-specific container workflow: https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-10.0 (accessed 2026-10-16).
- Git project, **Git Internals — Git Objects** — object database and content-addressed model: https://git-scm.com/book/en/v2/Git-Internals-Git-Objects (accessed 2026-10-16).
- Docker Docs, **Building best practices** — image and build practices: https://docs.docker.com/build/building/best-practices/ (accessed 2026-10-16).
- Kubernetes, **Workloads** — workload objects and Pods: https://kubernetes.io/docs/concepts/workloads/ (accessed 2026-10-16).
- Kubernetes, **Liveness, Readiness, and Startup Probes** — probe purposes and behaviour: https://kubernetes.io/docs/concepts/workloads/pods/probes/ (accessed 2026-10-16).
- Kubernetes, **Debug Running Pods** and **Troubleshooting Applications** — diagnostic techniques and failure investigation: https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/ and https://kubernetes.io/docs/tasks/debug/debug-application/ (accessed 2026-10-16).
- GitHub Docs, **Workflow syntax for GitHub Actions** — workflow structure and action references: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax (accessed 2026-10-16).
- AWS, **Amazon EKS User Guide** and **Best Practices Guide** — EKS-specific configuration and operations: https://docs.aws.amazon.com/eks/ and https://docs.aws.amazon.com/eks/latest/best-practices/introduction.html (accessed 2026-10-16).
- Google, **Site Reliability Engineering: Monitoring Distributed Systems** — monitoring concepts and operational design: https://sre.google/sre-book/monitoring-distributed-systems/ (accessed 2026-10-16).
- DORA, **Research and Core Model** — software delivery/reliability capabilities and measurement context: https://dora.dev/research/ (accessed 2026-10-16).

## 17. Teaching-hour budget, context budget, and zero-tolerance quality gates

### 17.1 Required teaching-content volume

The course must contain **45.5 hours of teaching content across 18 weeks**, within the required 40–50-hour range. The weekly allocation is listed in Section 13 and totals 45.5 hours.

For this specification, *teaching content* means the detailed instructional material an instructor can teach from: first-principles explanations, architecture and request-flow walkthroughs, causal reasoning, worked examples, annotated command/output interpretation, trade-offs, common misconceptions, and evidence-backed explanations. It is not a list of slide headings or a thin speaking outline.

The teaching-hour total **excludes**:
- Learner-executed labs and troubleshooting exercises.
- Independent practice, homework, assessments, quizzes, and capstone execution.
- Breaks, setup time, and general discussion time that is not represented in the authored teaching material.

A lesson can reference a lab but must not count the time spent performing that lab toward the 45.5 teaching hours. Lab duration must be estimated and tracked separately. The course map must include both `teaching_minutes` and `lab_minutes` as separate fields; do not merge them into one estimate.

For each week, the authored lesson files must have a plausible combined teaching-time estimate matching the weekly allocation. Time estimates must be based on the amount of explanatory content and worked reasoning, not padded with repeated text. The instructional material should include teacher-facing notes or detailed prose sufficient for a competent instructor to teach the topic without inventing missing explanations on the fly.

The full 18-week plan must not be considered content-complete until:
1. The teaching-time estimates total between 40 and 50 hours, with the current target set at 45.5 hours.
2. Each week's intended concepts and teaching-time allocation are represented by actual lesson files.
3. Lab effort is separately estimated and excluded from the teaching-hour total.
4. The hour count is recalculated after substantive edits; deleting or shortening material may invalidate the total.

### 17.2 Context-window budget and mandatory stop/handoff rule

Quality takes precedence over throughput. Do not attempt to draft all 18 weeks, a full course, or multiple large lessons/labs in one generation batch.

- Treat **40% of the usable context window as the maximum budget for any single content-generation batch**, including the instructions and source material that must remain in context, the draft being produced, and the verification/revision pass.
- Reserve the remaining context capacity for source comparison, consistency checks, corrections, and a reliable handoff. Never deliberately use the full context window just because capacity remains.
- Prefer one self-contained lesson or one self-contained lab per batch. A lab plus many lengthy supporting files may need to be split into smaller, explicitly linked batches.
- Before beginning a new substantial unit, assess whether the remaining context budget is enough to draft and review it under the 40% ceiling. If it is not, **do not begin or continue that unit**.
- If context usage is not directly measurable in the interface, use a conservative batch size and stop at the natural unit boundary; do not claim an exact percentage measurement that is unavailable.
- If the work approaches or would exceed the 40% budget, stop generating new material. Do not compress, omit citations, skip validation, or push through in order to finish.

At a stop boundary, update `course-state.md` and create a concise, self-contained handoff summary and ready-to-copy next-session prompt. The handoff must include:
1. The objective and exact scope of the current unit/module, including whether the module is complete or intentionally incomplete.
2. Confirmed decisions and constraints that must not be reopened.
3. Artifacts/files completed, with exact paths and statuses.
4. The precise point reached and what remains, in execution order.
5. The architecture, terminology, IDs, versions, naming conventions, and dependency relationships already established.
6. Sources consulted, claims still needing verification, and any source/version currentness concerns.
7. Tests/commands actually executed, results observed, and steps not executed.
8. Known defects, blockers, risks, and unresolved decisions.
9. The next single recommended action.
10. An explicit instruction not to regenerate or overwrite approved material unless a specific defect requires it.

The handoff must describe actual state, not intended state. It must not say work is complete if any mandatory content, citations, tests, or review gates remain. Continue only in a new chat from the handoff rather than extending the current session beyond the limit.

#### 17.2.1 Strict module-overflow stop rule

The 40% ceiling is a hard stop, including when a single module is too large to finish within the current session. Do not exceed the ceiling to finish a module, do not lower the quality bar, and do not keep working in the same session after deciding that the remaining module work would breach the ceiling.

- Estimate scope before authoring a module or substantial continuation. If a complete planned generation batch/module cannot be drafted, checked, and recorded within the 40% budget, reduce the current session's scope to the largest safe, self-contained boundary **before starting**. If that boundary has already been reached or would still exceed the ceiling, stop and hand off.
- If context pressure appears while a module is incomplete, stop at the current safe point. Do not improvise a compressed ending or imply that the module is complete. Record the exact completed portion and the exact next file/section to work on.
- Update `course-state.md`, save all completed artifacts, and provide a ready-to-copy prompt that tells the next chat to read the state file and this specification, preserve approved work, and continue from the recorded point. Explicitly ask the user to start a new chat with that prompt. Do not continue authoring the interrupted module in the current session after this handoff decision.
- The module may continue across multiple fresh chats if necessary. Each session must independently stay under the same 40% ceiling and update the persistent state before ending. The number of sessions is not a reason to skip validation.
- Do not claim to have measured exact context percentage unless the interface exposes a reliable measure. When in doubt, stop conservatively and describe the limit as an estimate.

### 17.3 Evidence-first quality standard

“Extremely paramount” quality means **no known mandatory defect may pass a publication gate**; it does not mean claiming that errors are impossible. Every file must be checked against the contract, and any unverified aspect must be visible rather than hidden behind confident wording.

Apply these release rules:

- **No fabricated evidence:** never invent citations, quotations, output, test execution, AWS execution, incident facts, version numbers, or expert recommendations.
- **No unsupported certainty:** if a claim cannot be established, narrow it, qualify it, research it, or mark it unresolved; do not fill gaps with plausible-sounding prose.
- **No success-by-exit-code:** independently inspect state and relevant end-to-end behaviour.
- **No silent version drift:** commands, configuration, dependencies, outputs, and citations must agree with the declared version matrix.
- **No copy/paste traps:** check complete files, path references, shell syntax, quoting, placeholders, command order, line endings where relevant, and reset/cleanup instructions.
- **No dangerous implicit context:** before destructive, privileged, externally exposed, or billable operations, explicitly assert the intended repository/context/account/cluster and provide a stop condition if it does not match.
- **No unmarked simplification:** identify model boundaries and distinguish documented behaviour from teaching abstraction.
- **No incomplete handoff:** at the 40% context boundary, preserve status and remaining work; do not silently truncate the course or imply completion.
- **No unsupported “production-ready” label:** a tutorial workload can demonstrate production practices without being production-ready for every organisation. State what has and has not been hardened.

### 17.4 Required quality passes for every lesson/lab

Run the following passes independently; passing one does not imply passing another.

1. **Scope pass:** the central question/outcome, prerequisites, time, SDLC position, and dependency links are explicit.
2. **Claim-and-citation pass:** break the lesson into consequential claims and verify the relevant section of each cited source. Check dates, versions, terminology, and source authority.
3. **Internal-consistency pass:** compare all commands, file paths, resource names, labels, ports, environment variables, API routes, image tags, identities, and expected outputs across the lesson, lab, and supporting files.
4. **Security/cost/safety pass:** review privileges, exposed ports, CORS, secrets, Git history, image layers, cloud exposure, destructive actions, AWS cost, cleanup, and confirmation of target context.
5. **Reproducibility pass:** verify prerequisites, complete files, command order, expected observations, failure injection, diagnosis, fix, acceptance criteria, and reset from a clean starting state.
6. **Execution pass:** execute the declared validation scope where available. Record exact tests performed and their results. If execution is unavailable, mark it `not-run`, `partially-verified`, or `blocked` as appropriate and say why.
7. **Novice-readability pass:** ensure a learner with programming/CLI familiarity but no production DevOps background knows where to run each command, what it changes, why it matters, and how to interpret a different result.
8. **SDLC and operations pass:** verify that the material connects to upstream/downstream components, identifies guarantees and non-guarantees, and includes safe rollback/recovery where applicable.
9. **Mechanical pass:** check Markdown structure, code fences, links, IDs, referenced filenames, duplicate sections, unresolved placeholders, and generated repository layout. Use automated linters/checkers when available, and report if they were not run.
10. **Final defect sweep:** make a final read after edits so corrections have not introduced inconsistencies elsewhere.

A publication gate fails if there is a known factual contradiction, broken required step, unsupported critical claim, unsafe default, unrecoverable lab state, missing required citation, undisclosed unexecuted verification, or mismatch between the stated and actual validation status. Fix the defect and repeat affected passes before marking the file `approved`.

### 17.5 Review ledger

Maintain a course-level `quality-ledger.md` with one row per lesson/lab and these fields:

- Content ID and exact path.
- Scope/learning-design review status.
- Sources/claim audit status and date.
- Version consistency status.
- Security/cost/safety status.
- Reproducibility and execution status.
- Novice-readability status.
- SDLC/architecture consistency status.
- Markdown/link/mechanical check status.
- Known limitations and defects.
- Reviewer status and next required action.

Do not mark the whole module approved until all its mandatory files pass. Do not mark the course approved until all required lessons, labs, dependencies, and the final capstone pass their applicable gates.

---

### 17.6 Mandatory persistent progress state after every generation

`course-state.md` is the authoritative continuation record. Updating it is part of every content-generation transaction, not an optional end-of-course administrative task. Any session that creates, revises, reviews, validates, or approves course artifacts must update this file before reporting completion. If no teaching files changed, record that fact and update the session activity/status so the next chat has a correct continuation point.

The state record must retain at least:

- Specification version and last update date.
- Current overall phase (specification, environment lock, course map, lesson authoring, lab authoring, validation, or release readiness).
- Confirmed decisions and unresolved decisions; never ask the user again for a decision already confirmed.
- Planned teaching-content denominator: **2,730 minutes / 45.5 hours**. Track both authored teaching minutes and approved teaching minutes separately, based on real lesson files and their estimated teaching times. Report each as `minutes / 2,730` and percent; never count plans, headings, outlines, or labs as authored teaching content.
- A week-by-week 18-row status table with planned hours, course-map status, lesson status, lab status, teaching minutes authored/approved, and blockers. Until the detailed file-level course map fixes the lab denominator, report lab coverage as a count/status and explicitly state that a percentage is not yet available; do not invent a denominator.
- File inventory with exact path, stable ID, content type, current status (`not-started`, `draft`, `source-reviewed`, `partially-verified`, `locally-verified`, `AWS-verified`, `blocked`, `approved`), and next action.
- Source research performed, the access/check date for time-sensitive sources, verification work actually performed, unexecuted checks, defects, and approvals.
- Exact next action and a ready-to-copy next-chat prompt.

Use this coverage arithmetic consistently:

- **Authored teaching coverage** = sum of estimated teaching minutes in actual lesson files in `draft` or a later content state, divided by 2,730. Keep drafts and source-reviewed material visible as unapproved.
- **Approved teaching coverage** = sum of estimated teaching minutes in lesson files with status `approved`, divided by 2,730.
- **Lab coverage** = authored, reviewed, executed, and approved lab counts against the lab total established by the detailed course map. Before that map is approved, show `denominator not established`, not a percentage.
- **Module completion** requires all planned lesson and lab artifacts for that module to exist and pass their applicable quality gates. An authored-volume percentage must never be presented as a quality/approval percentage.

At the start of a new chat, read `course-state.md` and this specification before taking action. Continue from the recorded next action; preserve file IDs, names, architecture, and approved content. Do not regenerate material merely to establish context. If the state file and chat history conflict, flag the discrepancy and reconcile the actual files/status before proceeding.

No generation batch is complete until all generated/changed files are saved, the quality ledger is updated where applicable, and `course-state.md` accurately reflects coverage and the next action. This rule applies even to a small generation batch and to an intentionally incomplete module stopped for context reasons.

## Approval checklist

- [ ] The confirmed learner, React + FastAPI primary workload, optional ASP.NET Core comparison, single monorepo, environment progression, and 18-week cadence are preserved.
- [ ] Browser-to-API routing, HTTP/CORS, frontend public configuration, and backend-only secrets are explicit parts of the course design.
- [ ] The lesson and lab templates meet the intended novice-professional standard.
- [ ] Citation and source validation rules are accepted.
- [ ] The execution-status vocabulary prevents unrun steps from being described as tested.
- [ ] Cost, security, secrets, cleanup, and safe recovery gates are mandatory.
- [ ] The environment matrix is to be locked before writing the first executable lab.
- [ ] One representative module will be reviewed before bulk authoring begins.
- [ ] Teaching content totals 40–50 hours across 18 weeks, with the planning target fixed at 45.5 hours and lab effort excluded.
- [ ] Weekly teaching-minute and lab-minute estimates are tracked separately.
- [ ] Each generation batch stays within the 40% usable-context budget; work stops before exceeding it and creates a factual handoff summary for the next chat.
- [ ] The evidence-first quality passes and course-level `quality-ledger.md` are used; known mandatory defects block approval.
- [ ] `course-state.md` is updated after every generation/review/validation batch with actual coverage, file statuses, critical continuation context, and the next action.
- [ ] If any module or continuation would breach the 40% context ceiling, the current session stops, writes a factual handoff and ready-to-copy prompt, and asks the user to continue in a new chat.
- [ ] No authored/approved coverage percentage is inferred from a high-level plan; coverage is calculated from actual lesson files and their recorded teaching minutes.

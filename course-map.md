# Track II — 18-Week File-Level Course Map (Planning Baseline)

**Status:** Draft map for review. This map establishes planned file IDs and separate lab-effort estimates; the figures below are estimates, not delivered or approved content.  
**Teaching content:** 2,730 minutes / 45.5 hours. Labs, setup time, independent practice, assessment execution and capstone execution are excluded from this teaching-hour denominator.  
**Application thread:** React SPA + Python FastAPI API in a single monorepo; separate build/test/image/deployment lifecycle for each component. Optional ASP.NET Core comparison is not a second mandatory path.

## File and delivery rules

- Each lesson has a separate Markdown file under `week-NN-*/lessons/`.
- Each lab has a separate Markdown file under `week-NN-*/labs/`.
- Lessons include instructor timing, narrative/problem, first-principles derivation, worked example, architecture flow, trade-offs, citations, exit checks and transition forward.
- Labs include complete prerequisites, exact starting state, files, commands, expected observations, evidence collection, failure injection, verification, reset/cleanup, safety controls and known unexecuted tests.
- Lab minutes are separately planned and never added to teaching minutes.
- Lab count denominator at this planning stage: **36 planned lab files** (two per week). This is a planning denominator, not a claim that any labs have been authored, executed or approved.

## Week-by-week map

| Week | Planned teaching focus | Teaching minutes | Lesson IDs (planned) | Lab IDs (planned) | Estimated lab execution time | Evidence students must produce |
|---:|---|---:|---|---|---:|---|
| 1 | **GroundOps:** human infrastructure layer, system orientation, React-to-FastAPI request path, evidence before action | 150 | GRO-L01, GRO-L02, GRO-L03 | GRO-LAB01, GRO-LAB02 | 180 min | Request trace map; screenshots/text of browser Network + API evidence; written root-cause explanation for at least one injected failure. |
| 2 | GitCore: blobs, trees, commits, refs, HEAD, hashing, content-addressed objects | 150 | GIT-L01, GIT-L02 | GIT-LAB01, GIT-LAB02 | 150 min | Object database inspection; trace commit/ref relationships using output, not memorized labels. |
| 3 | GitGraph: branch pointers, DAGs, merge, rebase, conflict, rejected push and safe recovery | 150 | GRA-L01, GRA-L02 | GRA-LAB01, GRA-LAB02 | 180 min | Before/after graph, command transcript, recoverability check, explanation of rewritten history impact. |
| 4 | GitHub collaboration, PR/review, branch protection, governance, branching strategy trade-offs | 120 | GH-L01, GH-L02 | GH-LAB01, GH-LAB02 | 150 min | PR evidence, rule test, decision note comparing trunk-based and feature branches. |
| 5 | ContainerCore: image vs container, Dockerfile, layers/cache, multi-stage builds, image metadata | 150 | CON-L01, CON-L02 | CON-LAB01, CON-LAB02 | 180 min | Build logs, image inspection, repeat-build comparison, size and runtime observation. |
| 6 | Compose, multi-service networking, configuration/secrets, CORS and registries | 150 | CON-L03, NET-L01 | NET-LAB01, NET-LAB02 | 180 min | Request path within Compose, deliberate wrong-host/port diagnosis, proof no secret is baked into frontend assets. |
| 7 | Kubernetes architecture; control plane, scheduler, controllers, etcd, kubelet, runtime; Pods and Deployments | 150 | K8S-L01, K8S-L02 | K8S-LAB01, K8S-LAB02 | 180 min | Resource map, applied-manifest vs live-state comparison, Pod and Deployment evidence. |
| 8 | Desired state, reconciliation, rollout, rollout history, state discrepancy diagnostics | 150 | DES-L01, DES-L02 | DES-LAB01, DES-LAB02 | 180 min | Demonstrate drift, observe reconciliation, verify revision and rollback. |
| 9 | Service, DNS, port/targetPort, ingress, cluster vs external traffic, browser/API routing | 150 | NET-L02, NET-L03 | NET-LAB03, NET-LAB04 | 180 min | Hop-by-hop connectivity matrix and proof identifying the first failing boundary. |
| 10 | ConfigMaps, Secrets, frontend public config, runtime injection, volumes and workload state | 120 | CFG-L01, CFG-L02 | CFG-LAB01, CFG-LAB02 | 150 min | Safe configuration change, rotation/visibility exercise, persistence trade-off explanation. |
| 11 | CI and delivery semantics; GitHub Actions events/jobs/runners/steps, tests, workflow permissions | 150 | REL-L01, REL-L02 | REL-LAB01, REL-LAB02 | 180 min | Reproducible pipeline run, intentional failed check, permissions review. |
| 12 | Independent frontend/API builds, artifact traceability, tags, registry push/pull, provenance concepts | 150 | REL-L03, REL-L04 | REG-LAB01, REG-LAB02 | 180 min | Commit-to-artifact mapping, image digest proof, failed-publish diagnosis. |
| 13 | AWS identity, ECR, permissions, credential paths, scoped access and image lifecycle | 150 | AWS-L01, AWS-L02 | AWS-LAB01, AWS-LAB02 | 180 min | Identity evidence, successful least-privilege push/pull, denied action explained, cost/cleanup proof. |
| 14 | EKS deployment, cluster/app boundaries, load balancing/ingress, external end-to-end path | 180 | EKS-L01, EKS-L02, EKS-L03 | EKS-LAB01, EKS-LAB02 | 240 min | Real EKS deployment evidence; browser request traced to API; resource inventory and cleanup record. |
| 15 | Probes, restart semantics, CPU/memory requests/limits, replicas/autoscaling, rollout safety and rollback | 150 | OPS-L01, OPS-L02 | OPS-LAB01, OPS-LAB02 | 180 min | Probe failure observed; safe rollout/rollback transcript; reasoned resource configuration. |
| 16 | Observability: browser/network signals, API logs, events, metrics, latency, correlation and diagnosis | 150 | OBS-L01, OBS-L02 | OBS-LAB01, OBS-LAB02 | 180 min | Evidence bundle correlated across UI/API/runtime; distinguish symptoms from causes. |
| 17 | FailureCore: cross-layer injected incidents, hypothesis testing, recovery and prevention | 180 | FAIL-L01, FAIL-L02, FAIL-L03 | FAIL-LAB01, FAIL-LAB02 | 240 min | Incident timeline, competing hypotheses, evidence for root cause, rollback/recovery proof, prevention item. |
| 18 | GroundOps production build/capstone, operational handover, review, incident postmortem | 180 | CAP-L01, CAP-L02, CAP-L03 | CAP-LAB01, CAP-LAB02 | 300 min | End-to-end release evidence, runbook, recovery exercise, architecture explanation and blameless postmortem. |
| **Total** |  | **2,730 min / 45.5 h** | **40 planned lesson files** | **36 planned lab files** | **3,390 min / 56.5 h estimated lab time** |  |

## Week 1 — currently in this batch

### Lessons

| ID | File | Teaching minutes | Intended result |
|---|---|---:|---|
| GRO-L01 | `week-01-groundops/lessons/GRO-L01-human-infrastructure-layer.md` | 45 | Learner explains why generated artifacts do not remove human responsibility; defines the production operating contract. |
| GRO-L02 | `week-01-groundops/lessons/GRO-L02-trace-the-full-stack-request.md` | 55 | Learner traces browser → React → HTTP → FastAPI → HTTP response → browser rendering and identifies boundary-specific failure evidence. |
| GRO-L03 | `week-01-groundops/lessons/GRO-L03-evidence-first-operations.md` | 50 | Learner separates observation from hypothesis, uses a diagnostic loop, and verifies fixes without unsafe guesswork. |
| **Week 1 total** |  | **150** |  |

### Labs

| ID | File | Planned learner time | Intention |
|---|---|---:|---|
| GRO-LAB01 | `week-01-groundops/labs/GRO-LAB01-run-and-trace-the-request.md` | 90 min | Start the supplied React/FastAPI workload and capture proof for each boundary. |
| GRO-LAB02 | `week-01-groundops/labs/GRO-LAB02-diagnose-the-broken-request-path.md` | 90 min | Diagnose API-unavailable and origin/CORS failures using evidence, then verify and prevent regression. |

The first lesson batch does not count toward approved coverage until reviewed and passed through all required gates. The two Week 1 lab guides are planned/created, but their exact version lockfiles are not included and target-version execution has not been confirmed; they remain unapproved.

## Source-policy anchor list for future map expansion

- [Git Book — Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)
- [React docs](https://react.dev/learn)
- [Vite guide](https://vite.dev/guide/)
- [FastAPI first steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Docker image concept](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)
- [Kubernetes probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/)
- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [AWS EKS documentation](https://docs.aws.amazon.com/eks/)
- [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

# Track II — Environment Matrix (Initial Lock Proposal)

**Status:** Draft for review; Week 1 baseline researched on 2026-10-16. This is not a claim that every combination has been tested.  
**Purpose:** Establish an explicit runtime baseline for authoring and validating the React + FastAPI path. Lock cloud and Kubernetes versions only when those modules are reached and validated against EKS support policy.

## 1. Operating-system and shell policy

| Area | Proposed baseline | Status | Notes |
|---|---|---|---|
| Primary shell | Bash | Working assumption | All command blocks are Bash unless explicitly labelled otherwise. |
| Windows | Ubuntu on WSL2 | Working assumption, not yet learner-confirmed | Run the repo, Node, Python tooling, and Docker integration from the Linux filesystem where possible. Do not silently mix PowerShell commands into Bash labs. |
| macOS | Native terminal with Bash-compatible commands | Compatibility note required | Homebrew paths, `python3` naming, filesystem case sensitivity, and Docker Desktop networking may differ. Validate before marking OS support approved. |
| Native Linux | Ubuntu 24.04 LTS baseline | Proposed primary Linux target | Exact patch and architecture to record in test evidence. Other distributions are not assumed equivalent. |
| Browser | Current stable Chromium-based browser with DevTools | Proposed baseline | Browser version must be recorded during final validation. Firefox may be used as a secondary cross-check, not the only validated browser. |
| Line endings | UTF-8; LF in repository | Required | Add `.gitattributes` when repository setup is established; avoid platform-specific line-ending failures. |

**Open decision:** the cohort's dominant operating system has not been confirmed. This does not block the conceptual lessons or the Bash-first local lab draft, but OS coverage must be confirmed before release approval.

## 2. Week 1 runtime baseline

The versions below are the source-checked baseline proposed for the first lab. Re-check the release pages and package compatibility at publication time; record exact command output in `quality-ledger.md` after execution.

| Component | Proposed version | Why this choice | Evidence / status |
|---|---|---|---|
| CPython | **3.14.8** | Current Python 3.14 maintenance release found on Python.org on 2026-10-16. FastAPI metadata lists Python 3.14 support. The course uses no model SDK in the base lab; AI-provider SDK compatibility must be separately verified before an optional integration is added. | Source-checked; not installed/tested at this exact patch in the lab. [Python 3.14.8](https://www.python.org/downloads/release/python-3148/) · [FastAPI package metadata](https://pypi.org/project/fastapi/) |
| Python dependency manager | **uv**, version to be pinned in bootstrap tooling | Use `pyproject.toml` and `uv.lock`; `uv sync --locked` is the reproducibility gate once the lock is committed. | Workflow supported by [uv project lock/sync docs](https://docs.astral.sh/uv/concepts/projects/sync/). Exact uv release pin remains a publication task. |
| FastAPI | **0.143.2** | Version shown in PyPI release files on 2026-10-16; package metadata lists Python 3.14. | Source-checked; not runtime-tested at this exact version. [PyPI FastAPI](https://pypi.org/project/fastapi/) · [First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/) |
| Uvicorn | **0.54.0**, resolved by the selected FastAPI standard extra unless the committed lock says otherwise | Version shown in PyPI release history; it supports Python 3.14. A committed lockfile, not this table alone, is the authoritative transitive dependency record. | Source-checked; not runtime-tested at this exact version. [PyPI Uvicorn](https://pypi.org/project/uvicorn/) |
| Node.js | **24.22.0 LTS line** | Node official download archive lists Node 24 as LTS and 24.22.0 as available/updated on 2026-10-14. | Source-checked; not installed/tested at this exact patch in the lab. [Official Node 24 archive](https://nodejs.org/en/download/archive/v24) |
| npm | **11.19.1** bundled with Node 24.22.0 | Keep npm version consistent with the selected Node distribution; record `npm --version`. | Source-checked on 2026-10-16 through the [official Node 24 archive](https://nodejs.org/en/download/archive/v24), which lists npm 11.19.1 for Node 24.22.0. The prior draft value 11.9.0 was a typo. |
| React / React DOM | **19.3.1** | Latest stable tag displayed by npm on 2026-10-16. Use exact versions, not floating ranges, in `package.json`. | Source-checked; client build not executed. [React on npm](https://www.npmjs.com/package/react) |
| Vite | **8.3.4** | Latest stable tag displayed by npm on 2026-10-16. Vite documents Node 20.19+ or 22.12+ compatibility; Node 24 is above that minimum. | Source-checked; client build not executed. [Vite on npm](https://www.npmjs.com/package/vite) · [Vite guide](https://vite.dev/guide/) |
| React Vite plugin | **@vitejs/plugin-react 6.1.2** | Latest stable tag displayed by npm on 2026-10-16. | Source-checked; client build not executed. [Plugin on npm](https://www.npmjs.com/package/@vitejs/plugin-react) |
| API and frontend ports | API `127.0.0.1:8000`; Vite `127.0.0.1:5173` | Explicit local ports make the request path and origin mismatch observable. These are training defaults, not production deployment ports. | Lab-defined; check that ports are free before execution. |
| API origin allowlist | `http://127.0.0.1:5173` | Exact origin matches the lab URL. `localhost` and `127.0.0.1` are different hosts and therefore different origins. | Grounded in [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) and [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/). |

### Dependency reproducibility rules

1. Exact direct dependency versions belong in `pyproject.toml` and `package.json`.
2. `uv.lock` and `package-lock.json` must be generated and checked into the course repository by the release maintainer after the chosen baseline is resolved and built successfully.
3. Learner clean installs use `uv sync --locked` and `npm ci`, not an untracked dependency resolution.
4. The generated draft does **not** include verified lockfiles because the target package set could not be installed and built during this generation. That is an explicit release blocker, not an implied success.
5. A dependency update requires the lockfiles, test evidence, and this matrix to be updated together.

## 3. Later-track tooling — not yet locked

These versions must be researched and frozen before authoring executable labs that depend on them. Do not assume the latest version is automatically compatible with EKS or the rest of the course.

| Component family | Required decision | Gate before associated lab authoring |
|---|---|---|
| Docker Engine / Docker Desktop | Supported edition and version, OS-specific install path, Compose plugin version | Confirm platform support, build/run, port mapping, logs, volumes, cleanup, and a reproducible sample build. |
| Local Kubernetes | Choose a maintained local distribution (e.g. kind or minikube) and cluster version | Confirm reproducible cluster creation, ingress/network behaviour used in lessons, image-loading strategy, and cleanup. |
| `kubectl` | Pin a version compatible with chosen local and EKS cluster versions | Check version-skew policy against official Kubernetes docs. |
| AWS CLI | Supported v2 release; verify installation by OS | Validate identity discovery, least-privilege role path, and failure modes without long-lived credentials in the repository. |
| EKS Kubernetes version | Choose a version supported by AWS in the target region at publication time | Confirm EKS lifecycle, add-on compatibility, availability, cost and cleanup. Never teach an EKS version solely because it is newest. |
| ECR / IAM | Image registry path; learner role and scoped policies | Use least privilege, avoid static keys in files, validate login/push/pull and deny cases. |
| Ingress/load balancing | Choose AWS-supported architecture (controller / load balancer integration) | Verify current AWS guidance, public exposure and cost, TLS/domain setup, cleanup, and browser-to-API route. |
| Telemetry | Pin Prometheus/Grafana or managed equivalent for local and cloud labs | Validate metric labels, retention, resource requirements, and cleanup. |
| GitHub Actions | Use a fixed runner image and immutable action references where policy requires | Record runner image assumptions; apply least-privilege workflow permissions and secret-handling review. |

## 4. Verification status legend

- **Source-checked:** relevant primary source was consulted; this does not mean a command was executed.
- **Static-reviewed:** source/config files were reviewed for consistency; does not establish runtime compatibility.
- **Locally executed:** actual command/test run is recorded with environment details.
- **Cloud-executed:** corresponding operation was run against a real AWS resource; include region, resource type, date, cost notes and cleanup proof. Never apply this status to local simulation.
- **Approved:** all required gates for that artifact pass. Missing a lockfile or required execution evidence prevents approval where those are release requirements.

## 5. Source register consulted for this matrix

- [Python 3.14.8 release page](https://www.python.org/downloads/release/python-3148/)
- [FastAPI PyPI metadata and release files](https://pypi.org/project/fastapi/)
- [Uvicorn PyPI metadata and release files](https://pypi.org/project/uvicorn/)
- [Node.js official v24 archive](https://nodejs.org/en/download/archive/v24)
- [React npm package](https://www.npmjs.com/package/react)
- [Vite npm package](https://www.npmjs.com/package/vite)
- [@vitejs/plugin-react npm package](https://www.npmjs.com/package/@vitejs/plugin-react)
- [uv locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/)

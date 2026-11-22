---
id: GIT-L02
title: "How does Git assemble and name a version?"
module: "GitCore and GitGraph"
week: 2
estimated_time: "75 minutes"
status: draft
prerequisites:
  - "GIT-L01 — What does a Git object ID identify?"
  - "Week 1 GroundOps — evidence-first operation"
version_scope:
  - "Git command-line; current branch-attached example uses the standard files reference backend"
---

# How does Git assemble and name a version?

**Before the explanation:** you stage README.md, edit it again, then commit without another `add`. Predict which content is recorded and which state can remain different afterward. Also predict whether “tests passed on main” identifies one lasting version.

## The situation

A source repository contains a React frontend and a FastAPI backend. A teammate asks you to inspect “the version that passed the test.” You can see the files in your working directory, but that directory might contain uncommitted changes. A branch name such as `main` is convenient, but the branch can move. What object describes a recorded project version, and how is that object reached by a human-friendly name?

This lesson assembles the model from the objects introduced in GIT-L01. The aim is to learn the relationships so that command output becomes evidence, not a collection of vocabulary words.

## What must we explain or decide?

The central question is:

> How does Git connect file content into a project snapshot, record a commit, and let names such as `main` and `HEAD` resolve to that commit?

By the end, you should be able to inspect a tree and commit, identify their relationship, explain why a commit is not merely a diff, and verify what `HEAD` means in the branch-attached state.

## Start with what we can observe

In a repository with at least one commit, run these commands from the repository root:

```bash
git status --short
git rev-parse HEAD
git cat-file -p HEAD
git rev-parse 'HEAD^{tree}'
git ls-tree HEAD
git symbolic-ref HEAD
```

Do not simply read the command names and guess. For each output, record what is an object ID, what is a symbolic name, and what relationships connect them. If the repository has no commit yet, `HEAD` can name an as-yet-unborn branch and the commit-inspection commands will not have a commit object to show. The lab starts from a clean course copy, so it creates the initial commit before inspecting these relationships.

## Derive the design

### Think of a dispatch manifest

| Familiar item | Git relationship |
|---|---|
| Goods and editable preparation notes | Working tree |
| Proposed packing list | Index: the next proposed snapshot |
| Frozen nested contents manifest | Trees connecting names/modes to blobs |
| Dispatch record naming a manifest and earlier records | Commit with tree and parent links |
| Movable “current shipment” label | Branch reference |
| Desk note selecting that label | Attached `HEAD` naming the branch |

**Where the comparison stops helping:** Git reuses objects rather than physically copying every item. Client timestamps are not a trusted clock; a signature is not approval. Packing stories do not define merge rules, sparse indexes or external build inputs. Use the analogy to separate roles, then inspect the actual Git relationships.

### 1. A blob cannot describe a folder listing

GIT-L01 established that a blob contains content but not its path. A complete source snapshot still needs to answer:

- Which paths exist?
- Which object ID provides each file's content?
- Which entries are directories, files, executable files, symbolic links, or other supported entry types?
- How are nested folders represented?

A **tree** object supplies the directory-like structure. Its stored entries contain mode, name and binary object ID; inspection tools infer the displayed object type from the mode. An entry can reference a blob, another tree (a subtree), or a gitlink for a submodule commit. In simplified form:

```text
root tree
├── blob <id>  .gitignore
├── blob <id>  README.md
├── tree <id>  backend
│   ├── blob <id>  main.py
│   └── blob <id>  pyproject.toml
└── tree <id>  frontend
    ├── blob <id>  package.json
    └── tree <id>  src
        ├── blob <id>  App.jsx
        └── blob <id>  main.jsx
```

This diagram is conceptual, not a claimed listing from every starter-app version. The Git book's [Git Objects chapter](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) shows tree entries and explains that a tree references blobs and subtree objects. Inspect a real tree with:

```bash
git ls-tree HEAD
git ls-tree HEAD:frontend
```

The second command works when the commit's top-level tree contains a directory named `frontend`. In a different repository, substitute an actual directory. See [`git ls-tree`](https://git-scm.com/docs/git-ls-tree).

### 2. The index is the input to a tree that will be recorded

The **index**, often called the staging area, is the set of entries Git will use when constructing the next snapshot. `git add` updates that index from the working-tree content. `git write-tree` writes the index state as a tree object, returning the tree's ID. The [`git write-tree` manual](https://git-scm.com/docs/git-write-tree) describes the operation.

Conceptually:

```text
working tree ── git add ──► index (staging area)
                                │
                                └── git write-tree ──► tree object
```

For the course starter application, the lab uses `git add` and `git commit`; Git performs the required tree creation as part of making the commit. We inspect the created tree rather than manually editing the index or building internal object bytes.

Do not collapse these three states into one:

- **Working tree:** files currently checked out and editable.
- **Index:** the content prepared for the next commit.
- **Committed tree:** the snapshot referenced by a commit object.

An edit in the working tree does not automatically alter the index or the existing commit. Staging updates the index; a new commit records a new snapshot.

### Worked trace: edit after staging

This table is illustrative; `v1`, `v2`, `v3`, `C1` and `C2` are teaching labels, not real Git IDs. Assume one tracked README and no hooks, filters or other changes:

| Action | Working README | Index README | Committed README / branch | Short status |
|---|---|---|---|---|
| Clean baseline | v1 | v1 | C1 / v1 | No lines |
| Edit | v2 | v1 | C1 / v1 | ` M README.md` |
| Stage | v2 | v2 | C1 / v1 | `M  README.md` |
| Edit again | v3 | v2 | C1 / v1 | `MM README.md` |
| Commit staged content | v3 | v2 | C2 / v2, parent C1 | ` M README.md` |

The branch moves only in the last row. A normal `git commit` records the index, not the newest editor buffer. `git diff` and `git diff --cached` answer different questions. Counterfactual: committing with `-a` changes the staging behavior for tracked files; it is not the command modeled here. See [git add](https://git-scm.com/docs/git-add) and [status](https://git-scm.com/docs/git-status).

### 3. A commit object records a snapshot and ancestry

A **commit** object is not just a bag of changes. It references a top-level tree object and, for non-root commits, one or more parent commit IDs. It also includes author and committer metadata, timestamps, and a message. Inspect one using:

```bash
git cat-file -p HEAD
```

A representative shape is:

```text
tree <tree-object-id>
parent <parent-commit-id>
author <name> <email> <timestamp>
committer <name> <email> <timestamp>

<commit message>
```

The IDs and metadata will differ in your repository. A root commit has no `parent` line. A commit created by a normal single-parent progression has one parent line. Merge commits can have multiple parents; Week 3 will explore how this shapes a commit graph.

A commit identifies the tree snapshot and connects it to ancestry. Git can show a human-friendly diff by comparing the trees associated with two commits, but that diff is derived from the snapshots. The commit object is not simply storing an instruction such as “change line 8.” Use these commands to compare a pair of commits:

```bash
git rev-parse HEAD
git rev-parse HEAD^
git diff HEAD^ HEAD
```

`HEAD^` means the first parent in this context. Do not use that syntax to infer the rules for all merge-parent selection; that is part of the next module. The `gitrevisions` reference documents commit and tree-ish expressions: https://git-scm.com/docs/gitrevisions.

### 4. References give useful names to object IDs

Remembering a long object ID every time is inconvenient. Git uses **references** (refs) to provide names that resolve to object IDs. A local branch such as `main` is a reference to a commit. Its name is convenient, but unlike a commit object, the reference can move as new commits are made on the branch.

Use commands to inspect references instead of assuming how every repository stores them physically:

```bash
git show-ref --heads
git rev-parse refs/heads/main
git rev-parse HEAD
```

In the standard branch-attached state after a commit, `HEAD` and `refs/heads/main` resolve to the same commit ID. After you create a new commit on `main`, that branch reference advances to the new commit; the earlier commit object remains addressable through its ID and through the new commit's parent link.

The internal storage format for references can vary (for example, Git supports alternative reference storage formats), so do not teach students to edit `.git/refs/heads/main` as the normal way to change a branch. Use Git's supported commands. Pro Git's [Git References chapter](https://git-scm.com/book/en/v2/Git-Internals-Git-References) describes references as names for object IDs.

### 5. `HEAD` identifies the current checkout context

In an ordinary branch-attached checkout, `HEAD` is a symbolic reference to the current branch reference. Check it with:

```bash
git symbolic-ref HEAD
```

Expected in this lab after initializing `main` and making a commit:

```text
refs/heads/main
```

This means `HEAD` names the current branch reference; that reference resolves to a commit object. `HEAD` is not an alias for the working-tree directory, and it is not a copy of every file. The `git symbolic-ref` manual explains how symbolic references are read and managed: https://git-scm.com/docs/git-symbolic-ref.

There is a related state called **detached HEAD**, where `HEAD` names a commit directly rather than naming a branch ref. We mention it now because a correct mental model must allow it, but Week 3 will explain how checkout, branch pointers, and history movement create different states. Do not continue with branch-creation or recovery operations yet.

### 6. Put the relationships together

```text
branch ref: refs/heads/main ───────► commit C2
                                      │
                                      ├── tree ─────► tree T2 (project snapshot)
                                      │                 ├── README.md ──► blob B2
                                      │                 ├── backend/ ───► tree TB
                                      │                 └── frontend/ ──► tree TF
                                      │
                                      └── parent ───► commit C1
                                                        │
                                                        └── tree ─────► tree T1

HEAD (branch-attached) ──symbolic ref──► refs/heads/main
```

The IDs C1, C2, T1, T2, TB, TF, B2 are labels for this drawing, not literal Git IDs. The diagram represents two commits: C2 records the current tree T2 and points back to parent C1. The branch reference names C2. `HEAD` names the branch reference. The commit objects and trees supply the snapshot and history relationships.

These are different categories:

- **Blob/tree/commit:** objects addressed by object IDs.
- **Branch reference:** a movable name resolving to a commit.
- **HEAD:** the current checkout reference/context; commonly symbolic to the current branch.
- **Working tree/index:** local file/staging state, which can differ from the committed tree.

## Architecture and responsibility boundaries

| Element | Owns or describes | Does not by itself prove |
|---|---|---|
| Blob | File content bytes | Filename/path or which release used it |
| Tree | Names, modes, and references to blobs/subtrees | Commit message or ancestry |
| Commit | A tree snapshot, parent relationship(s), metadata, message | A generated diff as its primary stored representation, CI success, or deployment health |
| Branch ref | A named pointer to a commit | An immutable version; the pointer can advance |
| `HEAD` | Current checkout reference or commit context | That the working tree is clean or that a build uses this revision |
| Index | Proposed content for the next snapshot | That this content has already been committed |

## What the mechanism does—and does not—guarantee

The object model allows Git to share and connect data structures. A commit plus parent IDs creates the relationships used to walk history. A branch reference gives a convenient moving name. `HEAD` says which checkout context you are currently using.

This is not yet the whole collaboration model. A local branch is not the same object as a remote-tracking reference; pushes, fetches, protected branches, merge strategy, and safe recovery are later topics. Week 3 uses this model to explain branch pointers, graph shape, fast-forward movement, merges, rebase, divergent history, and recovery. Week 4 adds hosted collaboration and governance.

## Connect it to the SDLC

The source stage of the delivery pipeline must be specific enough to reproduce. Later, GitHub Actions checks out a revision, runs frontend and backend checks, and builds distinct artifacts. A useful release chain records:

```text
source commit ID
   → workflow run for that revision
   → test result and build artifacts
   → container image digest(s)
   → deployed workload revision
```

This chain is only valid if each link is actually recorded and checked. A branch name such as `main` can point at a different commit tomorrow. A commit ID provides a stable way to identify a commit object, but you still need evidence showing which object was built and which artifact was deployed.

## Common wrong assumptions

- **“A tree is just a list of filenames.”** Its entries also record modes, object types, and object IDs, and can reference nested trees.
- **“A commit is the diff.”** A commit references a tree snapshot and parent commit(s); a diff is produced by comparing snapshots.
- **“`main` and `HEAD` are the same thing.”** In ordinary branch-attached state, `HEAD` symbolically names the branch ref `refs/heads/main`, which resolves to the current commit. The ref name and the `HEAD` file/context have different roles.
- **“Editing a file changes the commit.”** The working tree can change while the commit and branch reference stay fixed. Staging and making a new commit are separate operations.
- **“Branch names are immutable IDs.”** A branch ref is a human-friendly name whose target normally advances.
- **“All references are always loose text files in `.git/refs`.”** Use supported commands to inspect refs; physical storage may vary.

## Check your understanding

1. Which object connects a path such as `src/App.jsx` to its content's blob ID? Explain why a blob alone cannot answer that.
2. Why can two commits have different commit IDs even if their top-level tree IDs happen to be the same? Think about metadata and parent relationships, not just file bytes.
3. After changing `README.md` in the working tree, what should remain unchanged until you create a commit? How would you verify it?
4. In branch-attached state, explain the relationship among `HEAD`, `refs/heads/main`, and the commit ID.
5. Why is recording only `main` as a release identifier weaker than recording the resolved commit ID and verified artifact digest?
6. What new questions about multiple branches and parent links remain for Week 3?

## Engineering decision record

- **Model:** blobs store content; trees assemble paths and modes; commits name snapshots and ancestry; refs provide movable names; `HEAD` identifies the current checkout context.
- **Operational inspection:** use `cat-file`, `ls-tree`, `rev-parse`, `show-ref`, and `symbolic-ref` before drawing conclusions.
- **Avoid:** editing Git's internal files by hand or treating working-tree state, index state and committed state as identical.
- **Next decision:** Week 3 investigates how movable branch pointers and parent links behave during concurrent development, merges, and history rewriting.

## Engineering curiosity: why a graph of objects instead of a folder full of dated snapshots?

A folder-copy design is easy to imagine: save a whole project folder for every release. Git instead represents content, directory structures, snapshots, ancestry, and names as linked objects and references. This model supports content reuse and makes the commit relationships inspectable. Its trade-off is conceptual complexity: engineers must distinguish objects, refs, the index, the working tree, and the remote collaboration state.

Do not claim that Git always stores less data than every alternative or that object IDs eliminate all integrity concerns. Repository shape, packing, compression, and usage matter. The course will measure relevant costs when a practical choice arises; this lesson's goal is to prove the relationships from object inspection.

## Production pain pattern

**Illustrative composite:** tests and builds independently resolve `main` while another commit lands. The release combines evidence from two snapshots.

The root cause is treating a movable name as a fixed input. Resolve a fully qualified ref once, check out and verify the resulting commit, then bind the actual build digest to it. This adds metadata and verification work, and a clean checkout still does not pin compilers, dependencies, environment or network responses. A signed but untrusted statement or a stale mirror can still defeat an unexamined assumption. The lesson is to verify each link rather than attach “passed” to a branch name.

## Extension details and limits

These optional presentation details extend the core model; Week 2 does not ask learners to operate a remote or publish a release:

- **Index/tree representation:** a normal full index is a sorted set of path entries and cached metadata; split index, sparse index and linked worktrees qualify a universal `.git/index` picture. Cached stat data is guarded against the racy-Git timestamp case. Tree output displays a type derived from mode; ordinary add/commit does not preserve empty directories, but plumbing can construct empty subtree entries. See [index format](https://git-scm.com/docs/gitformat-index), [racy Git](https://git-scm.com/docs/racy-git), [write-tree](https://git-scm.com/docs/git-write-tree) and [Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects).
- **Names and peeling:** use `git rev-parse --verify 'refs/heads/main^{commit}'` for a specifically named branch. Short names can match tags before branches. `^{}` peels tags to a non-tag object; `^{commit}` additionally requires a commit. An ID must also resolve in the relevant object database. See [revision syntax](https://git-scm.com/docs/gitrevisions) and [rev-parse](https://git-scm.com/docs/git-rev-parse).
- **Local name history:** a reflog records local ref updates and can expire; it is not the remote's audit log or a permanent backup. Tags and remote-tracking refs can disagree across clones. `git describe --dirty` is a useful label, not proof that every build input was tracked. See [reflog](https://git-scm.com/docs/git-reflog), [fetch](https://git-scm.com/docs/git-fetch) and [describe](https://git-scm.com/docs/git-describe).
- **Concurrency:** `update-ref <ref> <new> <old>` checks an expected old value. Fast-forward policy, an explicit force-with-lease expectation, protocol old-ID checks and server authorization are different layers. `--force` does not bypass all server checks. Atomic multi-ref pushes require server support. See [update-ref](https://git-scm.com/docs/git-update-ref), [push](https://git-scm.com/docs/git-push) and [pack protocol](https://git-scm.com/docs/gitprotocol-pack).
- **Signatures and history:** signatures cover unsigned payloads, excluding the embedded/appended signature. A commit embeds a signature header; an annotated tag appends its signature. Verification against a trusted key does not establish review of every ancestor or safe code. Parent links give ancestry, not trusted physical creation times. A revert can undo an ancestral fix and a cherry-pick can apply it under another ID; inspect the resulting tree and behavior, not ancestry alone. See [signature format](https://git-scm.com/docs/gitformat-signature), [commit-tree](https://git-scm.com/docs/git-commit-tree) and [merge-base](https://git-scm.com/docs/git-merge-base).
- **Build identity:** ignored untracked files can affect a build; ignore rules do not hide already tracked paths. `GITHUB_SHA` is event-specific: `pull_request` commonly identifies a synthetic merge commit. Record the event, intended input and actual checked-out HEAD. A source-revision annotation is a claim, not verified provenance. See [status](https://git-scm.com/docs/git-status), [workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [OCI annotations](https://github.com/opencontainers/image-spec/blob/main/annotations.md) and [SLSA provenance](https://slsa.dev/spec/v1.0/provenance).
- **Mutable tags:** the March 2025 changed-files incident involved action version tags redirected to malicious content, according to the [GitHub advisory](https://github.com/advisories/GHSA-mrrh-fwg8-r2c3). Full-ID pinning reduces this name-substitution risk but does not review the pinned code or its external dependencies. Later weeks cover the operational controls.

## Transfer and lab handoff

A data pipeline says it processed “today's dataset”, but that alias moved between validation and processing. Design a record distinguishing the alias, exact dataset snapshot, processing configuration and output. Which checks establish identity, and which establish that processing was correct?

In [GIT-LAB02](../labs/GIT-LAB02-trace-tree-commit-reference-head.md), save the initial commit, tree and App.jsx blob IDs, show that editing alone leaves the refs unchanged, then record the new commit and its parent. Preserve the repository and saved baseline for Week 3. Git object inspection alone does not demonstrate that the inherited app builds or runs.

## Sources and further reading

- Pro Git, **Git Internals — Git Objects**: https://git-scm.com/book/en/v2/Git-Internals-Git-Objects
- Pro Git, **Git Internals — Git References**: https://git-scm.com/book/en/v2/Git-Internals-Git-References
- Pro Git, **Branches in a Nutshell**: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
- Git manual, **`git ls-tree`**: https://git-scm.com/docs/git-ls-tree
- Git manual, **`git write-tree`**: https://git-scm.com/docs/git-write-tree
- Git manual, **`git symbolic-ref`**: https://git-scm.com/docs/git-symbolic-ref
- Git manual, **`git rev-parse`**: https://git-scm.com/docs/git-rev-parse
- Git manual, **`git show-ref`**: https://git-scm.com/docs/git-show-ref
- Git manual, **Revision specification**: https://git-scm.com/docs/gitrevisions

Sources rechecked 2026-11-11 at AI-author scope. Historical 2026-10-16 checks are retained in the private review, not transferred to new bytes. Independent human review, learner reasoning/timing and release approval remain open.

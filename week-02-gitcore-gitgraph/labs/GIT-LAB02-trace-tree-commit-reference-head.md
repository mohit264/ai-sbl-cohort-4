---
id: GIT-LAB02
title: "Trace a tree, commit, reference, and HEAD"
module: "GitCore and GitGraph"
week: 2
estimated_time: "75 minutes"
status: partially-verified
risk: medium
environment:
  - "Bash shell: Ubuntu on WSL2, macOS, Linux, or Git Bash"
  - "Course-provided Track II React + FastAPI starter application"
  - "Git CLI; actual authoring verification used Git 2.47.3 and Bash 5.2.37 on Linux"
cost: "Local only; no cloud account or external service required"
cleanup_required: true
prerequisites:
  - "GIT-L02 — How does Git assemble and name a version?"
  - "Week 1 Student Pack and its starter-app directory"
---

# GIT-LAB02 — Trace a tree, commit, reference, and HEAD

**Time budget:** 75 minutes, separate from teaching. Allow **15–25 extra minutes for first-time workspace/evidence setup**.

## Goal and continuity

Make a local source-control baseline for a **copy of the course React + FastAPI app**. Follow a commit to its tree and a file's blob, then connect `HEAD` and `main` to that commit. Finally change only the lab README, prove editing alone does not move a commit, and record a second commit with a parent link.

The application is inherited from Week 1; this lab does not run it or change its application code. Keep the resulting repository for Week 3, which can copy and preserve this history. Read [GIT-L02](../lessons/GIT-L02-how-git-assembles-and-names-a-version.md), [GIT-LAB01](GIT-LAB01-inspect-content-addressed-objects.md), and the [lab handbook](../../lab-handbook.md).

## Safety and working locations

- Use one Bash terminal named **HISTORY**. All commands after setup run at the **copied `starter-app` root**, not `backend/`, `frontend/`, the course root, or a real project.
- Use the pristine supplied starter, not the running Week 1 copy with generated dependencies or local overrides. A student ZIP need not have course `.git` metadata or any instructor folder.
- Create the lab copy at `~/week2-gitcore-app-lab/starter-app`. Preserve an existing attempt; never reinitialize or delete its history.
- Commits below are **local training commits in the disposable copy only**. No remote or GitHub account is added. Identity settings are repository-local and use a non-routable example address.
- Run one numbered action at a time. A printed STOP means do not continue until resolved. There is no `set -e` or shell-exit instruction.
- Save actual output in `GIT-LAB02-evidence.txt` **outside the app**, including full commit IDs and the absolute app path. Terminal text is the evidence here; no browser DevTools are needed.

## 1. Find the source and copy it outside the course checkout

1. In **HISTORY**, check Git:

   ```bash
   git --version
   ```

   Authoring checks used Git **2.47.3**, Bash **5.2.37**, Linux. Missing Git or unsupported `--initial-branch` is a STOP for approved environment setup.

   Before any repository-changing command, check for inherited settings that could redirect Git:

   ```bash
   if [ -n "${GIT_DIR+x}${GIT_WORK_TREE+x}${GIT_COMMON_DIR+x}${GIT_INDEX_FILE+x}${GIT_OBJECT_DIRECTORY+x}${GIT_ALTERNATE_OBJECT_DIRECTORIES+x}${GIT_CONFIG_COUNT+x}${GIT_CONFIG_PARAMETERS+x}" ]; then
     printf 'STOP: inherited Git context settings exist; get setup support before continuing.\n'
   else
     printf 'Git context is clear.\n'
   fi
   ```

   `${NAME+x}` checks presence without printing values. Continue only with `Git context is clear.` Otherwise Git could use another database, index or working tree despite the folder shown by `pwd`. Preserve organizational settings and ask for setup support rather than changing global configuration.

2. Locate the supplied `starter-app` with your file manager. Replace the quoted example with its absolute path:

   ```bash
   cd "/absolute/path/to/course-root/students/starter-app"
   pwd
   ls -a
   ```

   The course root is the outer repository or extracted student-pack folder; open its `students/starter-app`. Expect `.gitignore`, `README.md`, `backend`, and `frontend`. If missing, STOP.

3. Save the source path and check for embedded Git data:

   ```bash
   SOURCE_APP="$PWD"
   if [ -e .git ]; then
     echo "STOP: this source already has Git history; preserve it and select the pristine supplied starter"
   else
     echo "Source has no embedded Git metadata"
   fi
   ```

   `$PWD` is the current absolute directory; assignment saves it for copying. Being inside the **course's** parent Git checkout is acceptable because you will copy elsewhere. An embedded `.git` in the starter itself is not the fresh setup for this lab.

4. Check the destination:

   ```bash
   if [ -e "$HOME/week2-gitcore-app-lab" ]; then
     echo "STOP: destination exists; preserve it and use the resume section"
   else
     echo "Destination is available"
   fi
   ```

   Continue only with the available message.

5. Create the parent and copy the app:

   ```bash
   mkdir "$HOME/week2-gitcore-app-lab"
   cp -R "$SOURCE_APP" "$HOME/week2-gitcore-app-lab/starter-app"
   ```

   `mkdir` creates a folder; `cp -R` copies a folder and its contents. Both are normally silent. STOP if either reports an error; do not use a partial copy.

6. Enter the copy and ensure no surrounding repository will be mistaken for it:

   ```bash
   cd "$HOME/week2-gitcore-app-lab/starter-app"
   pwd
   if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
     echo "STOP: this destination is already inside a Git working tree"
   else
     echo "Fresh destination: ready to initialize"
   fi
   ```

   `>/dev/null 2>&1` hides ordinary output and errors for this deliberate yes/no probe; the `if` handles failure without closing the terminal. Only proceed with the Fresh message and the expected `pwd`. If your home is itself version-controlled, STOP and select an approved workspace outside it rather than nesting blindly.

## 2. Create and verify the repository boundary

1. In **HISTORY**, at the copied app root:

   ```bash
   git init --initial-branch=main
   git config --local user.name "Track II Student"
   git config --local user.email "student@example.invalid"
   ```

   `init` creates `.git`; `--initial-branch=main` names the first branch. `config --local` changes only this repository's identity, not global settings. Initialization prints a message; successful config writes usually print nothing.

2. Verify:

   ```bash
   git rev-parse --show-toplevel
   git symbolic-ref HEAD
   git rev-parse --show-object-format
   ```

   Expect your copied app path, `refs/heads/main`, and the object format (often `sha1`). `HEAD` currently names an **unborn** branch: the intended branch name exists but it has no commit yet. Do not use `git rev-parse HEAD` as a success check until the first commit exists.

## 3. Inspect, then stage only intended source

1. In **HISTORY**, keep macOS Finder metadata out of this lab's source history, then inspect files and ignore rules:

   ```bash
   printf '\n.DS_Store\n' >> .git/info/exclude
   ```

   This appends a local-only ignore rule. `.git/info/exclude` is Git's supported per-repository exclusion list, not an object or branch-ref file; this does not change application source or global settings. `.DS_Store` is Finder metadata, not course source. The command is normally silent.

   ```bash
   git status --short --untracked-files=all
   git status --short --ignored
   cat .gitignore
   ```

   `--short` gives compact status; `--untracked-files=all` expands untracked folders; `--ignored` also shows ignored paths as `!!`. `??` means untracked. `.gitignore` excludes common generated files but is **not** a secret scanner. It ignores `.env.local` variants, not every possible `.env` or credential file.

2. STOP if you see personal data, credentials, plain `.env`, unexpected generated files or unknown source. Do not stage those files just to follow the recipe. An ignored item is still worth understanding even though it will not be added normally. A cumulative pack can also contain the supplied root `.dockerignore`, `compose.yaml`, `k8s/` configuration and `.github/workflows/ci.yml`; inspect them if present without starting containers, applying manifests or running workflows:

   ```bash
   if [ -f .dockerignore ]; then cat .dockerignore; fi
   if [ -f compose.yaml ]; then cat compose.yaml; fi
   if [ -d k8s ]; then cat k8s/*.yaml; fi
   if [ -f .github/workflows/ci.yml ]; then cat .github/workflows/ci.yml; fi
   ```

   These are later container/Compose/Kubernetes/CI configuration files, not commands to run here. Confirm they are the supplied course files and contain no private overrides before including them. The workflow is stored as source only; this local lab does not execute GitHub Actions. A missing optional file produces no output and is valid for an earlier pack.
3. Stage only the known app paths:

   ```bash
   git add -- .gitignore README.md backend frontend
   if [ -f .dockerignore ]; then git add -- .dockerignore; fi
   if [ -f compose.yaml ]; then git add -- compose.yaml; fi
   if [ -d k8s ]; then git add -- k8s; fi
   if [ -f .github/workflows/ci.yml ]; then git add -- .github/workflows/ci.yml; fi
   ```

   `add` updates Git's index (the proposed next snapshot). `--` separates options from paths. It normally succeeds silently; it does not create a commit.

4. Inspect the staged result **before** committing:

   ```bash
   git status --short
   git diff --cached --stat
   git diff --cached --check
   ```

   Expect `A` entries for newly staged files. `--cached` means compare the staged state, `--stat` summarizes files/line counts, and `--check` reports whitespace errors. No output from `--check` is success; it is not a secret scan or test suite. If the list is unexpected, STOP and preserve the evidence. Before a first commit, ordinary `git restore --staged` may fail because no `HEAD` exists—do not experiment with broad resets.

## 4. Create the baseline commit

1. In **HISTORY**, after reviewing staged files:

   ```bash
   git commit -m "Establish full-stack starter baseline"
   ```

   `-m` supplies a message instead of opening an editor. Expect a root-commit summary like `[main (root-commit) ...] Establish full-stack starter baseline`. IDs/counts depend on your source and metadata. If Git asks for identity, check the local configuration from step 2. If signing/hooks fail, save that error and STOP; do not disable organization policy or modify global settings.

2. Verify the new record:

   ```bash
   git status --short
   git rev-parse HEAD
   git cat-file -t HEAD
   git cat-file -p HEAD
   ```

   Expect no status lines, a full ID, type `commit`, and a body similar to:

   ```text
   tree <your tree ID>
   author Track II Student <student@example.invalid> ...
   committer Track II Student <student@example.invalid> ...

   Establish full-stack starter baseline
   ```

   This first/root commit has **no `parent` line**. The example is illustrative, not something to paste. Save the full baseline commit ID in your notes now.

## 5. Follow commit → tree → path → blob

1. In **HISTORY**, resolve the root tree:

   ```bash
   tree_id=$(git rev-parse 'HEAD^{tree}')
   printf 'Root tree ID: %s\n' "$tree_id"
   git cat-file -t "$tree_id"
   ```

   `$(...)` captures output in the variable `tree_id`; `%s` prints it. `HEAD^{tree}` asks for the tree belonging to the current commit; quotes preserve that notation. Expect a full ID and type `tree`.

2. Read its entries:

   ```bash
   git cat-file -p "$tree_id"
   git ls-tree HEAD
   ```

   Both expose the root tree. A representative entry looks like `100644 blob <ID> README.md`; directories normally appear as `040000 tree <ID> backend`. These fields are mode, object type, ID and path. The filenames live in the tree, not inside each blob.

3. Follow the frontend directory to one file:

   ```bash
   git ls-tree HEAD:frontend
   app_blob=$(git rev-parse HEAD:frontend/src/App.jsx)
   printf 'App.jsx blob: %s\n' "$app_blob"
   git cat-file -t "$app_blob"
   ```

   The `commit:path` notation resolves a path **inside the committed snapshot**, not an arbitrary disk file. Expect a frontend listing and type `blob`. If the path does not resolve, inspect `git ls-tree HEAD` and STOP; do not invent a different app path or claim the intended source was committed.

**Checkpoint:** save the baseline commit, tree ID and `App.jsx` blob ID. Explain the link between each pair.

## 6. Connect HEAD and main

1. In **HISTORY**, same app root:

   ```bash
   git symbolic-ref HEAD
   git rev-parse HEAD
   git rev-parse refs/heads/main
   git show-ref --heads
   ```

   `symbolic-ref` prints the ref named by HEAD; `rev-parse` resolves names to IDs; `show-ref --heads` lists local branch refs. Expect `refs/heads/main`, two equal commit IDs, and a `main` ref row.
2. Save the output and sketch `HEAD → refs/heads/main → commit → tree`. Do not edit `.git/HEAD` or `.git/refs` manually. If HEAD is detached or IDs disagree, STOP and inspect `git status` rather than force-moving a ref.

## 7. Test the mistaken idea that editing moves the commit

1. In **HISTORY**, save the current ID:

   ```bash
   before=$(git rev-parse HEAD)
   printf 'Commit before editing: %s\n' "$before"
   ```

   Record this value outside the shell so it survives closing the terminal.

2. Append one line **once** to the copied app's README:

   ```bash
   printf '\nWeek 2 object-model experiment completed.\n' >> README.md
   ```

   `>>` appends instead of replacing. `\n` starts/ends a line. This is a harmless lab document change, not application code. Success is silent.

3. Inspect what changed:

   ```bash
   git status --short
   git diff -- README.md
   ```

   Expect ` M README.md` (modified but not staged) and a diff with the new line prefixed `+`. Write a prediction: did the commit ID or `main` ref move?

4. Test both separately:

   ```bash
   if [ "$(git rev-parse HEAD)" = "$before" ]; then
     echo "PASS: HEAD commit is unchanged"
   else
     echo "STOP: HEAD changed; inspect the history before continuing"
   fi
   if [ "$(git rev-parse refs/heads/main)" = "$before" ]; then
     echo "PASS: main ref is unchanged"
   else
     echo "STOP: main changed; inspect the history before continuing"
   fi
   ```

   `[ ... = ... ]` compares values. Expect both PASS messages. Save them beside the diff; do not proceed on a STOP.

## 8. Record the second snapshot and inspect its parent

1. In **HISTORY**, stage only the README:

   ```bash
   git add -- README.md
   git diff --cached -- README.md
   git diff --cached --check
   ```

   Confirm the staged diff is only the intended appended line/blank line. Whitespace checking should be silent.

2. Commit:

   ```bash
   git commit -m "Record Week 2 object-model experiment"
   ```

   Expect a new commit summary. “Nothing to commit” is a reason to inspect your state, not add unrelated changes.

3. Resolve and compare the relationships:

   ```bash
   after=$(git rev-parse HEAD)
   parent=$(git rev-parse 'HEAD^')
   printf 'Before: %s\nAfter:  %s\nParent: %s\n' "$before" "$after" "$parent"
   if [ "$after" != "$before" ] && [ "$parent" = "$before" ]; then
     echo "PASS: the new commit differs and points to the baseline parent"
   else
     echo "STOP: unexpected commit relationship"
   fi
   ```

   `HEAD^` means the first parent; `!=` means not equal; `&&` requires both conditions. Expect PASS. Do not use a reset to force this result.

4. Inspect independently:

   ```bash
   git cat-file -p HEAD
   git diff 'HEAD^' HEAD -- README.md
   git status --short
   ```

   Expect a `parent` line, the recorded README change between commits, and **no status lines**. Save all three.

## Resume after closing the terminal

Repeat only the Git-context check from section 1 before the commands below. It is not an instruction to copy or initialize the repository again.

1. Return to the existing copy, not the source:

   ```bash
   cd "$HOME/week2-gitcore-app-lab/starter-app"
   pwd
   git status
   git log -2 --oneline
   git diff -- README.md
   git diff --cached -- README.md
   ```

   `log -2` shows up to two commits. If no commit exists yet, its error is expected: use status and resume the reviewed initial staging step. Do not rerun initialization or append the README line again.
2. Once a baseline commit exists, set `before` from the **full baseline ID in your evidence**, using this pattern after replacing the text:

   ```bash
   before="PASTE_YOUR_RECORDED_BASELINE_COMMIT_ID"
   git show -s --format='%H %s' "$before"
   ```

   `show -s` suppresses the patch; `%H` is full ID, `%s` the subject. Confirm the baseline message. If you lost the ID, use `git log --format='%H %s'` to locate it by message, then copy its full ID. Do not set `before` to the current HEAD after the second commit.
3. Restore `tree_id` with `tree_id=$(git rev-parse "$before^{tree}")`. Restore `app_blob` with `app_blob=$(git rev-parse "$before:frontend/src/App.jsx")`. Restore `after` and `parent` using step 8 **only if** the second commit exists. Use status/diffs to identify whether the README is edited, staged or already committed; continue at the next unfinished action.

## Completion, handoff and cleanup

- [ ] A fresh copy, not the supplied source or a workplace repository, was initialized.
- [ ] Source/ignore/staging inspection preceded the first commit.
- [ ] Baseline commit → tree → frontend blob evidence saved.
- [ ] HEAD and main resolved to the same commit before editing.
- [ ] README editing did not move either ref; the second commit did.
- [ ] Second commit's parent equals the saved baseline ID.
- [ ] Final status is clean; skipped checks are documented.

Keep `~/week2-gitcore-app-lab/starter-app` and its local history for [Week 3 LAB01](../../week-03-gitgraph/labs/GRA-LAB01-explore-divergent-history-merge-rebase.md). Record its absolute path in your handoff notes. No service/cloud process was started, so there is nothing to stop. Do not delete `.git` or run `reset --hard` as cleanup. A restart requires a separately named fresh copy, with the old evidence preserved.

## Troubleshooting

| Symptom | Read first | Safe response |
|---|---|---|
| Already inside a repository before initialization | `pwd`, `git rev-parse --show-toplevel` | Preserve it; use a fresh destination outside the existing work tree |
| Unexpected staged file | `git status --short`, `git diff --cached --stat` | STOP before committing; get the staging boundary reviewed |
| Identity/signing/hook error | Exact commit error, local identity | Correct local setup only; do not disable unrelated policy globally |
| Nothing to commit | `git diff`, `git diff --cached`, `git log -2 --oneline` | Determine whether the intended line is unstaged, staged or already recorded |
| No parent on the supposed second commit | `git cat-file -p HEAD`, `git log -2 --oneline` | Confirm which commit/repository you are inspecting |

## Validation record

**2026-11-11 author replay:** reviewed Bash blocks passed on macOS arm64/Git 2.54.0/Bash 3.2.57 using an isolated tracked-source snapshot. SHA-1 and SHA-256 cases, plus an earlier-pack case without the optional workflow, each produced two clean local commits with the correct parent/tree/blob/ref relationships. A fresh-shell resume reconstructed the recorded baseline; only the copied README changed, and source files stayed unchanged. Test-only strict-shell assertions and Copilot commit trailers were added; path and saved-ID placeholders were substituted. These are local Git observations, not application execution, a final ZIP audit, learner timing or release approval.

On 2026-11-08, an author command replay completed the local copy, staging, two commits, object/ref/parent checks, saved-ID reconstruction and retained-history handoff on macOS arm64 with Git 2.54.0 (Apple Git-157)/Bash 3.2.57. The current starter's source-only snapshot was copied into a session-owned home; generated dependencies were excluded and Git configuration was isolated. The original staging list left the cumulative pack's `.github/workflows/ci.yml` untracked, contradicting the clean-status checkpoint. After adding explicit inspection and conditional staging of that supplied file, the run completed cleanly. The workflow-absent earlier-pack case also passed. No application, workflow, learner or cross-OS validation is implied.

**Status: partially-verified.** Earlier object/ref/parent invariants and a packaged command walkthrough were checked under Git 2.47.3/Bash 5.2.37 on Linux. The subsequent external-copy/resume rewrite initially carried no new full execution claim; the dated checks here state the evidence added since then. Novice-observed, final-pack and cross-OS walkthroughs remain outstanding. These Git checks do not establish that the pinned application builds or runs.

Focused checks on 2026-10-19 used Git 2.50.1/Bash 3.2.57 on macOS arm64 with an isolated home and no global/system Git configuration. They verified copying the supplied app outside the course repository, local initialization, the two commits, tree/blob/parent relationships and reconstruction from a saved baseline ID. The first attempt exposed untracked cumulative-pack root files and Finder metadata; after the explicit optional-file staging/local-exclusion correction above, the focused checks passed. No application dependencies or services were run.

## Sources

- [Pro Git — Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) and [Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
- [Git ls-tree](https://git-scm.com/docs/git-ls-tree)
- [Git symbolic-ref](https://git-scm.com/docs/git-symbolic-ref)
- [Git rev-parse](https://git-scm.com/docs/git-rev-parse)
- [Git revision syntax](https://git-scm.com/docs/gitrevisions)

Sources originally checked 2026-10-16.

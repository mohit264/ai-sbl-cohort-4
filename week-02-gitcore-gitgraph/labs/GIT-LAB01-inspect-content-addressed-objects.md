---
id: GIT-LAB01
title: "Inspect content-addressed Git objects"
module: "GitCore and GitGraph"
week: 2
estimated_time: "75 minutes"
status: partially-verified
risk: low
environment:
  - "Bash shell: Ubuntu on WSL2, macOS, Linux, or Git Bash"
  - "Git CLI; actual authoring verification used Git 2.47.3 and Bash 5.2.37 on Linux"
cost: "Local only; no cloud account or external service required"
cleanup_required: true
prerequisites:
  - "GIT-L01 — What does a Git object ID identify?"
---

# GIT-LAB01 — Inspect content-addressed Git objects

**Time budget:** 75 minutes. Allow **15–25 extra minutes for first-time terminal and evidence setup**; this does not change the teaching allocation.

## What you will prove

Git can calculate a content ID without storing the content. Two different filenames can have the same blob ID when their bytes match. A changed payload can produce a different ID. A stored blob is **not** automatically a staged file or a commit.

Use the [lab handbook](../../lab-handbook.md) for terminal basics and [GIT-L01](../lessons/GIT-L01-what-does-a-git-object-id-identify.md) for the object model. A **blob** is Git's stored file content; the filename is not part of that blob.

## Safety, terminal and evidence

- Use **one Bash terminal**, named **OBJECTS**, throughout. On Windows use WSL2 Ubuntu or Git Bash, not PowerShell. On macOS you can enter `bash` to start Bash.
- This lab uses only synthetic text in `~/week2-gitcore-objects-lab`. `~` and `$HOME` refer to your home directory. No source repository, GitHub account, remote or cloud service is needed.
- Do not use a real project or put credentials/personal information here. Do not edit files under `.git` by hand.
- Run one numbered action at a time. STOP messages require you to stop manually; they deliberately do not close the terminal.
- Open a text document outside the lab folder, such as `GIT-LAB01-evidence.txt`. Copy commands and real output into it at the checkpoints. A full object ID is a long string of letters/numbers; do not replace it with a sample.

## 1. Create a fresh, disposable repository

1. In **OBJECTS**, inspect the tools:

   ```bash
   git --version
   bash --version
   ```

   Save the versions. Recorded authoring checks used Git **2.47.3**, Bash **5.2.37**, Linux. If Git is missing, STOP for approved setup; do not install globally from this lab.

   Before any repository-changing command, check for inherited settings that could redirect Git outside this folder:

   ```bash
   if [ -n "${GIT_DIR+x}${GIT_WORK_TREE+x}${GIT_COMMON_DIR+x}${GIT_INDEX_FILE+x}${GIT_OBJECT_DIRECTORY+x}${GIT_ALTERNATE_OBJECT_DIRECTORIES+x}${GIT_CONFIG_COUNT+x}${GIT_CONFIG_PARAMETERS+x}" ]; then
     printf 'STOP: inherited Git context settings exist; get setup support before continuing.\n'
   else
     printf 'Git context is clear.\n'
   fi
   ```

   `${NAME+x}` checks whether a setting exists without printing its value. Continue only with `Git context is clear.` These settings can choose another object database, index or working tree even after `cd`. Do not unset organizational settings or edit global Git configuration to bypass a STOP.

2. Check that the destination does not exist:

   ```bash
   if [ -e "$HOME/week2-gitcore-objects-lab" ]; then
     printf 'STOP: preserve the existing lab folder; do not overwrite it.\n'
   else
     printf 'Lab destination is available.\n'
   fi
   ```

   `[ -e ... ]` tests whether a path exists. Double quotes preserve spaces in a path. Continue only with the available message. If the folder exists, use the resume instructions below or agree a different name and replace it consistently everywhere; do not delete prior evidence.

3. Create the directory and enter it:

   ```bash
   mkdir "$HOME/week2-gitcore-objects-lab" && cd "$HOME/week2-gitcore-objects-lab"
   pwd
   ```

   `mkdir` creates one folder; `&&` changes into it only if creation succeeds. Success is silent until `pwd` prints the absolute path. STOP on an error or an unexpected path.

4. Make Git's repository boundary **in this folder only**:

   ```bash
   git init --initial-branch=main
   ```

   `init` creates a local `.git` database; `--initial-branch=main` names the first branch. Expect `Initialized empty Git repository in .../.git/`. If the option is unsupported, STOP and record the Git version rather than silently changing commands.

5. Verify where you are and the object format:

   ```bash
   git rev-parse --show-toplevel
   git rev-parse --is-inside-work-tree
   git rev-parse --show-object-format
   git status --short
   ```

   `rev-parse` resolves repository facts. Expect your exact lab path, `true`, a format such as `sha1`, then **no status lines**. No status lines means no changes, not a hung command. Save these outputs. If the top-level path is another project, STOP.

## 2. Calculate an ID without storing the object

1. In **OBJECTS**, at `week2-gitcore-objects-lab`, create one text file:

   ```bash
   printf 'same payload\n' > file-a.txt
   cat file-a.txt
   ```

   `printf` writes exact text; `\n` adds a newline; `>` redirects it to a file (replacing that file if present). `cat` displays it. Expect `same payload`. Do not repeat this creation action in an uncertain resumed state.

2. Calculate its ID and display it:

   ```bash
   oid_unstored=$(git hash-object file-a.txt)
   printf 'Calculated ID: %s\n' "$oid_unstored"
   ```

   `$(...)` captures a command's output. `oid_unstored=` saves it in a shell variable, which exists only in this terminal. `$oid_unstored` reads it; `%s` prints that value as text. `hash-object` without `-w` calculates an ID but does not request object storage. Assignment is normally silent; the second command prints the ID. Save the full value.

3. Check whether Git can retrieve it:

   ```bash
   if git cat-file -e "$oid_unstored"; then
     printf 'STOP: the object already exists; this is not the intended fresh state.\n'
   else
     printf 'Expected in this fresh repository: the object is not retrievable yet.\n'
   fi
   ```

   `cat-file -e` tests object existence. A missing object returns nonzero and may print an error; the `if` deliberately handles this expected failure and keeps your terminal open. Expect the second message. If it prints STOP, inspect the repository path and your earlier commands; this missing-object experiment cannot be recreated by recalculating an already stored ID.

**Checkpoint:** save the calculated ID, lookup output and explanation of what has—and has not—been stored.

## 3. Store and inspect the blob

1. In **OBJECTS**, same directory:

   ```bash
   oid_a=$(git hash-object -w file-a.txt)
   printf 'Stored object ID: %s\n' "$oid_a"
   ```

   `-w` means **write the object** into this repository's database. The ID should match the value from step 2 because the bytes did not change. If it differs, inspect `cat file-a.txt` and your recorded format before continuing.

2. Ask three different questions:

   ```bash
   git cat-file -t "$oid_a"
   git cat-file -s "$oid_a"
   git cat-file -p "$oid_a"
   ```

   `-t` prints type, `-s` prints size in bytes, and `-p` prints readable contents. Expect:

   ```text
   blob
   13
   same payload
   ```

   The newline is one of those 13 bytes. Save all three outputs.

3. Verify existence again and inspect working files:

   ```bash
   git cat-file -e "$oid_a"
   git status --short
   ```

   This existence check should now succeed **silently**. Status should include `?? file-a.txt`; `??` means untracked. Writing a blob did not add a path to the index (staging area) or make a commit. If lookup fails, STOP and compare the saved ID and repository path.

## 4. Compare two filenames with identical bytes

1. In **OBJECTS**, same directory, copy the file:

   ```bash
   cp file-a.txt file-b.txt
   cmp file-a.txt file-b.txt
   ```

   `cp` copies bytes to a second path. `cmp` compares the files: **no output** means equal bytes; a difference/error means STOP before interpreting the hashes.

2. Store the second payload and compare:

   ```bash
   oid_b=$(git hash-object -w file-b.txt)
   printf 'A: %s\nB: %s\n' "$oid_a" "$oid_b"
   if [ "$oid_a" = "$oid_b" ]; then
     printf 'PASS: identical bytes produced the same blob ID here.\n'
   else
     printf 'STOP: IDs differ; inspect bytes, object format and configured filters.\n'
   fi
   ```

   `[ ... = ... ]` compares text values. Expect matching IDs and PASS. Save the output and explain why a blob ID alone does not tell you either filename.

## 5. Change the content, not the filename

1. In **OBJECTS**, replace only the lab's `file-b.txt`:

   ```bash
   printf 'same payload!\n' > file-b.txt
   cat file-b.txt
   ```

   Expect `same payload!`. The added exclamation mark is a content change.

2. Calculate the changed ID:

   ```bash
   oid_c=$(git hash-object file-b.txt)
   printf 'Original: %s\nChanged:  %s\n' "$oid_a" "$oid_c"
   if [ "$oid_a" != "$oid_c" ]; then
     printf 'PASS: the changed payload has a different ID in this experiment.\n'
   else
     printf 'STOP: unexpected match; inspect the file and command before interpreting it.\n'
   fi
   ```

   `!=` means “not equal.” This command calculates but does not write the new blob. A different result here is not a mathematical proof that every possible hash collision is impossible.

3. Store the changed object so you can read it:

   ```bash
   oid_c_stored=$(git hash-object -w file-b.txt)
   git cat-file -p "$oid_c_stored"
   ```

   Expect `same payload!`. Save both original/changed IDs and the retrieved payload.

## 6. Diagnose the “an ID means it was stored” assumption

The original `oid_unstored` **now resolves**, because step 3 stored the same content. Do not reuse it as supposedly missing evidence. Use a different synthetic payload to test the mistaken assumption again.

1. In **OBJECTS**, create the new test payload and calculate its ID:

   ```bash
   printf 'diagnosis payload not previously stored\n' > diagnosis.txt
   diagnosis_id=$(git hash-object diagnosis.txt)
   printf 'Diagnostic ID: %s\n' "$diagnosis_id"
   ```

2. Before testing, write a prediction in your notes: should merely printing this ID make its contents retrievable?
3. Test it:

   ```bash
   if git cat-file -e "$diagnosis_id"; then
     printf 'STOP: this payload was already stored; preserve that result and inspect your attempt history.\n'
   else
     printf 'Missing-object result captured; proceed to the explicit write below.\n'
   fi
   ```

   The missing-object failure is intentional. Do not close the terminal or run automatic cleanup. If this is a repeated attempt after the write, it should be found; do not call that a fresh failure.

4. Write and verify:

   ```bash
   diagnosis_id=$(git hash-object -w diagnosis.txt)
   git cat-file -e "$diagnosis_id"
   git cat-file -p "$diagnosis_id"
   ```

   Expect a silent successful existence check, then `diagnosis payload not previously stored`. Record the before/after evidence and a prevention rule for commands that require a persisted object.

## 7. Finish the evidence record

For each row, supply your commands, actual output and one limitation:

| Claim to investigate | Evidence to save |
|---|---|
| Calculating and storing differ | Step 2 missing lookup and step 3 successful lookup for the same ID |
| Filenames do not determine blob identity | `cmp` result and the A/B IDs |
| Content changes affect this ID | Original/changed IDs and retrieved content |
| Object storage does not stage a file | `git status --short` showing `??` |
| A failed lookup needs context | Diagnostic command, repository path and whether `-w` had been used |

Your notes should distinguish these operations:

```text
file bytes → hash-object → ID
                 with -w → stored object → cat-file
```

No commit, review, test, build or deployment has been established by this lab.

## Resume without losing your place

Repeat only the Git-context check from section 1 in the reopened terminal before the commands below. Do not repeat directory creation or `git init`.

1. Open **OBJECTS** again, then run:

   ```bash
   cd "$HOME/week2-gitcore-objects-lab"
   pwd
   git rev-parse --show-toplevel
   git status --short
   cat file-a.txt
   cat file-b.txt
   ```

   A missing `file-b.txt` is expected if you had not reached step 4. If the path/content differs from your notes, STOP rather than recreate files over unknown work.

2. Restore only the variables needed for your next step:

   ```bash
   oid_unstored=$(git hash-object file-a.txt)
   oid_a=$(git hash-object file-a.txt)
   ```

   If `file-b.txt` still contains `same payload`, recalculate `oid_b` with `oid_b=$(git hash-object file-b.txt)`. If it contains `same payload!`, recover the **original** `oid_b` from your saved A/B output (it equals `oid_a`) and calculate the changed ID with `oid_c=$(git hash-object file-b.txt)`. After step 5's write, `oid_c_stored="$oid_c"` restores its saved name. For step 6, use `diagnosis_id=$(git hash-object diagnosis.txt)` only if that file exists with the specified content.

3. These commands restore variables **without `-w`**. They cannot undo previous object storage. Consult your saved checkpoint and resume at the next incomplete action; do not claim a fresh missing-object test after that object was stored. A fresh experiment requires a new, explicitly named disposable directory, not deleting Git internals.

## Troubleshooting and cleanup

| Observation | Discriminating check | Safe next action |
|---|---|---|
| `not a git repository` | `pwd` and your recorded lab path | Return to the existing lab directory; do not initialize another directory blindly |
| Empty/invalid object name after reopening terminal | Print the variable and compare with notes | Reconstruct it as above; do not paste someone else's ID |
| Missing object after `-w` | Current top-level path and exact returned ID | Confirm you are querying the same repository; save errors and STOP if still inconsistent |
| Different IDs for allegedly equal files | `cmp file-a.txt file-b.txt` | At step 5 they are intentionally different; otherwise inspect bytes and filters before continuing |

Leave the repository in place until evidence is reviewed. Cleanup here means finish your notes and leave the directory with `cd "$HOME"`; no process, remote or cloud resource is running. Do not use a recursive delete or manually remove `.git/objects` to reset the experiment.

## Completion checklist

- [ ] Actual Git/Bash versions, object format and absolute lab path recorded.
- [ ] Missing and stored-object checks captured at the correct times.
- [ ] Type, byte size and content inspected.
- [ ] Same-byte and changed-byte comparisons recorded.
- [ ] Working-tree status distinguished from object storage.
- [ ] Evidence limitations and any skipped steps stated.

**Next:** [GIT-LAB02](GIT-LAB02-trace-tree-commit-reference-head.md) traces filenames, snapshots, commits and refs using the course app.

## Validation record

**2026-11-11 author replay:** the reviewed Bash blocks and variable reconstruction passed on macOS arm64/Git 2.54.0/Bash 3.2.57 in isolated homes with both SHA-1 and SHA-256 repositories. Missing-object failures preceded explicit writes; type/size/content and unstaged status were asserted, and reopening a fresh shell did not undo earlier storage. The context guard was checked with absent and present-but-empty redirect settings. Test fixtures were removed only after verifying the lab's retain-history handoff. This is not learner observation, a final ZIP audit or cross-platform approval.

On 2026-11-08, an author command replay completed steps 1–7, variable reconstruction and the non-destructive cleanup handoff on macOS arm64 with Git 2.54.0 (Apple Git-157) and Bash 3.2.57. A session-owned directory replaced `$HOME`; global/system Git configuration was excluded. Both intended missing-object checks failed before explicit writes, identical 13-byte payloads shared an ID, the changed payload differed, and files remained untracked. No command correction was needed. This is a scripted local replay, not observed learner or cross-OS approval.

**Status: partially-verified.** Prior core command invariants were smoke-tested with Git 2.47.3/Bash 5.2.37 on Linux x86_64, and an earlier packaged command walkthrough was recorded. On 2026-10-19, focused disposable-repository checks with Git 2.50.1/Bash 3.2.57 on macOS arm64 verified the distinct diagnostic payload's missing/stored states and variable reconstruction without another write. These are bounded command checks, not a complete novice walkthrough. Windows/Git Bash/WSL2 and macOS learner validation remain unproven.

## Sources

- [Git hash-object](https://git-scm.com/docs/git-hash-object)
- [Git cat-file](https://git-scm.com/docs/git-cat-file)
- [Pro Git — Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)
- [Git init](https://git-scm.com/docs/git-init)

Sources originally checked 2026-10-16.

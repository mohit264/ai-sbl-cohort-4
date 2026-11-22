---
id: GIT-L01
title: "What does a Git object ID identify?"
module: "GitCore and GitGraph"
week: 2
estimated_time: "75 minutes"
status: draft
prerequisites:
  - "GRO-L01 — The Human Infrastructure Layer"
  - "GRO-L03 — Evidence-First Operations"
version_scope:
  - "Git command-line; commands are intended for modern Git installations and are verified in the recorded authoring environment only"
---

# What does a Git object ID identify?

**Before the explanation:** two differently named files contain the same bytes. Predict whether their blob IDs match, whether calculating an ID stores an object, and what must still record the filenames. Write a reason, not just yes/no.

**Starting point:** Week 1's evidence habit and basic file/terminal actions from the [lab handbook](../../lab-handbook.md). No database or cryptography background is assumed. A byte is one unit of file data; a digest is the fixed-length output of a hash function.

## The situation

You have two files in a source repository:

```text
frontend/src/App.jsx
backup/App.jsx
```

They happen to contain exactly the same bytes. Are these necessarily two different pieces of stored content? Now suppose one file changes by a single character. How does Git distinguish the old content from the new content without relying on a filename such as `App.jsx`, a date, or a human-written version label?

We will derive Git's object model from that problem. The goal is not to memorize `git hash-object`; the goal is to understand what the output means and what it does **not** prove.

## What must we explain or decide?

The central question is:

> How can Git identify stored content independently of the path where a file appears, and how can we inspect that content by its identifier?

By the end, you should be able to explain content-addressed storage, identify a blob, distinguish calculating an ID from writing an object, and make evidence-based statements about what a hash does and does not guarantee.

## Start with what we can observe

Before introducing Git's terminology, consider these experiments:

1. Read `frontend/src/App.jsx` and `backup/App.jsx` and compare the bytes.
2. Calculate an identifier for each file.
3. Change one byte in one file and calculate again.
4. Ask the tool to display the object's type and content using the identifier—not the path.

If two identical inputs return the same identifier in the same repository object format, the practical question becomes: what did Git identify—the path, or the stored content? If a changed input returns a different identifier, what part of the system must remember which filename refers to which object?

We will test these claims in GIT-LAB01. Do not assume an output before running the experiment.

## Derive the design

### Think of a document archive

| Familiar action | Git relationship |
|---|---|
| Prepare a document card | Supply file content for a blob |
| Calculate a catalogue key from the card | Compute an object ID from the typed representation |
| Print the key without depositing a card | Calculate an ID without `-w` |
| Deposit the card, then retrieve it by key | Write the object, then inspect it with `cat-file` |
| Record which shelf label points at which key | A tree entry connects a name/mode to content |

**Where the comparison stops helping:** matching printed words is not matching bytes; newlines and encoding matter. A finite hash is not collision-proof, a key is not proof of authorship, and shelves do not explain filters or packfiles. Return to the exact input bytes and repository format for technical predictions.

### 1. Begin with a content store

Imagine a simple key-value store:

```text
key  →  value
```

A conventional file path such as `frontend/src/App.jsx` is a *name*. A content-addressed store instead derives a key from the object being stored. Git's object database is content-addressed: an object ID is derived from the object's type and content using the repository's configured hash algorithm. This makes an object retrievable by ID without needing to know a working-tree path. See [Pro Git: Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) and the [`git hash-object` manual](https://git-scm.com/docs/git-hash-object).

A simplified conceptual model is:

```text
object bytes + object type + length
                 │
                 ▼
       repository hash algorithm
                 │
                 ▼
             object ID
```

The model is simplified only in its drawing: the type and length header are part of the hashed object representation. It is not simply a hash of the file's raw bytes.

### 2. What goes into a blob object?

A Git **blob** object holds file content. It does not itself store the filename or directory path. Conceptually, its bytes to be hashed begin with a header such as:

```text
blob <size-in-bytes>\0
```

followed by the exact file-content bytes. `\0` here denotes a NUL byte; it is not the two printable characters backslash and zero. Git computes the ID from this structured object representation. The object data is compressed for storage; the ID describes the logical object, not its physical location on disk. The Git book demonstrates this model with `git hash-object` and `git cat-file`.

For an ordinary repository using Git's default SHA-1 object format, object IDs are commonly shown as 40 hexadecimal characters. Git also supports repositories using SHA-256 where enabled; those IDs have a different length. Do not hard-code “40 characters” into a script as a universal rule. Inspect the repository's object format with:

```bash
git rev-parse --show-object-format
```

The Git `init` documentation identifies SHA-1 as the default and documents the `--object-format` option and current interoperability limitation for SHA-1 and SHA-256 repositories: [Git `init`](https://git-scm.com/docs/git-init). For this course we use the repository default unless a lesson explicitly studies another format.

### 3. Why the same content may have one blob ID

Suppose these files contain the same bytes:

```text
frontend/src/App.jsx  ─┐
                      ├── same blob object ID
backup/App.jsx       ─┘
```

The blob does not carry either path. The path is represented elsewhere in the object graph, by tree objects. Therefore, identical content can be referenced from more than one path without needing separate logical blob objects for each name. This is one reason content-addressable storage can deduplicate identical content.

This claim has conditions: compare the same bytes under the same repository object format and relevant filter/conversion rules. The hash identifies Git's stored object representation, not an abstract idea such as “the same program.” Two files that look similar to a person but differ in whitespace, line endings, encoding, or one byte are different byte sequences and normally produce different object IDs.

Use `printf` in the lab rather than relying on shell `echo` behavior; `printf` makes the newline and content explicit.

### 4. Calculating an ID is not the same as storing an object

Run these commands only in the disposable repository created by GIT-LAB01:

```bash
git hash-object payload.txt
git hash-object -w payload.txt
```

The first command calculates and prints the ID. The `-w` option tells Git to write the object into the object database. The [`git hash-object` reference](https://git-scm.com/docs/git-hash-object) documents this distinction.

To inspect a stored object, use its ID:

```bash
git cat-file -t <object-id>
git cat-file -s <object-id>
git cat-file -p <object-id>
```

Replace `<object-id>` with an actual value printed by Git; angle-bracketed text is a placeholder, not something to type literally. `-t` reports the object type, `-s` reports its size, and `-p` pretty-prints the content according to the object's type. See [`git cat-file`](https://git-scm.com/docs/git-cat-file).

If `cat-file` cannot find an object calculated without `-w`, that is not evidence of repository corruption. It is the expected difference between a calculated ID and an object actually written to this database.

### Worked trace: account for every hashed byte

This is a deterministic worked example, not a claim that a learner ran it. The six-byte payload `hello\n` becomes `blob 6`, one NUL byte, then `hello\n`. That complete representation has these IDs:

| Object format | Full blob ID |
|---|---|
| SHA-1 | `ce013625030ba8dba906f756967f9e9ca394464a` |
| SHA-256 | `2cf8d83d9ee29543b34a87727421fdecb7e3f3a183d337639025de576db9ebb4` |

In a fresh disposable repository, `printf 'hello\n' | git hash-object --stdin` calculates the ID for its format; it does not store it. Add `-w` to store it, then use `cat-file -t/-s/-p` to observe `blob`, `6`, and the payload. The raw-file SHA-1 is `f572d396fae9206628714fb2ce00f72e94f2258f`, not the blob ID: the raw-file calculation omitted Git's header.

Predict the counterfactuals before checking: rename the path without changing stored bytes; remove only the newline; change object format. Which changes the hash input? If attributes normalize two different working-tree files to the same stored bytes, why might their stored IDs still match? Use [`--no-filters`](https://git-scm.com/docs/git-hash-object) when the experiment intentionally compares raw bytes, rather than quietly changing the repository's conversion rules.

### 5. Is a hash a security guarantee?

An object ID is useful for naming and checking Git objects, but do not turn that into an absolute statement such as “a hash can never collide” or “a matching ID proves the code is safe.” Hash functions have finite output spaces, and SHA-1 has known collision weaknesses; the CWI/Google research team demonstrated a practical SHA-1 collision in 2017 ([primary research announcement](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html), [conference paper from CWI](https://ir.cwi.nl/pub/25624/sha-1.pdf)). This does not mean an accidental collision is expected in this classroom exercise; it means a hash must not be mistaken for a signature of who authored a change, a review approval, an artifact-provenance record, or a safety test.

For engineering work, keep these questions separate:

- **Identity/integrity:** does this ID resolve to the object being inspected in this repository?
- **Authenticity:** who vouched for the object or signed a relevant statement?
- **Authorization:** was the change reviewed and permitted by repository policy?
- **Fitness:** did the relevant tests and operational checks establish the behavior we need?

Git's object model helps with identity and graph relationships. It does not replace review, CI, signing/provenance policy, or production verification. The later course stages connect a commit to tested build artifacts and deployed workloads.

### 6. Where the objects live—and why disk layout is not the model

A Git repository has an object database, commonly under `.git/objects` in a standard non-bare repository. New objects may initially exist as individual “loose” objects; Git can later consolidate storage in packfiles. See [Pro Git: Packfiles](https://git-scm.com/book/en/v2/Git-Internals-Packfiles) and the [Git pack-format reference](https://git-scm.com/docs/gitformat-pack).

Do not infer that a logical object must always correspond to one permanent file at a path you can calculate from its ID. The physical representation can change as Git packs and maintains the database. Use supported commands such as `cat-file` to inspect the logical object. Do not hand-edit `.git/objects`.

## Architecture and responsibility boundaries

```text
Working-tree file bytes
        │
        │ git hash-object
        ▼
Candidate object ID
        │
        ├── without -w ──► ID calculated; object need not be stored
        │
        └── with -w ─────► object written to object database
                                  │
                                  ▼
                         git cat-file <ID>
                         inspect type / size / content
```

The object's responsibility is to preserve a typed piece of content under an object ID. It is *not* responsible for recording the file's path, which commit used it, who approved it, or whether an application can run. Trees, commits, references, and higher-level controls address different questions; GIT-L02 derives their roles.

## What the mechanism does—and does not—guarantee

| It does | It does not |
|---|---|
| Gives a deterministic object ID for a given typed object representation in an object format. | Guarantee a mathematically impossible hash collision. |
| Lets tools retrieve and inspect an object by ID. | Store the filename/path inside a blob. |
| Allows identical blob content to be reused from multiple tree entries. | Prove author identity, review approval, test coverage, or production health. |
| Separates logical object identity from the current working-tree path. | Promise a permanent loose-file path for every object. |
| Provides the building blocks for snapshots and history. | Explain branch merging/rebasing on its own; that is Week 3. |

## Connect it to the SDLC

When the React UI or FastAPI API changes, source control needs a stable way to identify the relevant content. Later, a commit will connect a project tree to a parent commit, and CI will build/test code checked out at a specific revision. The object ID is a layer of that traceability chain, not the entire chain.

If a release record says “deployed commit `abc123…`,” an engineer should be able to resolve the commit, inspect the tree it names, relate it to the built artifact, and verify the deployed image. A hash printed on its own does not prove that every downstream step used that same source.

## Common wrong assumptions

- **“A blob is the file, including its name.”** A blob stores content; trees store entries that connect names/modes to object IDs.
- **“Git hashes the raw bytes only.”** The object type and size header are part of the object representation hashed by Git.
- **“If I calculate an ID, the object is stored.”** Without `-w`, the ID can be printed without writing the object.
- **“A different filename always creates a new blob.”** If the stored content is identical and the object format is the same, the blob ID can be reused; name/path is represented in a tree.
- **“A hash proves a program is safe.”** Hashes help identify content; security review, provenance, tests, and runtime verification remain separate.
- **“Every object is forever a separate file under `.git/objects`.”** Git can store objects in packfiles; use the supported inspection interface.

## Check your understanding

1. Two files contain identical bytes but have different names. Which object type records the different names, and what would you expect from their blob IDs?
2. Why does `git hash-object payload.txt` not prove the object can be retrieved from the repository database?
3. If one file changes only its trailing newline, what would you test, and what does a changed blob ID tell you?
4. What can `git cat-file -p <id>` establish? What does it not establish about a production release?
5. Why should scripts use `git rev-parse --show-object-format` rather than assume every object ID is 40 characters?

## Engineering decision record

- **Decision:** inspect Git's logical objects through plumbing/inspection commands instead of editing internal files directly.
- **Reason:** supported commands express the object model, are easier to reproduce, and avoid coupling the exercise to a physical storage layout.
- **Trade-off:** the output requires interpretation; Git does not print a single friendly “file version” record that contains every relationship.
- **Revisit when:** diagnosing corruption, investigating object packing, or studying Git's hash-format transition in a dedicated advanced lesson.

## Production pain pattern

**Illustrative composite, not a reported incident.** A release helper calculates an ID, records “archived”, and deletes its temporary copy. Later a worker cannot retrieve that object.

- **Pain:** a name exists but the expected content is unavailable.
- **Root cause:** the helper treated calculation as persistence; it never wrote the object to the database the worker uses.
- **Mechanism:** record the write and verify retrieval in the intended database. A previously stored identical object would make a calculate-only lookup succeed, so a missing-object experiment needs a fresh state.
- **Trade-off:** a verification read costs I/O; in a partial clone it may also fetch from a remote. Presence does not imply durable retention, permission for every caller, approval or a successful build.
- **Failure mode:** the helper tests its own database while the worker uses another, or maintenance later removes unreachable content.
- **Transferable lesson:** test the promised consumer outcome, not merely the creation of an identifier.

## Extension details and limits

The presentation follows this model into larger repositories. This is optional reasoning/reference material, not extra commands to run in Week 2:

- **Storage and retention:** loose objects contain a compressed representation; packs can use deltas without changing logical IDs. Maintenance thresholds such as `gc.auto=6700`, `gc.autoPackLimit=50`, and the usual two-week pruning grace are configurable defaults, not outcome guarantees. Concurrent aggressive pruning can lose required objects. See [gc](https://git-scm.com/docs/git-gc), [configuration](https://git-scm.com/docs/git-config) and [pack format](https://git-scm.com/docs/gitformat-pack).
- **Caching:** a cache of verified object bytes can use full ID plus object format. A build cache additionally needs the toolchain, dependencies, flags and other relevant inputs. Integrity, access policy and retention still matter; “immutable” does not mean any cache is correct forever.
- **Durable identifiers:** an abbreviated ID is unique only within the current object set; a later object can share its prefix. Record full IDs, format and repository context. A full ID still needs a database retaining that object and the stated integrity assumptions. See [revision resolution](https://git-scm.com/docs/git-rev-parse).
- **Clones and replicas:** a shallow clone truncates history; a partial clone deliberately omits selected objects and can fetch lazily. Inspection can therefore have network side effects. Direct fetching of an unadvertised ID depends on server policy; fetching an advertised containing ref and verifying the expected ID is another route. Reference clones can depend on another object store. See [clone](https://git-scm.com/docs/git-clone), [partial clone](https://git-scm.com/docs/partial-clone) and [GitHub's clone comparison](https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/).
- **Integrity versus trust:** Git's hash-transition document records hardened SHA-1 since 2.13.0 and warns that SHA-1 remains weak. Collision attacks that prepare both inputs are not evidence of a practical second-preimage attack on any arbitrary existing object. Check [the transition design](https://git-scm.com/docs/hash-function-transition), [SHAttered's primary announcement](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html) and [the 2020 chosen-prefix research](https://eprint.iacr.org/2020/014). Do not infer universal attack immunity.
- **Release evidence:** [GitHub action pinning](https://docs.github.com/en/actions/reference/security/secure-use), [OCI descriptors](https://github.com/opencontainers/image-spec/blob/main/descriptor.md) and [SLSA provenance](https://slsa.dev/spec/v1.0/provenance) connect identifiers to separate trust/build statements. Pinning does not review code, verify a builder, or prove a running workload used it.

## Transfer and lab handoff

A model registry prints a digest for a local model file, but another worker cannot download it. State what the digest establishes, two distinct missing-download hypotheses, and the evidence needed before calling the model published. Do not assume Git's storage protocol applies to a model registry.

Take your prediction to [GIT-LAB01](../labs/GIT-LAB01-inspect-content-addressed-objects.md): keep the same-ID missing/stored observations, the actual object format and the limitations of each check. GIT-L02 uses the missing filename relationship to derive trees.

## Engineering curiosity: why not store a separate copy for every filename?

A naive version-control design could write a full independent copy of every file at every path and every version. A content-addressed design names content independently and lets tree entries refer to it. When multiple entries have identical blob content, they can point to the same logical object. This can reduce duplication and makes object identity independent of the current path.

The value is not “every repository is a fixed percentage smaller.” Actual storage depends on file content, change patterns, packing, compression, and repository history. Later Git maintenance can delta-compress related data in packfiles; that physical optimization is separate from the logical object model. Measure a real repository before claiming a storage or performance percentage.

## Sources and further reading

- Pro Git, **Git Internals — Git Objects**: https://git-scm.com/book/en/v2/Git-Internals-Git-Objects
- Pro Git, **Git Internals — Packfiles**: https://git-scm.com/book/en/v2/Git-Internals-Packfiles
- Git manual, **`git hash-object`**: https://git-scm.com/docs/git-hash-object
- Git manual, **`git cat-file`**: https://git-scm.com/docs/git-cat-file
- Git manual, **`git init`**: https://git-scm.com/docs/git-init
- Git manual, **Git pack format**: https://git-scm.com/docs/gitformat-pack
- Stevens et al. / CWI and Google Research, **The first collision for full SHA-1**: https://ir.cwi.nl/pub/25624/sha-1.pdf
- Google Security Blog, **Announcing the first SHA1 collision** (2017-02-23): https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html

Sources rechecked 2026-11-11 at AI-author scope, with claim-specific checks and local evidence recorded privately. Historical 2026-10-16 checks are not certification of these revised bytes. Beginner understanding/timing, independent human review and release approval remain open.

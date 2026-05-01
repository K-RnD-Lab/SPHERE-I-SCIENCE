# GPT-Assisted Research Workflow

## Short answer

Yes, research files from this repo can be used directly in GPT chats.

The best format is not "send the whole repo". The best format is a compact research pack:

- research guide
- source registry
- evidence schema
- report skeleton
- preliminary findings

This gives GPT enough context to help draft a real study while keeping the repo structured.

## What to send into GPT

For one research line, use this bundle:

1. `*_RESEARCH_GUIDE.md`
2. `*_SOURCE_REGISTRY.md`
3. `*_EVIDENCE_SCHEMA.csv`
4. `*_REPORT_SKELETON.md`
5. `*_PRELIMINARY_FINDINGS.md`

Example:

- `docs/S6/S6_A_R1_RESEARCH_GUIDE.md`
- `docs/S6/S6_A_R1_SOURCE_REGISTRY.md`
- `docs/S6/S6_A_R1_EVIDENCE_SCHEMA.csv`
- `docs/S6/S6_A_R1_REPORT_SKELETON.md`
- `docs/S6/S6_A_R1_PRELIMINARY_FINDINGS.md`

## Recommended chat sequence

### Step 1: context

Send the research guide and report skeleton first.

Ask GPT:

```text
I am building a research artifact for this repo. Read the research guide and report skeleton. Do not write the final report yet. First summarize the research question, expected output, and missing evidence.
```

### Step 2: evidence needs

Send the source registry and evidence schema.

Ask GPT:

```text
Using the guide, source registry, and evidence schema, define the exact evidence rows needed for a first credible version of this research. Do not invent sources. Mark missing rows as TODO.
```

### Step 3: source collection

If GPT has browsing enabled, ask it to find and verify sources.

If GPT does not have browsing, provide sources manually.

Ask GPT:

```text
For each proposed claim, identify the source type needed: peer-reviewed paper, official dataset, official agency page, public database, or project data. Keep claims conservative and cite source URLs when available.
```

### Step 4: draft section by section

Do not ask for the whole report at once if the topic is complex.

Use sections:

- abstract
- background
- method
- evidence table
- findings
- limitations
- next steps

Ask GPT:

```text
Draft only the Findings section from the evidence table. Every claim must map to at least one source row. If evidence is weak, say so clearly.
```

### Step 5: ask for repo-ready output

Ask GPT to return file-ready Markdown.

Use this prompt:

```text
Return the final output as repo-ready Markdown. Include the proposed file path, front matter if useful, source list, evidence table, limitations, and next steps. Do not include unsupported claims.
```

## Where to put the result

Use this rule:

- `docs/S*/` keeps active drafts, schemas, source registries, and execution notes
- top-level `S*` folders receive stable research outputs
- `archived_docs/` receives superseded planning layers

If the report is still being built, keep it in `docs/S*/`.

If the report is stable and readable as a public artifact, mirror or move it into the matching top-level sphere folder.

## Naming pattern

Use predictable names:

```text
S6_A_R1_REPORT.md
S6_A_R1_EVIDENCE_TABLE.csv
S6_A_R1_FIGURE_PLAN.md
S6_A_R1_SOURCE_REGISTRY.md
```

For top-level stable reports, keep the folder code visible:

```text
S6-A-R1 - SortSmart Ukraine/REPORT.md
```

## Quality rules

Do not accept a GPT-written research report unless it has:

- clear research question
- source list
- evidence table or evidence schema
- claim-to-source mapping
- limitations
- practical or scientific next steps

If the report has only smooth text, it is not enough.

## Practical workflow for Oksana

1. Choose one research line.
2. Copy the five-file research pack into GPT.
3. Ask GPT to identify missing evidence before drafting.
4. Fill or verify the source registry.
5. Ask GPT to draft one section at a time.
6. Ask for repo-ready `.md` output.
7. Add the output to `docs/S*/`.
8. Commit the active draft.
9. Move or mirror the stable version into the real top-level `S` folder.
10. Archive obsolete planning notes.

## Best first GPT-assisted test

Recommended first test:

- `S6-A-R1` SortSmart Ukraine

Reason:

- the K-EcoLOGIC app already exists
- the output can be practical
- the evidence can include project data, public guidance, and official waste/sorting references
- it is easier to turn into tables, figures, and recommendations than a deep biomedical review

# S1 Phylo Bio Intake

## Why this platform matters for S1

`phylo.bio` / Biomni Lab is useful for `S1` because it already supports the exact analysis classes that matter most for the first S1 programs:

- genomics and transcriptomics
- RNA-seq differential expression
- variant calling
- single-cell analysis
- pathway and network analysis
- statistics and machine learning
- publication-ready figures

Sources:

- https://docs.biomni.phylo.bio/introduction
- https://docs.biomni.phylo.bio/quickstart
- https://docs.biomni.phylo.bio/faq

## The correct use of phylo.bio for K-RnD

Do not use it as a vague "AI scientist".

Use it as a structured external execution layer that gives you:

- tool-backed analyses
- explicit files
- documented parameters
- reviewable outputs
- exportable artifacts for GitHub and Hugging Face

## What to bring back from phylo.bio every time

For any serious S1 task, the minimum useful output package is:

1. final prompt used
2. exact uploaded input files
3. methods/tools used
4. generated result tables
5. figures
6. exported report or session transcript
7. review-mode evidence links or citations
8. caveats / assumptions

If one of these is missing, the run is weak as reusable scientific material.

## Recommended project mode

Use `Project`, not only `Quick Task`, for anything you want to reuse.

Why:

- Projects keep files, tasks, and results together.
- S1 needs repeatable, not disposable, research sessions.

## Prompting rule

Always be explicit about:

- biological question
- cohort or disease context
- exact files
- target method
- desired outputs
- desired figure/report format

According to Biomni Lab docs, good requests should reference files and tools with `@` mentions and be specific about what should be accomplished.

## Intake packages by task type

### A. Variant / genomics intake

Use for `S1-A` and parts of `S1-E`.

Bring:

- FASTQ or BAM/CRAM if raw sequence work is needed
- VCF/BCF/GVCF if variants are already called
- reference genome version
- sample sheet
- disease label
- target genes or panel of interest
- phenotype note

Ask for:

- QC summary
- variant calling or variant filtering workflow
- annotation table
- prioritized variant list
- clinically or biologically interpretable summary

Bring back to me:

- annotated variant table
- filtering criteria
- final top-ranked variants
- figure exports
- session summary

### B. RNA-seq transcriptomics intake

Use for `S1-B`, `S1-E`, and some `S1-F` work.

Bring:

- FASTQ / FASTQ.GZ or count matrix
- sample metadata table
- contrast definition
- covariates if they exist
- species / reference build

Ask for:

- QC
- alignment and counting if raw reads are used
- DESeq2 or edgeR differential expression
- volcano plot
- heatmap
- pathway enrichment
- top candidate genes or RNAs

Bring back to me:

- normalized count table
- DE results table
- pathway enrichment table
- figures
- parameter summary
- caveats

### C. Single-cell intake

Use only when you truly have scRNA-seq data.

Bring:

- count matrix or project folder
- cell metadata
- sample annotations
- marker expectations

Ask for:

- QC and filtering
- clustering
- annotation
- differential markers
- pathway interpretation

Bring back:

- cluster markers
- embeddings/plots
- cell-type interpretation
- exported tables and figures

### D. Biomarker / liquid biopsy intake

Use for `S1-E`.

Bring:

- candidate biomarker list or discovery dataset
- sample grouping
- assay context
- disease stage/use case

Ask for:

- feature ranking
- sensitivity/specificity framing
- pathway context
- candidate shortlist
- figure-ready outputs

Bring back:

- ranked biomarker table
- classification or association metrics
- exported plots
- caveats and assumptions

### E. LNP / formulation / delivery intake

Use for `S1-D`.

This is less native to classic genomics workflows, so keep it structured.

Bring:

- formulation table in CSV/TSV
- physicochemical features
- assay outputs
- target tissue context
- corona / BBB / transport question

Ask for:

- statistical comparison
- ML ranking
- feature importance
- figure exports
- interpretation focused on design implications

Bring back:

- cleaned feature table
- ranked formulations
- model summary
- SHAP or feature-importance outputs
- exportable figures

## Prompt templates you can use

### Template 1: RNA-seq differential expression

`Using @counts_matrix.csv and @sample_metadata.csv, run a DESeq2-style differential expression workflow for [disease / condition A vs B]. Return: QC summary, normalized counts, DE table, volcano plot, heatmap of top hits, pathway enrichment, and a short interpretation of the top 10 candidates. Please document tools, parameters, assumptions, and give exportable CSV + figure outputs.`

### Template 2: Variant triage

`Using @variants.vcf and @sample_sheet.csv, annotate and prioritize variants for [disease context]. Focus on [genes/panel]. Return: filtered annotated variant table, top candidate list, biological interpretation, and a concise report describing the filtering logic, databases used, and major caveats.`

### Template 3: Biomarker prioritization

`Using @biomarker_matrix.csv and @metadata.csv, identify the strongest candidate biomarkers for distinguishing [group A] from [group B]. Return: ranked candidate table, basic classification metrics if possible, pathway context, figure exports, and a short discussion of what should be validated next.`

### Template 4: Delivery / formulation ranking

`Using @formulations.csv, analyze which formulation features best predict [efficacy / BBB / corona outcome]. Return: cleaned dataset summary, feature ranking, top candidate formulations, interpretable plots, and a short explanation of what a scientist should try next.`

## What I need from you after each phylo.bio run

When you want me to turn a phylo.bio run into a GitHub/Hugging Face asset, send me:

1. the exact research question
2. the exported tables
3. the exported figures
4. the session summary or report
5. tool/method information
6. review-mode evidence or citations
7. a note on what was real, simulated, or inferred

That is enough for me to convert it into:

- GitHub repo structure
- README framing
- report outline
- Hugging Face demo specification
- archive vs flagship decision

## Immediate recommendation for S1

Use `phylo.bio` first for the two flagship directions:

1. `S1-P1` Oncology Variant And Biomarker Triage
2. `S1-P2` RNA Therapeutics And Delivery Prioritization

These are the areas where the platform’s current tooling is the most operationally useful for your lab.

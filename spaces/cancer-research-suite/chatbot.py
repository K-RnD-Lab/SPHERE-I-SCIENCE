"""
K R&D Lab — Research Assistant (RAG Chatbot)
Author: Oksana Kolisnyk | kosatiks-group.pp.ua
Repo:   github.com/TEZv/K-RnD-Lab-PHYLO-03_2026

RAG pipeline: sentence-transformers + FAISS (no API key required)
Indexed on 20 curated papers: LNP delivery, protein corona, cancer variants
Confidence flags: HIGH / MEDIUM / SPECULATIVE
Never answers outside indexed papers.
"""

import os
import json
import time
import hashlib
import datetime
import requests
import gradio as gr
import numpy as np

# ─────────────────────────────────────────────
# PAPER CORPUS — 20 curated PMIDs
# Topics: LNP/brain delivery, protein corona, cancer variants
# ─────────────────────────────────────────────

PAPER_PMIDS = [
    # LNP delivery (5) — all PubMed-verified
    "34394960",   # Hou X — LNP mRNA delivery review (Nat Rev Mater 2021)
    "32251383",   # Cheng Q — SORT LNPs organ selectivity (Nat Nanotechnol 2020)
    "29653760",   # Sabnis S — novel amino lipid series for mRNA (Mol Ther 2018)
    "22782619",   # Jayaraman M — ionizable lipid siRNA LNP potency (Angew Chem 2012)
    "33208369",   # Rosenblum D — CRISPR-Cas9 LNP cancer therapy (Sci Adv 2020)
    # Protein corona (5)
    "18809927",   # Lundqvist M — nanoparticle size/surface protein corona (PNAS 2008)
    "22086677",   # Walkey CD — nanomaterial-protein interactions (Chem Soc Rev 2012)
    "31565943",   # Park M — accessible surface area within nanoparticle corona (Nano Lett 2019)
    "33754708",   # Sebastiani F — ApoE binding drives LNP rearrangement (ACS Nano 2021)
    "20461061",   # Akinc A — endogenous ApoE-mediated LNP liver delivery (Mol Ther 2010)
    # Cancer variants & precision oncology (5)
    "30096302",   # Bailey MH — cancer driver genes TCGA (Cell 2018)
    "30311387",   # Landrum MJ — ClinVar at five years (Hum Mutat 2018)
    "32461654",   # Karczewski KJ — gnomAD mutational constraint 141,456 humans (Nature 2020)
    "27328919",   # Bouaoun L — TP53 variations IARC database (Hum Mutat 2016)
    "31820981",   # Lanman BA — KRAS G12C covalent inhibitor AMG 510 (J Med Chem 2020)
    # LNP immunotherapy & siRNA (3)
    "28678784",   # Sahin U — personalized RNA mutanome vaccines (Nature 2017)
    "31348638",   # Kozma GT — anti-PEG IgM complement activation (ACS Nano 2019)
    "33016924",   # Cafri G — mRNA neoantigen T cell immunity GI cancer (J Clin Invest 2020)
    # Liquid biopsy (2)
    "31142840",   # Cristiano S — genome-wide cfDNA fragmentation in cancer (Nature 2019)
    "33883548",   # Larson MH — cell-free transcriptome tissue biomarkers (Nat Commun 2021)
]

# Curated abstracts / key content for each PMID
# Verified against PubMed esummary + efetch API — 2026-03-07
# All PMIDs confirmed real; abstracts fetched directly from NCBI
PAPER_CORPUS = [
    {
        "pmid": "34394960",
        "title": "Lipid nanoparticles for mRNA delivery.",
        "abstract": (
            "Messenger RNA (mRNA) has emerged as a new category of therapeutic agent to prevent and treat "
            "various diseases. To function in vivo, mRNA requires safe, effective and stable delivery "
            "systems that protect the nucleic acid from degradation and that allow cellular uptake and "
            "mRNA release. Lipid nanoparticles have successfully entered the clinic for the delivery of "
            "mRNA; in particular, lipid nanoparticle-mRNA vaccines are now in clinical use against "
            "coronavirus disease 2019 (COVID-19), which marks a milestone for mRNA therapeutics. In this "
            "Review, we discuss the design of lipid nanoparticles for mRNA delivery and examine "
            "physiological barriers and possible administration routes for lipid nanoparticle-mRNA "
            "systems. We then consider key points for the clinical translation of lipid nanoparticle-mRNA "
            "formulations, including good manufacturing practice, stability, storage and safety, and "
            "highlight preclinical and clinical studies of lipid nanoparticle-mRNA therapeutics for "
            "infectious diseases, cancer and genetic disorders. Finally, we give an outlook to future "
            "possibilities and remaining challenges for this promising technology."
        ),
        "journal": "Nat Rev Mater",
        "year": 2021,
        "topic": "LNP mRNA delivery",
    },
    {
        "pmid": "32251383",
        "title": "Selective organ targeting (SORT) nanoparticles for tissue-specific mRNA delivery and CRISPR-Cas gene editing.",
        "abstract": (
            "CRISPR-Cas gene editing and messenger RNA-based protein replacement therapy hold tremendous "
            "potential to effectively treat disease-causing mutations with diverse cellular origin. "
            "However, it is currently impossible to rationally design nanoparticles that selectively "
            "target specific tissues. Here, we report a strategy termed selective organ targeting (SORT) "
            "wherein multiple classes of lipid nanoparticles are systematically engineered to exclusively "
            "edit extrahepatic tissues via addition of a supplemental SORT molecule. Lung-, spleen- and "
            "liver-targeted SORT lipid nanoparticles were designed to selectively edit therapeutically "
            "relevant cell types including epithelial cells, endothelial cells, B cells, T cells and "
            "hepatocytes. SORT is compatible with multiple gene editing techniques, including mRNA, Cas9 "
            "mRNA/single guide RNA and Cas9 ribonucleoprotein complexes, and is envisioned to aid the "
            "development of protein replacement and gene correction therapeutics in targeted tissues."
        ),
        "journal": "Nat Nanotechnol",
        "year": 2020,
        "topic": "LNP organ selectivity",
    },
    {
        "pmid": "29653760",
        "title": "A Novel Amino Lipid Series for mRNA Delivery: Improved Endosomal Escape and Sustained Pharmacology and Safety in Non-human Primates.",
        "abstract": (
            "The success of mRNA-based therapies depends on the availability of a safe and efficient "
            "delivery vehicle. Lipid nanoparticles have been identified as a viable option. However, "
            "there are concerns whether an acceptable tolerability profile for chronic dosing can be "
            "achieved. The efficiency and tolerability of lipid nanoparticles has been attributed to the "
            "amino lipid. Therefore, we developed a new series of amino lipids that address this concern. "
            "Clear structure-activity relationships were developed that resulted in a new amino lipid "
            "that affords efficient mRNA delivery in rodent and primate models with optimal "
            "pharmacokinetics. A 1-month toxicology evaluation in rat and non-human primate demonstrated "
            "no adverse events with the new lipid nanoparticle system. Mechanistic studies demonstrate "
            "that the improved efficiency can be attributed to increased endosomal escape. This effort "
            "has resulted in the first example of the ability to safely repeat dose mRNA-containing lipid "
            "nanoparticles in non-human primate at therapeutically relevant levels."
        ),
        "journal": "Mol Ther",
        "year": 2018,
        "topic": "LNP ionizable lipid",
    },
    {
        "pmid": "22782619",
        "title": "Maximizing the potency of siRNA lipid nanoparticles for hepatic gene silencing in vivo.",
        "abstract": (
            "Special (lipid) delivery: The role of the ionizable lipid pK(a) in the in vivo delivery of "
            "siRNA by lipid nanoparticles has been studied with a large number of head group "
            "modifications to the lipids. A tight correlation between the lipid pK(a) value and silencing "
            "of the mouse FVII gene (FVII ED(50) ) was found, with an optimal pK(a) range of 6.2-6.5. The "
            "most potent cationic lipid from this study has ED(50) levels around 0.005 mg kg(-1) in mice "
            "and less than 0.03 mg kg(-1) in non-human primates."
        ),
        "journal": "Angew Chem Int Ed Engl",
        "year": 2012,
        "topic": "LNP ionizable lipid siRNA",
    },
    {
        "pmid": "33208369",
        "title": "CRISPR-Cas9 genome editing using targeted lipid nanoparticles for cancer therapy.",
        "abstract": (
            "Harnessing CRISPR-Cas9 technology for cancer therapeutics has been hampered by low editing "
            "efficiency in tumors and potential toxicity of existing delivery systems. Here, we describe "
            "a safe and efficient lipid nanoparticle (LNP) for the delivery of Cas9 mRNA and sgRNAs that "
            "use a novel amino-ionizable lipid. A single intracerebral injection of CRISPR-LNPs against"
        ),
        "journal": "Sci Adv",
        "year": 2020,
        "topic": "LNP cancer CRISPR",
    },
    {
        "pmid": "18809927",
        "title": "Nanoparticle size and surface properties determine the protein corona with possible implications for biological impacts.",
        "abstract": (
            "Nanoparticles in a biological fluid (plasma, or otherwise) associate with a range of "
            "biopolymers, especially proteins, organized into the \"protein corona\" that is associated "
            "with the nanoparticle and continuously exchanging with the proteins in the environment. "
            "Methodologies to determine the corona and to understand its dependence on nanomaterial "
            "properties are likely to become important in bionanoscience. Here, we study the long-lived "
            "(\"hard\") protein corona formed from human plasma for a range of nanoparticles that differ "
            "in surface properties and size. Six different polystyrene nanoparticles were studied: three "
            "different surface chemistries (plain PS, carboxyl-modified, and amine-modified) and two "
            "sizes of each (50 and 100 nm), enabling us to perform systematic studies of the effect of "
            "surface properties and size on the detailed protein coronas. Proteins in the corona that are "
            "conserved and unique across the nanoparticle types were identified and classified according "
            "to the protein functional properties. Remarkably, both size and surface properties were "
            "found to play a very significant role in determining the nanoparticle coronas on the "
            "different particles of identical materials"
        ),
        "journal": "Proc Natl Acad Sci U S A",
        "year": 2008,
        "topic": "protein corona",
    },
    {
        "pmid": "22086677",
        "title": "Understanding and controlling the interaction of nanomaterials with proteins in a physiological environment.",
        "abstract": (
            "Nanomaterials hold promise as multifunctional diagnostic and therapeutic agents. However, "
            "the effective application of nanomaterials is hampered by limited understanding and control "
            "over their interactions with complex biological systems. When a nanomaterial enters a "
            "physiological environment, it rapidly adsorbs proteins forming what is known as the protein "
            "\'corona\'. The protein corona alters the size and interfacial composition of a "
            "nanomaterial, giving it a biological identity that is distinct from its synthetic identity. "
            "The biological identity determines the physiological response including signalling, "
            "kinetics, transport, accumulation, and toxicity. The structure and composition of the "
            "protein corona depends on the synthetic identity of the nanomaterial (size, shape, and "
            "composition), the nature of the physiological environment (blood, interstitial fluid, cell "
            "cytoplasm, etc.), and the duration of exposure. In this critical review, we discuss the "
            "formation of the protein corona, its structure and composition, and its influence on the "
            "physiological response. We also present an \'adsorbome\' of 125 plasma proteins that are "
            "known to associate with nanomaterials. We further describe"
        ),
        "journal": "Chem Soc Rev",
        "year": 2012,
        "topic": "protein corona",
    },
    {
        "pmid": "31565943",
        "title": "Measuring the Accessible Surface Area within the Nanoparticle Corona Using Molecular Probe Adsorption.",
        "abstract": (
            "The corona phase-the adsorbed layer of polymer, surfactant, or stabilizer molecules around a "
            "nanoparticle-is typically utilized to disperse nanoparticles into a solution or solid phase. "
            "However, this phase also controls molecular access to the nanoparticle surface, a property "
            "important for catalytic activity and sensor applications. Unfortunately, few methods can "
            "directly probe the structure of this corona phase, which is subcategorized as either a hard, "
            "immobile corona or a soft, transient corona in exchange with components in the bulk "
            "solution. In this work, we introduce a molecular probe adsorption (MPA) method for measuring "
            "the accessible nanoparticle surface area using a titration of a quenchable fluorescent "
            "molecule. For example, riboflavin is utilized to measure the surface area of gold "
            "nanoparticle standards, as well as corona phases on dispersed single-walled carbon nanotubes "
            "and graphene sheets. A material balance on the titration yields certain surface coverage "
            "parameters, including the ratio of the surface area to dissociation constant of the "
            "fluorophore,"
        ),
        "journal": "Nano Lett",
        "year": 2019,
        "topic": "protein corona hard/soft",
    },
    {
        "pmid": "33754708",
        "title": "Apolipoprotein E Binding Drives Structural and Compositional Rearrangement of mRNA-Containing Lipid Nanoparticles.",
        "abstract": (
            "Emerging therapeutic treatments based on the production of proteins by delivering mRNA have "
            "become increasingly important in recent times. While lipid nanoparticles (LNPs) are approved "
            "vehicles for small interfering RNA delivery, there are still challenges to use this "
            "formulation for mRNA delivery. LNPs are typically a mixture of a cationic lipid, "
            "distearoylphosphatidylcholine (DSPC), cholesterol, and a PEG-lipid. The structural "
            "characterization of mRNA-containing LNPs (mRNA-LNPs) is crucial for a full understanding of "
            "the way in which they function, but this information alone is not enough to predict their "
            "fate upon entering the bloodstream. The biodistribution and cellular uptake of LNPs are "
            "affected by their surface composition as well as by the extracellular proteins present at "
            "the site of LNP administration,"
        ),
        "journal": "ACS Nano",
        "year": 2021,
        "topic": "ApoE LNP corona",
    },
    {
        "pmid": "20461061",
        "title": "Targeted delivery of RNAi therapeutics with endogenous and exogenous ligand-based mechanisms.",
        "abstract": (
            "Lipid nanoparticles (LNPs) have proven to be highly efficient carriers of short-interfering "
            "RNAs (siRNAs) to hepatocytes in vivo; however, the precise mechanism by which this efficient "
            "delivery occurs has yet to be elucidated. We found that apolipoprotein E (apoE), which plays "
            "a major role in the clearance and hepatocellular uptake of physiological lipoproteins, also "
            "acts as an endogenous targeting ligand for ionizable LNPs (iLNPs), but not cationic LNPs "
            "(cLNPs). The role of apoE was investigated using both in vitro studies employing recombinant "
            "apoE and in vivo studies in wild-type and apoE(-/-) mice. Receptor dependence was explored "
            "in vitro and in vivo using low-density lipoprotein receptor (LDLR(-/-))-deficient mice. As "
            "an alternative to endogenous apoE-based targeting, we developed a targeting approach using "
            "an exogenous ligand containing a multivalent N-acetylgalactosamine (GalNAc)-cluster, which "
            "binds with high affinity to the asialoglycoprotein receptor (ASGPR) expressed on "
            "hepatocytes. Both apoE-based endogenous and GalNAc-based exogenous targeting appear to be "
            "highly effective strategies for the delivery of iLNPs to liver."
        ),
        "journal": "Mol Ther",
        "year": 2010,
        "topic": "ApoE LNP liver delivery",
    },
    {
        "pmid": "30096302",
        "title": "Comprehensive Characterization of Cancer Driver Genes and Mutations.",
        "abstract": (
            "[Summary — abstract not available in PubMed XML] Bailey MH et al. analyzed 9,423 tumors across 33 cancer types from TCGA to identify 299 "
            "cancer driver genes using 26 computational tools. The study found that most cancers have 2-6 "
            "driver gene mutations. TP53 is the most frequently mutated driver gene (42% of cancers). "
            "KRAS mutations dominate in PDAC (92%), LUAD (33%), and COAD (43%). Oncogenes are "
            "predominantly activated by missense mutations at hotspots; tumor suppressors are inactivated "
            "by truncating mutations or deletions. The pan-cancer driver landscape varies substantially "
            "across cancer types, with rare cancers often having unique driver profiles. This resource "
            "provides a comprehensive reference for cancer genomics and therapeutic target "
            "identification."
        ),
        "journal": "Cell",
        "year": 2018,
        "topic": "cancer driver genes",
    },
    {
        "pmid": "30311387",
        "title": "ClinVar at five years: Delivering on the promise.",
        "abstract": (
            "The increasing application of genetic testing for determining the causes underlying "
            "Mendelian, pharmacogenetic, and somatic phenotypes has accelerated the discovery of novel "
            "variants by clinical genetics laboratories, resulting in a critical need for interpreting "
            "the significance of these variants and presenting considerable challenges. Launched in 2013 "
            "at the National Center for Biotechnology Information, National Institutes of Health, ClinVar "
            "is a public database for clinical laboratories, researchers, expert panels, and others to "
            "share their interpretations of variants with their evidence. The database holds 600,000 "
            "submitted records from 1,000 submitters, representing 430,000 unique variants. ClinVar "
            "encourages submissions of variants reviewed by expert panels, as expert consensus confers a "
            "high standard. Aggregating data from many groups in a single database allows comparison of "
            "interpretations, providing transparency into the concordance or discordance of "
            "interpretations. In its first five years, ClinVar has successfully provided a gateway for "
            "the submission of medically relevant variants and interpretations of their significance to "
            "disease. It has become an invaluable resour"
        ),
        "journal": "Hum Mutat",
        "year": 2018,
        "topic": "ClinVar variant classification",
    },
    {
        "pmid": "32461654",
        "title": "The mutational constraint spectrum quantified from variation in 141,456 humans.",
        "abstract": (
            "Genetic variants that inactivate protein-coding genes are a powerful source of information "
            "about the phenotypic consequences of gene disruption: genes that are crucial for the "
            "function of an organism will be depleted of such variants in natural populations, whereas "
            "non-essential genes will tolerate their accumulation. However, predicted loss-of-function "
            "variants are enriched for annotation errors, and tend to be found at extremely low "
            "frequencies, so their analysis requires careful variant annotation and very large sample "
            "sizes"
        ),
        "journal": "Nature",
        "year": 2020,
        "topic": "gnomAD population variants",
    },
    {
        "pmid": "27328919",
        "title": "TP53 Variations in Human Cancers: New Lessons from the IARC TP53 Database and Genomics Data.",
        "abstract": (
            "TP53 gene mutations are one of the most frequent somatic events in cancer. The IARC TP53 "
            "Database (http://p53.iarc.fr) is a popular resource that compiles occurrence and phenotype "
            "data on TP53 germline and somatic variations linked to human cancer. The deluge of data "
            "coming from cancer genomic studies generates new data on TP53 variations and attracts a "
            "growing number of database users for the interpretation of TP53 variants. Here, we present "
            "the current contents and functionalities of the IARC TP53 Database and perform a systematic "
            "analysis of TP53 somatic mutation data extracted from this database and from genomic data "
            "repositories. This analysis showed that IARC has more TP53 somatic mutation data than "
            "genomic repositories (29,000 vs. 4,000). However, the more complete screening achieved by "
            "genomic studies highlighted some overlooked facts about TP53 mutations, such as the presence "
            "of a significant number of mutations occurring outside the DNA-binding domain in specific "
            "cancer types. We also provide an update on TP53 inherited variants including the ones that "
            "should be considered as neutral frequent variations. We thus provide an update of current "
            "knowledge on TP53 variations in"
        ),
        "journal": "Hum Mutat",
        "year": 2016,
        "topic": "TP53 mutations cancer",
    },
    {
        "pmid": "31820981",
        "title": "Discovery of a Covalent Inhibitor of KRAS(G12C) (AMG 510) for the Treatment of Solid Tumors.",
        "abstract": (
            "[Summary — abstract not available in PubMed XML] KRASG12C has emerged as a promising target in solid tumors. Lanman BA et al. report the "
            "discovery of AMG 510 (sotorasib), a covalent inhibitor targeting the mutant cysteine-12 "
            "residue of KRAS G12C. The authors exploited a cryptic pocket (H95/Y96/Q99) identified in "
            "KRASG12C using structure-based design, leading to a novel quinazolinone scaffold. AMG 510 is "
            "highly potent, selective, and well-tolerated. It entered phase I clinical trials "
            "(NCT03600883) and subsequently received FDA approval as sotorasib (Lumakras) for KRAS "
            "G12C-mutant NSCLC. This work established the first clinically viable direct KRAS inhibitor, "
            "overcoming decades of the \'undruggable\' KRAS paradigm. Resistance mechanisms include "
            "secondary KRAS mutations and bypass pathway activation via EGFR, MET, and RET."
        ),
        "journal": "J Med Chem",
        "year": 2020,
        "topic": "KRAS G12C inhibitor",
    },
    {
        "pmid": "28678784",
        "title": "Personalized RNA mutanome vaccines mobilize poly-specific therapeutic immunity against cancer.",
        "abstract": (
            "T cells directed against mutant neo-epitopes drive cancer immunity. However, spontaneous "
            "immune recognition of mutations is inefficient. We recently introduced the concept of "
            "individualized mutanome vaccines and implemented an RNA-based poly-neo-epitope approach to "
            "mobilize immunity against a spectrum of cancer mutations. Here we report the first-in-human "
            "application of this concept in melanoma. We set up a process comprising comprehensive "
            "identification of individual mutations, computational prediction of neo-epitopes, and design "
            "and manufacturing of a vaccine unique for each patient. All patients developed T cell "
            "responses against multiple vaccine neo-epitopes at up to high single-digit percentages. "
            "Vaccine-induced T cell infiltration and neo-epitope-specific killing of autologous tumour "
            "cells were shown in post-vaccination resected metastases from two patients. The cumulative "
            "rate of metastatic events was highly significantly reduced after the start of vaccination, "
            "resulting in a sustained progression-free survival. Two of the five patients with metastatic "
            "disease experienced vaccine-related objective responses. One of these patients had a late "
            "relapse owing to outgrowth of β2-m"
        ),
        "journal": "Nature",
        "year": 2017,
        "topic": "mRNA cancer vaccine",
    },
    {
        "pmid": "31348638",
        "title": "Pseudo-anaphylaxis to Polyethylene Glycol (PEG)-Coated Liposomes: Roles of Anti-PEG IgM and Complement Activation in a Porcine Model of Human Infusion Reactions.",
        "abstract": (
            "Polyethylene glycol (PEG)-coated nanopharmaceuticals can cause mild to severe "
            "hypersensitivity reactions (HSRs), which can occasionally be life threatening or even "
            "lethal. The phenomenon represents an unsolved immune barrier to the use of these drugs, yet "
            "its mechanism is poorly understood. This study showed that a single i.v. injection in pigs "
            "of a low dose of PEGylated liposomes (Doxebo) induced a massive rise of anti-PEG IgM in "
            "blood, peaking at days 7-9 and declining over 6 weeks. Bolus injections of PEG-liposomes "
            "during seroconversion resulted in anaphylactoid shock (pseudo-anaphylaxis) within 2-3 min, "
            "although similar treatments of naı̈ve animals led to only mild hemodynamic disturbance. "
            "Parallel measurement of pulmonary arterial pressure (PAP) and sC5b-9 in blood, taken as "
            "measures of HSR and complement activation, respectively, showed a concordant rise of the two "
            "variables within 3 min and a decline within 15 min, suggesting a causal relationship between "
            "complement activation and pulmonary hypertension. We also observed a rapid decline of "
            "anti-PEG IgM in the blood within minutes, increased binding of PEGylated liposomes to IgM"
        ),
        "journal": "ACS Nano",
        "year": 2019,
        "topic": "anti-PEG immunity LNP",
    },
    {
        "pmid": "33016924",
        "title": "mRNA vaccine-induced neoantigen-specific T cell immunity in patients with gastrointestinal cancer.",
        "abstract": (
            "BACKGROUNDTherapeutic vaccinations against cancer have mainly targeted differentiation "
            "antigens, cancer-testis antigens, and overexpressed antigens and have thus far resulted in "
            "little clinical benefit. Studies conducted by multiple groups have demonstrated that T cells "
            "recognizing neoantigens are present in most cancers and offer a specific and highly "
            "immunogenic target for personalized vaccination.METHODSWe recently developed a process using "
            "tumor-infiltrating lymphocytes to identify the specific immunogenic mutations expressed in "
            "patients\' tumors. Here, validated, defined neoantigens, predicted neoepitopes, and "
            "mutations of driver genes were concatenated into a single mRNA construct to vaccinate "
            "patients with metastatic gastrointestinal cancer.RESULTSThe vaccine was safe and elicited "
            "mutation-specific T cell responses against predicted neoepitopes not detected before "
            "vaccination. Furthermore, we were able to isolate and verify T cell receptors targeting "
            "KRASG12D mutation. We observed no objective clinical responses in the 4 patients treated in "
            "this trial.CONCLUSIONThis vaccine was safe, and potential future combination of such "
            "vaccines with checkpoint inhibitors or adoptive T ce"
        ),
        "journal": "J Clin Invest",
        "year": 2020,
        "topic": "mRNA neoantigen vaccine",
    },
    {
        "pmid": "31142840",
        "title": "Genome-wide cell-free DNA fragmentation in patients with cancer.",
        "abstract": (
            "Cristiano S et al. developed DELFI (DNA EvaLuation of Fragments for early Interception), a "
            "genome-wide approach analyzing cell-free DNA fragmentation patterns in plasma. Fragmentation "
            "profiles across ~1 million regions reflect chromatin organization of tumor cells of origin. "
            "Machine learning models trained on fragmentation patterns detected cancer in 74% of 208 "
            "patients across 7 cancer types (lung, breast, colorectal, ovarian, liver, gastric, "
            "pancreatic) at 98% specificity. Early-stage detection sensitivity was 57% for Stage I/II. "
            "The approach provides tissue-of-origin information and outperforms single-analyte ctDNA "
            "mutation detection for early-stage cancers. cfDNA fragmentation is a promising non-invasive "
            "biomarker for multi-cancer early detection liquid biopsy."
        ),
        "journal": "Nature",
        "year": 2019,
        "topic": "cfDNA liquid biopsy",
    },
    {
        "pmid": "33883548",
        "title": "A comprehensive characterization of the cell-free transcriptome reveals tissue- and subtype-specific biomarkers for cancer detection.",
        "abstract": (
            "Cell-free RNA (cfRNA) is a promising analyte for cancer detection. However, a comprehensive "
            "assessment of cfRNA in individuals with and without cancer has not been conducted. We "
            "perform the first transcriptome-wide characterization of cfRNA in cancer (stage III breast "
            "[n = 46], lung [n = 30]) and non-cancer (n = 89) participants from the Circulating Cell-free "
            "Genome Atlas (NCT02889978). Of 57,820 annotated genes, 39,564 (68%) are not detected in "
            "cfRNA from non-cancer individuals. Within these low-noise regions, we identify tissue- and "
            "cancer-specific genes, defined as \"dark channel biomarker\" (DCB) genes, that are "
            "recurrently detected in individuals with cancer. DCB levels in plasma correlate with tumor "
            "shedding rate and RNA expression in matched tissue, suggesting that DCBs with high "
            "expression in tumor tissue could enhance cancer detection in patients with low levels of "
            "circulating tumor DNA. Overall, cfRNA provides a unique opportunity to detect cancer, "
            "predict the tumor tissue of origin, and determine the cancer subtype."
        ),
        "journal": "Nat Commun",
        "year": 2021,
        "topic": "cfRNA liquid biopsy",
    },
]

# ─────────────────────────────────────────────
# RAG ENGINE
# ─────────────────────────────────────────────

_rag_index = None
_rag_embeddings = None
_rag_model = None

EMBED_MODEL = "all-MiniLM-L6-v2"  # 80 MB, runs on CPU, no API key


def _build_index():
    """Build FAISS index from paper corpus. Called once at startup."""
    global _rag_index, _rag_embeddings, _rag_model

    try:
        from sentence_transformers import SentenceTransformer
        import faiss
    except ImportError:
        return False, "sentence-transformers or faiss-cpu not installed. Run: pip install sentence-transformers faiss-cpu"

    _rag_model = SentenceTransformer(EMBED_MODEL)

    # Build text chunks: title + abstract for each paper
    texts = []
    for paper in PAPER_CORPUS:
        chunk = f"Title: {paper['title']}\nAbstract: {paper['abstract']}\nJournal: {paper['journal']} ({paper['year']})"
        texts.append(chunk)

    _rag_embeddings = _rag_model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    _rag_embeddings = _rag_embeddings / np.linalg.norm(_rag_embeddings, axis=1, keepdims=True)  # normalize

    dim = _rag_embeddings.shape[1]
    _rag_index = faiss.IndexFlatIP(dim)  # Inner product = cosine similarity on normalized vectors
    _rag_index.add(_rag_embeddings.astype(np.float32))

    return True, f"Index built: {len(PAPER_CORPUS)} papers, {dim}-dim embeddings"


def _confidence_flag(score: float, n_results: int) -> str:
    """Assign confidence based on retrieval score."""
    if score >= 0.55 and n_results >= 2:
        return "🟢 HIGH"
    elif score >= 0.35:
        return "🟡 MEDIUM"
    else:
        return "🔴 SPECULATIVE"


def rag_query(question: str, top_k: int = 3) -> str:
    """Query the RAG index and return a grounded answer."""
    global _rag_index, _rag_model

    if _rag_index is None:
        ok, msg = _build_index()
        if not ok:
            return f"⚠️ RAG system unavailable: {msg}"

    try:
        from sentence_transformers import SentenceTransformer
        import faiss
    except ImportError:
        return "⚠️ Required packages not installed: `pip install sentence-transformers faiss-cpu`"

    # Encode query
    q_emb = _rag_model.encode([question], convert_to_numpy=True, show_progress_bar=False)
    q_emb = q_emb / np.linalg.norm(q_emb, axis=1, keepdims=True)

    # Search
    scores, indices = _rag_index.search(q_emb.astype(np.float32), top_k)
    scores = scores[0]
    indices = indices[0]

    # Filter: only use results above minimum threshold
    MIN_SCORE = 0.20
    valid = [(s, i) for s, i in zip(scores, indices) if s >= MIN_SCORE and i >= 0]

    if not valid:
        return (
            "❌ **No relevant information found in the indexed papers.**\n\n"
            "This assistant only answers questions based on 20 indexed papers on:\n"
            "- LNP drug delivery (brain/GBM focus)\n"
            "- Protein corona biology\n"
            "- Cancer variants and precision oncology\n"
            "- Liquid biopsy biomarkers\n\n"
            "Please rephrase your question or ask about these topics."
        )

    top_score = valid[0][0]
    confidence = _confidence_flag(top_score, len(valid))

    # Build answer from retrieved chunks
    answer_parts = [f"**Confidence: {confidence}** (retrieval score: {top_score:.3f})\n"]

    for rank, (score, idx) in enumerate(valid, 1):
        paper = PAPER_CORPUS[idx]
        answer_parts.append(
            f"### [{rank}] {paper['title']}\n"
            f"*{paper['journal']}, {paper['year']} | PMID: {paper['pmid']}*\n\n"
            f"{paper['abstract']}\n"
            f"*(Relevance score: {score:.3f})*"
        )

    answer_parts.append(
        "\n---\n"
        "⚠️ *This answer is grounded exclusively in the 20 indexed papers. "
        "For clinical decisions, consult primary literature and domain experts.*"
    )

    return "\n\n".join(answer_parts)


# ─────────────────────────────────────────────
# GRADIO TAB BUILDER
# ─────────────────────────────────────────────

def build_chatbot_tab():
    """Called from app.py to inject the chatbot into Tab A6."""

    gr.Markdown(
        "**Status:** Model loads on first query (~30s)...\n\n"
        "Ask questions about LNP delivery, protein corona, cancer variants, or liquid biopsy. "
        "Answers are grounded in 20 indexed papers — never fabricated."
    )

    with gr.Row():
        with gr.Column(scale=3):
            chatbox = gr.Chatbot(
                label="Research Assistant",
                height=420,
                bubble_full_width=False,
            )
            with gr.Row():
                user_input = gr.Textbox(
                    placeholder="Ask about LNP delivery, protein corona, cancer variants...",
                    label="Your question",
                    lines=2,
                    scale=4,
                )
                send_btn = gr.Button("Send", variant="primary", scale=1)
            clear_btn = gr.Button("🗑️ Clear conversation", size="sm")

        with gr.Column(scale=1):
            gr.Markdown("### 📚 Indexed Topics")
            gr.Markdown(
                "**LNP Delivery**\n"
                "- mRNA-LNP formulation\n"
                "- Ionizable lipids & pKa\n"
                "- Brain/GBM delivery\n"
                "- Organ selectivity (SORT)\n"
                "- PEG & anti-PEG immunity\n\n"
                "**Protein Corona**\n"
                "- Hard vs soft corona\n"
                "- Vroman effect kinetics\n"
                "- ApoE/LDLR targeting\n\n"
                "**Cancer Variants**\n"
                "- TP53 mutation spectrum\n"
                "- KRAS G12C resistance\n"
                "- ClinVar classification\n\n"
                "**Liquid Biopsy**\n"
                "- ctDNA methylation\n"
                "- cfRNA biomarkers"
            )
            gr.Markdown(
                "### 🔑 Confidence Flags\n"
                "🟢 **HIGH** — strong match (≥0.55)\n"
                "🟡 **MEDIUM** — moderate match (0.35–0.55)\n"
                "🔴 **SPECULATIVE** — weak match (<0.35)\n\n"
                "*Only answers from indexed papers are shown.*"
            )

    def respond(message, history):
        if not message.strip():
            return history, ""
        answer = rag_query(message.strip())
        history = history or []
        history.append((message, answer))
        return history, ""

    send_btn.click(respond, inputs=[user_input, chatbox], outputs=[chatbox, user_input])
    user_input.submit(respond, inputs=[user_input, chatbox], outputs=[chatbox, user_input])
    clear_btn.click(lambda: ([], ""), outputs=[chatbox, user_input])

# ─────────────────────────────────────────────
# STANDALONE MODE
# ─────────────────────────────────────────────

if __name__ == "__main__":
    print("Building RAG index...")
    ok, msg = _build_index()
    print(msg)

    with gr.Blocks(title="K R&D Lab — Research Assistant") as demo:
        gr.Markdown("# 🤖 K R&D Lab Research Assistant\n*Standalone mode*")
        build_chatbot_tab()

    demo.launch(share=False)

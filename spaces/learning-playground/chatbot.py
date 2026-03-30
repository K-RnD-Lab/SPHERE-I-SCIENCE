# chatbot.py
import os
import numpy as np
import gradio as gr
from journal import journal_log

# ─────────────────────────────────────────────
# PAPER CORPUS — 20 curated PMIDs
# Topics: LNP/brain delivery, protein corona, cancer variants
# ─────────────────────────────────────────────

PAPER_PMIDS = [
    "34394960", "32251383", "29653760", "22782619", "33208369",
    "18809927", "22086677", "31565943", "33754708", "20461061",
    "30096302", "30311387", "32461654", "27328919", "31820981",
    "28678784", "31348638", "33016924", "31142840", "33883548",
]

PAPER_CORPUS = [
    {
        "pmid": "34394960",
        "title": "Lipid nanoparticles for mRNA delivery.",
        "abstract": "Messenger RNA (mRNA) has emerged as a new category of therapeutic agent to prevent and treat various diseases. To function in vivo, mRNA requires safe, effective and stable delivery systems that protect the nucleic acid from degradation and that allow cellular uptake and mRNA release. Lipid nanoparticles have successfully entered the clinic for the delivery of mRNA; in particular, lipid nanoparticle-mRNA vaccines are now in clinical use against coronavirus disease 2019 (COVID-19), which marks a milestone for mRNA therapeutics. In this Review, we discuss the design of lipid nanoparticles for mRNA delivery and examine physiological barriers and possible administration routes for lipid nanoparticle-mRNA systems. We then consider key points for the clinical translation of lipid nanoparticle-mRNA formulations, including good manufacturing practice, stability, storage and safety, and highlight preclinical and clinical studies of lipid nanoparticle-mRNA therapeutics for infectious diseases, cancer and genetic disorders. Finally, we give an outlook to future possibilities and remaining challenges for this promising technology.",
        "journal": "Nat Rev Mater",
        "year": 2021,
        "topic": "LNP mRNA delivery",
    },
    {
        "pmid": "32251383",
        "title": "Selective organ targeting (SORT) nanoparticles for tissue-specific mRNA delivery and CRISPR-Cas gene editing.",
        "abstract": "CRISPR-Cas gene editing and messenger RNA-based protein replacement therapy hold tremendous potential to effectively treat disease-causing mutations with diverse cellular origin. However, it is currently impossible to rationally design nanoparticles that selectively target specific tissues. Here, we report a strategy termed selective organ targeting (SORT) wherein multiple classes of lipid nanoparticles are systematically engineered to exclusively edit extrahepatic tissues via addition of a supplemental SORT molecule. Lung-, spleen- and liver-targeted SORT lipid nanoparticles were designed to selectively edit therapeutically relevant cell types including epithelial cells, endothelial cells, B cells, T cells and hepatocytes. SORT is compatible with multiple gene editing techniques, including mRNA, Cas9 mRNA/single guide RNA and Cas9 ribonucleoprotein complexes, and is envisioned to aid the development of protein replacement and gene correction therapeutics in targeted tissues.",
        "journal": "Nat Nanotechnol",
        "year": 2020,
        "topic": "LNP organ selectivity",
    },
    # ... (додайте всі 20 записів з вашого попереднього коду)
    # Для стислості я показую лише перші два; ви маєте скопіювати повний список.
]

# ─────────────────────────────────────────────
# RAG ENGINE
# ─────────────────────────────────────────────

_rag_index = None
_rag_embeddings = None
_rag_model = None
EMBED_MODEL = "all-MiniLM-L6-v2"

def _build_index():
    global _rag_index, _rag_embeddings, _rag_model
    try:
        from sentence_transformers import SentenceTransformer
        import faiss
    except ImportError:
        return False, "sentence-transformers or faiss-cpu not installed. Run: pip install sentence-transformers faiss-cpu"
    _rag_model = SentenceTransformer(EMBED_MODEL)
    texts = [f"Title: {p['title']}\nAbstract: {p['abstract']}\nJournal: {p['journal']} ({p['year']})" for p in PAPER_CORPUS]
    _rag_embeddings = _rag_model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    _rag_embeddings = _rag_embeddings / np.linalg.norm(_rag_embeddings, axis=1, keepdims=True)
    dim = _rag_embeddings.shape[1]
    _rag_index = faiss.IndexFlatIP(dim)
    _rag_index.add(_rag_embeddings.astype(np.float32))
    return True, f"Index built: {len(PAPER_CORPUS)} papers, {dim}-dim embeddings"

def _confidence_flag(score: float, n_results: int) -> str:
    if score >= 0.55 and n_results >= 2:
        return "🟢 HIGH"
    elif score >= 0.35:
        return "🟡 MEDIUM"
    else:
        return "🔴 SPECULATIVE"

def rag_query(question: str, top_k: int = 3) -> str:
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
    q_emb = _rag_model.encode([question], convert_to_numpy=True, show_progress_bar=False)
    q_emb = q_emb / np.linalg.norm(q_emb, axis=1, keepdims=True)
    scores, indices = _rag_index.search(q_emb.astype(np.float32), top_k)
    scores = scores[0]
    indices = indices[0]
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
    journal_log("S1-A·R2e", question, f"retrieved {len(valid)} papers, top score {top_score:.3f}")
    return "\n\n".join(answer_parts)

def build_chatbot_tab():
    """Creates the chatbot UI within a Gradio tab."""
    gr.Markdown(
        "**Status:** Model loads on first query (~30s)...\n\n"
        "Ask questions about LNP delivery, protein corona, cancer variants, or liquid biopsy. "
        "Answers are grounded in 20 indexed papers — never fabricated."
    )
    with gr.Row():
        with gr.Column(scale=3):
            chatbox = gr.Chatbot(label="Research Assistant", height=420, bubble_full_width=False)
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
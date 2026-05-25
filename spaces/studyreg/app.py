import gradio as gr
from studyreg import register, search, validate

def register_study(title, repo, tags_str, sphere, domain):
    if not title.strip():
        return "Please enter a study title."
    tags = [t.strip() for t in tags_str.split(",") if t.strip()] if tags_str else []
    study = register(title=title, repo=repo, tags=tags, sphere=sphere, domain=domain)
    valid = validate(study)
    output = f"**Study ID:** {study['id']}\n\n"
    output += f"- Title: {study['title']}\n"
    output += f"- Sphere: {study['sphere']}\n"
    output += f"- Domain: {study['domain']}\n"
    output += f"- Tags: {', '.join(study['tags']) or 'none'}\n"
    output += f"- Status: {study['status']}\n"
    output += f"- Date: {study['date']}\n\n"
    if valid['valid']:
        output += "✅ Study registration is valid"
    else:
        output += "⚠️ Issues:\n" + "\n".join(f"- {w}" for w in valid['warnings'])
    return output

def search_studies(domain, sphere, status):
    results = search(domain=domain or None, sphere=sphere or None, status=status or None)
    if not results:
        return "No studies found matching criteria."
    output = f"**Found {len(results)} study(ies):**\n\n"
    for s in results:
        output += f"- **{s['id']}**: {s['title']} ({s['sphere']}, {s['domain']}) — {s['status']}\n"
    return output

with gr.Blocks(title="studyreg — Study Registry", theme=gr.themes.Base()) as demo:
    gr.Markdown("# Study Registry\nPre-register your computational studies for reproducibility\n[pip install studyreg](https://pypi.org/project/studyreg/) · [Source](https://github.com/K-RnD-Lab/SPHERE-III-TECHNOLOGY)")
    with gr.Tab("Register"):
        r_title = gr.Textbox(label="Study Title", placeholder="e.g. BRCA2 miRNA Oncology Study")
        r_repo = gr.Textbox(label="Repository URL", placeholder="https://github.com/...")
        r_tags = gr.Textbox(label="Tags (comma-separated)", placeholder="oncology, brca2, mirna")
        r_sphere = gr.Dropdown(["S", "E", "T"], value="S", label="SET Sphere")
        r_domain = gr.Dropdown(["biomedical", "ml", "climate", "agriculture", "economics", "other"], value="biomedical", label="Domain")
        r_btn = gr.Button("Register Study", variant="primary")
        r_out = gr.Markdown()
        r_btn.click(register_study, [r_title, r_repo, r_tags, r_sphere, r_domain], r_out)
    with gr.Tab("Search"):
        s_domain = gr.Textbox(label="Domain (optional)")
        s_sphere = gr.Dropdown(["", "S", "E", "T"], value="", label="Sphere (optional)")
        s_status = gr.Dropdown(["", "registered", "completed", "withdrawn"], value="", label="Status (optional)")
        s_btn = gr.Button("Search", variant="primary")
        s_out = gr.Markdown()
        s_btn.click(search_studies, [s_domain, s_sphere, s_status], s_out)

demo.launch()

import gradio as gr
from set_method import classify, score, recommend

PERSONALITIES = ["fighter", "operator", "accomplisher", "leader", "engineer", "developer"]
SPHERES = {"S": "Science", "E": "Entrepreneurship", "T": "Technology"}

def classify_project(text):
    if not text.strip():
        return "Enter a project description above."
    result = classify(text)
    sphere_name = SPHERES.get(result["primary"], result["primary"])
    output = f"**Primary Sphere: {sphere_name}** ({result['primary']})\n\n"
    output += f"| Sphere | Score |\n|---|---|\n"
    for s in ["science", "entrepreneurship", "technology"]:
        bar = "█" * int(result[s] * 10)
        output += f"| {s.title()} | {result[s]:.2f} {bar} |\n"
    return output

def score_project(text, framework):
    if not text.strip():
        return "Enter a project description above."
    s = score(text, framework=framework)
    level = "🟢 High" if s >= 0.6 else "🟡 Medium" if s >= 0.3 else "🔴 Low"
    return f"**Score: {s}** ({level})\nFramework: {framework.upper()}"

def recommend_quests(personality, sphere):
    try:
        quests = recommend(personality, sphere)
        return f"Recommended quests for **{personality}** in **{SPHERES.get(sphere, sphere)}**:\n\n" + "\n".join(f"- {q}" for q in quests)
    except ValueError as e:
        return str(e)

with gr.Blocks(title="set-method — SET Method Toolkit", theme=gr.themes.Base()) as demo:
    gr.Markdown("# SET Method — Classify, Score, Recommend\n[pip install set-method](https://pypi.org/project/set-method/) · [Source](https://github.com/K-RnD-Lab/SPHERE-III-TECHNOLOGY)")
    with gr.Tab("Classify"):
        gr.Markdown("Describe your project to classify it into Science / Entrepreneurship / Technology")
        cls_inp = gr.Textbox(label="Project Description", placeholder="e.g. BRCA2 miRNA analysis with ML pipeline for oncology biomarker discovery", lines=3)
        cls_btn = gr.Button("Classify", variant="primary")
        cls_out = gr.Markdown()
        cls_btn.click(classify_project, cls_inp, cls_out)
    with gr.Tab("Score"):
        gr.Markdown("Score a project against SET or ORBIT framework")
        sc_inp = gr.Textbox(label="Project Description", lines=3)
        sc_fw = gr.Radio(["set", "orbit"], value="set", label="Framework")
        sc_btn = gr.Button("Score", variant="primary")
        sc_out = gr.Markdown()
        sc_btn.click(score_project, [sc_inp, sc_fw], sc_out)
    with gr.Tab("Recommend"):
        gr.Markdown("Get quest recommendations based on personality type and sphere")
        rec_p = gr.Dropdown(PERSONALITIES, label="Personality Type")
        rec_s = gr.Dropdown(["S", "E", "T"], value="S", label="Sphere")
        rec_btn = gr.Button("Recommend", variant="primary")
        rec_out = gr.Markdown()
        rec_btn.click(recommend_quests, [rec_p, rec_s], rec_out)

demo.launch()

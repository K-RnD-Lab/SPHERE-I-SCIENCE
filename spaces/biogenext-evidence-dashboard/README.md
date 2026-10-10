# BioGENext 2026 dashboard

Streamlit dashboard for exploring the transition from biomedical data to clinical decision.

## Run

```bash
cd "stage-two-research/biogenext-dashboard"
python -m pip install -r requirements.txt
streamlit run app.py
```

The interface uses a dark theme with neon mint/blue/violet accents and includes:

- metagenomics study scale;
- mapped / unmapped reads;
- Bakta vs Pannotator runtime benchmark;
- Boltz: tested compounds vs positive results;
- fastLBP and other validation notes;
- Ukraine oncology / UBI Hub roadmap;
- evidence levels and metric limitations.

Data is embedded in `app.py` based on BioGENext 2026 slides and labeled by evidence type. This is a research visualization, not a clinical tool.

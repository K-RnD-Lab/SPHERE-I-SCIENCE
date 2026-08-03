from __future__ import annotations

import streamlit as st


METHODS = {
    "CO2 in air or flue gas": {
        "methods": [
            "Avoid or reduce emissions",
            "Point-source capture with geological storage",
            "Verified mineral carbonation",
            "Direct air capture with durable storage",
        ],
        "note": "Conversion to a short-lived fuel is not durable removal if the carbon is later re-emitted.",
    },
    "Particles and acid gases in air": {
        "methods": [
            "Source substitution and process enclosure",
            "Bag filter or electrostatic precipitation",
            "Compatible scrubber or sorbent system",
            "Exposure control while the source is eliminated",
        ],
        "note": "Captured dust, liquid, filters, and sorbents require a verified residue route.",
    },
    "Nutrients in water": {
        "methods": [
            "Source control",
            "Biological nitrogen removal",
            "Phosphorus precipitation or adsorption",
            "Constructed wetland with monitoring",
        ],
        "note": "Track sludge, greenhouse gases, seasonal performance, and nutrient rebound.",
    },
    "Metals in water": {
        "methods": [
            "Source containment",
            "pH-controlled precipitation",
            "Adsorption or ion exchange",
            "Membrane or reactive-barrier treatment",
        ],
        "note": "Metals do not biodegrade; sludge, brine, and spent media may remain hazardous.",
    },
    "Organic contaminants in water or soil": {
        "methods": [
            "Source removal and containment",
            "Activated-carbon adsorption",
            "Validated bioremediation",
            "Chemical or thermal treatment under professional control",
        ],
        "note": "Measure transformation products and toxicity, not only disappearance of the parent compound.",
    },
    "Metals in soil": {
        "methods": [
            "Excavation and controlled disposal or recovery",
            "Soil washing",
            "Solidification or stabilization",
            "Phytotechnology with biomass controls",
        ],
        "note": "Immobilization lowers mobility but does not remove the element; long-term leaching must be checked.",
    },
}


st.set_page_config(page_title="Digital Treatment Sandbox", layout="wide")
st.title("Digital Treatment Sandbox")
st.caption("Safe first-pass screening for pollution-reduction ideas")

st.warning(
    "This page does not prescribe reagent doses or authorize real-world treatment. "
    "Do not mix chemicals or release test materials into air, soil, drains, or water."
)

problem = st.selectbox("Pollution problem", list(METHODS))
profile = METHODS[problem]

left, right = st.columns([1, 1])
with left:
    st.markdown("**Candidate pathway**")
    for index, method in enumerate(profile["methods"], start=1):
        st.write(f"{index}. {method}")
    st.info(profile["note"])

with right:
    st.markdown("**Scenario mass balance**")
    initial_mass = st.number_input("Initial pollutant mass", min_value=0.0, value=100.0, step=1.0)
    removal_percent = st.slider("Assumed capture or removal (%)", 0, 100, 70)
    residue_percent = st.slider("Secondary residue as % of captured mass", 0, 200, 20)

    captured = initial_mass * removal_percent / 100
    remaining = initial_mass - captured
    secondary_residue = captured * residue_percent / 100

    a, b, c = st.columns(3)
    a.metric("Captured/treated", f"{captured:,.2f}")
    b.metric("Remaining", f"{remaining:,.2f}")
    c.metric("Secondary residue", f"{secondary_residue:,.2f}")

st.markdown("### Decision gates")
gates = {
    "Contaminant identity and concentration are known": st.checkbox("Contaminant identity and concentration are known"),
    "Treatment target and applicable standard are defined": st.checkbox("Treatment target and applicable standard are defined"),
    "Secondary waste has a verified destination": st.checkbox("Secondary waste has a verified destination"),
    "Energy, water, materials, and lifecycle emissions are counted": st.checkbox("Energy, water, materials, and lifecycle emissions are counted"),
    "A qualified laboratory or specialist will validate the scenario": st.checkbox("A qualified laboratory or specialist will validate the scenario"),
}

passed = sum(gates.values())
if passed == len(gates):
    st.success("Ready to draft a controlled validation protocol. This is not yet permission for field use.")
else:
    st.error(f"Screening incomplete: {len(gates) - passed} decision gate(s) remain open.")

st.markdown("### Next digital tools")
st.markdown(
    """
- **EPA CompTox** for chemical identity, toxicity, exposure, and environmental fate.
- **USGS PHREEQC** for aqueous speciation, precipitation, sorption, gas-water, and reactive-transport scenarios.
- **Lifecycle accounting** for energy, consumables, transport, replacement, residue treatment, and CO2e.

The complete research protocol is documented in `S6-D-R2a Pollution Reduction Digital Experiment Roadmap`.
"""
)

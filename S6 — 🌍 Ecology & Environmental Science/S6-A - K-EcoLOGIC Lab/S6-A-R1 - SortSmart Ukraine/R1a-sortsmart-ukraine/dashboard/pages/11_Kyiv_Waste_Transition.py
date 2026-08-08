from __future__ import annotations

import pandas as pd
import streamlit as st


BASELINE = pd.DataFrame(
    [
        {
            "Indicator": "Landfill commissioned",
            "Value": "1986",
            "Evidence year": "2025-2027 plan",
            "Status": "Verified",
        },
        {
            "Indicator": "First phase",
            "Value": "18 ha",
            "Evidence year": "2025-2027 plan",
            "Status": "Official planning figure",
        },
        {
            "Indicator": "Reported annual intake",
            "Value": "~465,000 t/year",
            "Evidence year": "2025-2027 plan",
            "Status": "Estimate, not live feed",
        },
        {
            "Indicator": "Pre-1986 city waste-flow history",
            "Value": "Not reconstructed",
            "Evidence year": "Research gap",
            "Status": "Archive work required",
        },
    ]
)

EU_TARGETS = pd.DataFrame(
    {
        "Year": [2025, 2030, 2035],
        "Preparation for reuse and recycling (%)": [55, 60, 65],
        "Municipal landfill ceiling (%)": [None, None, 10],
    }
)

ROADMAP = pd.DataFrame(
    [
        ("0", "0-6 months", "Open mass balance, composition study, contracts, and landfill audit"),
        ("1", "6-18 months", "Verified source-separation, organics, and hazardous drop-off pilots"),
        ("2", "18-36 months", "Scale material recovery, organics, and screened debris routes"),
        ("3", "3-7 years", "Restrict untreated disposal and complete engineered closure"),
        ("4", "Ongoing", "Publish independently verifiable KPIs and lifecycle costs"),
    ],
    columns=["Phase", "Horizon", "Required outcome"],
)

TRACEABILITY = pd.DataFrame(
    [
        ("Legal identity", "Operator, EDRPOU, site, service territory"),
        ("Authorization", "Permit, waste codes, operations, capacity, validity"),
        ("Collection", "Route, stream, weighed mass, contamination, rejection"),
        ("Treatment", "Input, recovered output, process loss, residual mass"),
        ("Destination", "Named receiver, transfer ticket, accepted mass, operation"),
        ("Finance", "Tariff, gate fee, public payment, material revenue"),
        ("Outcome", "Verified recycling, landfill share, incidents, corrective action"),
    ],
    columns=["Audit layer", "Required evidence"],
)

TENDER_TIMELINE = pd.DataFrame(
    [
        ("23 Jul 2018", "Competition documentation approved", "Verified"),
        ("28 Aug 2018", "Applications opened; UAH 31.5m guarantee", "Verified"),
        ("28 Sep 2018", "Deadline and commission meeting: zero proposals", "Verified"),
        ("15 Nov 2018", "Alternative municipal-private model reported", "Proposal stage"),
    ],
    columns=["Date", "Event", "Evidence status"],
)


st.set_page_config(page_title="Kyiv Waste Transition", layout="wide")
st.title("Kyiv Waste Transition")
st.caption("Landfill No. 5 evidence, EU alignment gaps, and an accountable investment roadmap")

st.warning(
    "This is a planning and accountability tool. Source years differ, figures are not a live "
    "weighbridge feed, and EU dates are alignment benchmarks rather than automatically identical "
    "Ukrainian legal deadlines."
)

baseline_tab, tender_tab, gap_tab, roadmap_tab, traceability_tab, investment_tab = st.tabs(
    ["Verified baseline", "2018 tender", "EU gap", "Roadmap", "Traceability", "Investment rules"]
)

with baseline_tab:
    st.subheader("What we can state responsibly")
    st.dataframe(BASELINE, use_container_width=True, hide_index=True)
    st.info(
        "The 1986 commissioning date is supported by Kyiv city documents. A complete pre-1986 "
        "waste-flow history has not yet been verified and remains an archive research task."
    )

with tender_tab:
    st.subheader("Why the 2018 competition produced no plant")
    metric_left, metric_middle, metric_right = st.columns(3)
    metric_left.metric("Proposals received", "0")
    metric_middle.metric("Bid guarantee", "UAH 31.5m")
    metric_right.metric("Outcome", "Not held")
    st.dataframe(TENDER_TIMELINE, use_container_width=True, hide_index=True)

    st.markdown("**What is documented**")
    st.write(
        "The official commission page records that no participant proposals were received. "
        "A later city-owned newspaper attributed the failure primarily to the absence of a "
        "legally reliable investment-recovery mechanism."
    )
    st.markdown("**What remains an inference**")
    st.write(
        "Revenue, feedstock, land, permitting, technology, currency, and affordability risks "
        "are visible bankability gaps, but the public record does not prove which one caused "
        "each unnamed company to decline. Outreach to foreign companies was not a bid."
    )
    st.warning(
        "The reported EUR 60m Kyivspetstrans alternative was a proposal. No reviewed source "
        "establishes a signed EBRD loan, construction contract, commissioning, or verified "
        "operation of that proposed facility."
    )
    st.markdown(
        "[Read the full documentary post-mortem on GitHub]"
        "(https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE/blob/main/docs/S6/"
        "S6_A_R1D_KYIV_2018_WASTE_TENDER_POSTMORTEM.md)"
    )

with gap_tab:
    st.subheader("EU municipal-waste benchmarks")
    st.dataframe(EU_TARGETS, use_container_width=True, hide_index=True)
    st.bar_chart(
        EU_TARGETS.set_index("Year")[["Preparation for reuse and recycling (%)"]],
        y_label="Percent",
    )
    st.markdown(
        "**Do not merge treatment categories.** Recycling, composting, energy recovery, and "
        "landfill are different outcomes. Energy recovery is not a substitute for prevention "
        "or recycling."
    )

with roadmap_tab:
    st.subheader("Sequence before plant selection")
    st.dataframe(ROADMAP, use_container_width=True, hide_index=True)
    st.code(
        "measure waste -> verify separation routes -> define residual gap\n"
        "-> procure infrastructure -> verify outputs -> fund closure and aftercare",
        language=None,
    )
    st.markdown(
        "**War constraint:** construction and conflict debris requires explosive, asbestos, "
        "chemical, medical, and radiological screening before crushing or recycling."
    )

with traceability_tab:
    st.subheader("Collection is not proof of recycling")
    st.dataframe(TRACEABILITY, use_container_width=True, hide_index=True)
    st.markdown(
        "Kyiv's regional plan lists a `Profpererobka` sorting line in Pidhirtsi. "
        "That corrects the claim that the company is only a transporter, but a facility and "
        "permit still do not prove the recovered share or final material destinations."
    )
    st.info(
        "Use neutral evidence labels: service claim -> permit verified -> transfer verified "
        "-> recycling verified -> full system mass balance verified."
    )
    st.markdown("**Budget audit rule**")
    st.write(
        "Reconcile appropriation, procurement, payment, physical output, and environmental KPI. "
        "Missing delivery is a documented gap; corruption requires separate transaction, audit, "
        "investigative, or court evidence."
    )

with investment_tab:
    st.subheader("Can the city force investors to build?")
    st.write(
        "Not arbitrarily. Public authorities can make pollution legally and financially costly "
        "and make verified treatment investable through enforceable service contracts."
    )
    left, right = st.columns(2)
    with left:
        st.markdown("**Public obligations**")
        st.markdown(
            """
- full-cost landfill pricing
- permits, acceptance rules, and financial guarantees
- separate collection and destination traceability
- producer responsibility when sector law is operational
- transparent tenders and performance bonds
"""
        )
    with right:
        st.markdown("**Bankability conditions**")
        st.markdown(
            """
- reliable composition and tonnage data
- land, permits, utilities, and environmental assessment
- indexed revenue and affordability mechanism
- feedstock quality rather than guaranteed mixed waste
- independent output verification and open contracts
"""
        )

    st.error(
        "A plant is not success by itself. Success is verified prevention, reuse, recycling, "
        "organics treatment, safe residual management, and funded landfill aftercare."
    )

st.markdown("### Primary sources")
st.markdown(
    """
- [Kyiv 2025-2027 strategic environmental assessment](https://minio.kyivcity.gov.ua/kyivcity/sites/22/strategy/5.%20%D0%97%D0%B2%D1%96%D1%82%20%D0%A1%D0%95%D0%9E%20%D0%9F%D0%BB%D0%B0%D0%BD%D1%83%20%D0%B7%D0%B0%D1%85%D0%BE%D0%B4%D1%96%D0%B2%20%D0%BD%D0%B0%202025-2027.pdf)
- [Law of Ukraine On Waste Management](https://zakon.rada.gov.ua/laws/show/2320-20#Text)
- [National Waste Management Plan to 2033](https://www.kmu.gov.ua/storage/app/uploads/public/678/e56/9d5/678e569d56910563311352.pdf)
- [Kyiv regional waste-management plan, volume 2](https://minio.kyivcity.gov.ua/kyivcity/sites/27/uploaded-files/%20%D0%9A%D0%B8%D1%97%D0%B2%202025%20%D0%A2%D0%BE%D0%BC%202%2031-07-2025.pdf)
- [Kyiv environmental-programme indicator report for 2025](https://minio.kyivcity.gov.ua/kyivcity/sites/32/uploaded-files/ilovepdfmerged-4.pdf)
- [Kyivkomunservis 2018 competition document hub](https://kks.kyiv.ua/st_konkurs-z-vyznachennya-vykonavtsya-posluh-z-pereroblennya-obroblennya-ta-zahoronennya-pobutovyh-vidhodiv-scho-utvoryuyutsya-na-terytoriji-mista-kyeva/)
- [Official commission result: no proposals received](https://kks.kyiv.ua/zasidannya-konkursnoji-komisiji-z-vyznachennya-vykonavtsya-posluh-z-pereroblennya-obroblennya-ta-zahoronennya-pobutovyh-vidhodiv-scho-utvoryuyutsya-na-terytoriji-mista-kyjeva-vid-28-09-2018/)
- [EU Waste Framework Directive targets](https://environment.ec.europa.eu/news/waste-framework-directive-revision-2022-02-14_en)
- [EU Landfill Directive](https://eur-lex.europa.eu/legal-content/en/ALL/?uri=CELEX%3A01999L0031-20240804)
"""
)

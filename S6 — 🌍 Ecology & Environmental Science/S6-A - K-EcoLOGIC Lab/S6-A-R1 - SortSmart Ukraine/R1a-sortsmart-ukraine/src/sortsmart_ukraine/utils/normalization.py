from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import Iterable

import pandas as pd


@dataclass(frozen=True)
class Oblast:
    key: str
    name_uk: str
    name_en: str
    patterns: tuple[str, ...]


OBLASTS: tuple[Oblast, ...] = (
    Oblast("vinnytsia", "Vinnytska oblast", "Vinnytsia Oblast", ("vinnyts", "вінниць", "винниц")),
    Oblast("volyn", "Volynska oblast", "Volyn Oblast", ("volyn", "волин")),
    Oblast("dnipropetrovsk", "Dnipropetrovska oblast", "Dnipropetrovsk Oblast", ("dnipropetrov", "дніпропетров", "днепропетров")),
    Oblast("donetsk", "Donetska oblast", "Donetsk Oblast", ("donetsk", "донець", "донец")),
    Oblast("zhytomyr", "Zhytomyrska oblast", "Zhytomyr Oblast", ("zhytomyr", "житомир")),
    Oblast("zakarpattia", "Zakarpatska oblast", "Zakarpattia Oblast", ("zakarp", "закарпат")),
    Oblast("zaporizhzhia", "Zaporizka oblast", "Zaporizhzhia Oblast", ("zaporiz", "запоріз", "запорож")),
    Oblast("ivano_frankivsk", "Ivano-Frankivska oblast", "Ivano-Frankivsk Oblast", ("ivano", "франків", "франков")),
    Oblast("kyiv_oblast", "Kyivska oblast", "Kyiv Oblast", ("kyivska", "київська", "киевская", "kyiv oblast", "kiev oblast")),
    Oblast("kirovohrad", "Kirovohradska oblast", "Kirovohrad Oblast", ("kirovo", "кіровоград", "кропивниць")),
    Oblast("luhansk", "Luhanska oblast", "Luhansk Oblast", ("luhansk", "луган")),
    Oblast("lviv", "Lvivska oblast", "Lviv Oblast", ("lviv", "львів", "львов")),
    Oblast("mykolaiv", "Mykolaivska oblast", "Mykolaiv Oblast", ("mykola", "микола", "никола")),
    Oblast("odesa", "Odeska oblast", "Odesa Oblast", ("odes", "одес")),
    Oblast("poltava", "Poltavska oblast", "Poltava Oblast", ("poltav", "полтав")),
    Oblast("rivne", "Rivnenska oblast", "Rivne Oblast", ("rivn", "рівнен", "ровен")),
    Oblast("sumy", "Sumska oblast", "Sumy Oblast", ("sumsk", "сум")),
    Oblast("ternopil", "Ternopilska oblast", "Ternopil Oblast", ("ternop", "терноп")),
    Oblast("kharkiv", "Kharkivska oblast", "Kharkiv Oblast", ("khark", "харків", "харьков")),
    Oblast("kherson", "Khersonska oblast", "Kherson Oblast", ("kherson", "херсон")),
    Oblast("khmelnytskyi", "Khmelnytska oblast", "Khmelnytskyi Oblast", ("khmel", "хмельни")),
    Oblast("cherkasy", "Cherkaska oblast", "Cherkasy Oblast", ("cherkas", "черкас")),
    Oblast("chernivtsi", "Chernivetska oblast", "Chernivtsi Oblast", ("cherniv", "чернів", "чернов")),
    Oblast("chernihiv", "Chernihivska oblast", "Chernihiv Oblast", ("chernih", "черніг", "черниг")),
    Oblast("kyiv_city", "m. Kyiv", "Kyiv City", ("m kyiv", "kyiv city", "місто київ", "м київ", "київ")),
)


def normalize_text(value: object) -> str:
    if value is None:
        return ""
    text = str(value).strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("’", "'").replace("`", "'")
    text = re.sub(r"[\s_/,-]+", " ", text)
    return text.strip()


def match_oblast(value: object) -> str | None:
    text = normalize_text(value)
    if not text:
        return None
    for oblast in OBLASTS:
        if any(pattern in text for pattern in oblast.patterns):
            return oblast.key
    return None


def oblast_reference_frame() -> pd.DataFrame:
    return pd.DataFrame(
        [{"region_key": oblast.key, "oblast_name_uk": oblast.name_uk, "oblast_name_en": oblast.name_en} for oblast in OBLASTS]
    )


def best_region_column(df: pd.DataFrame, candidates: Iterable[str]) -> str | None:
    best_name = None
    best_score = 0.0
    for column in candidates:
        series = df[column].astype(str)
        score = series.map(match_oblast).notna().mean()
        if score > best_score:
            best_score = score
            best_name = column
    return best_name

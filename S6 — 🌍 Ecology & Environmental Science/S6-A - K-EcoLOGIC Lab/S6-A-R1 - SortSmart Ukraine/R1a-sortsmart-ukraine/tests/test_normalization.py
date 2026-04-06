from sortsmart_ukraine.utils.normalization import match_oblast


def test_match_oblast_english() -> None:
    assert match_oblast("Lvivska oblast") == "lviv"


def test_match_oblast_transliterated_city() -> None:
    assert match_oblast("Vinnytsia Oblast") == "vinnytsia"


def test_match_kyiv_city() -> None:
    assert match_oblast("Kyiv City") == "kyiv_city"

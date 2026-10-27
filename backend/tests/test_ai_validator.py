import math

from app.services.ai_validator import AIExtractionValidator


SOURCE = (
    "This study measured water quality in the river. Lead concentration "
    "increased downstream from the industrial site."
)


def test_accepts_literal_quote_and_requires_human_review():
    result = AIExtractionValidator.validate_extraction(
        extracted_text="Lead concentration increased downstream.",
        original_text=SOURCE,
        ai_confidence=0.8,
        literal_quote="Lead concentration   increased downstream from the industrial site.",
    )

    assert result["is_valid"] is True
    assert result["has_literal_quote"] is True
    assert result["requires_human_review"] is True


def test_rejects_nonmatching_or_too_short_quote():
    result = AIExtractionValidator.validate_extraction(
        extracted_text="Lead concentration increased.",
        original_text=SOURCE,
        literal_quote="Lead concentration increased.",
    )

    assert result["is_valid"] is False
    assert result["has_literal_quote"] is False


def test_rejects_quote_matching_only_inside_a_word():
    result = AIExtractionValidator.validate_extraction(
        extracted_text="art of river ecosystems can change over time",
        original_text="The cart of river ecosystems can change over time.",
        literal_quote="art of river ecosystems can change over time",
    )

    assert result["is_valid"] is False
    assert result["has_literal_quote"] is False


def test_rejects_numbers_not_present_in_source():
    result = AIExtractionValidator.validate_extraction(
        extracted_text="Lead concentration reached 12 mg/L.",
        original_text=SOURCE,
        literal_quote="Lead concentration increased downstream from the industrial site.",
    )

    assert result["is_valid"] is False
    assert any("numeric values" in warning for warning in result["warnings"])


def test_rejects_non_finite_confidence():
    result = AIExtractionValidator.validate_extraction(
        extracted_text="Lead concentration increased downstream.",
        original_text=SOURCE,
        ai_confidence=math.nan,
        literal_quote="Lead concentration increased downstream from the industrial site.",
    )

    assert result["is_valid"] is False
    assert any("finite value" in warning for warning in result["warnings"])

"""Strict source-grounding checks for AI-extracted evidence."""

import math
import re
from typing import Any


class AIExtractionValidator:
    """Checks that an extraction is grounded in a literal source passage."""

    @staticmethod
    def validate_extraction(
        extracted_text: str,
        original_text: str,
        ai_confidence: float | None = None,
        literal_quote: str | None = None,
    ) -> dict[str, Any]:
        """Validate source correspondence, not the semantic truth of a claim."""
        warnings: list[str] = []
        extracted = AIExtractionValidator._normalize(extracted_text)
        original = AIExtractionValidator._normalize(original_text)
        quote = (
            literal_quote
            if literal_quote is not None
            else AIExtractionValidator._find_literal_quote(extracted_text, original_text)
        ) or ""
        normalized_quote = AIExtractionValidator._normalize(quote)

        has_literal_quote = (
            len(normalized_quote) >= 20
            and len(normalized_quote.split()) >= 5
            and bool(original)
            and AIExtractionValidator._contains_exact_phrase(
                normalized_quote, original
            )
        )
        hard_failures = False

        if not extracted:
            warnings.append("Extracted claim is empty")
            hard_failures = True
        if not original:
            warnings.append("Source text is empty")
            hard_failures = True
        if not has_literal_quote:
            warnings.append("A quote of at least five words must match the source exactly")
            hard_failures = True

        unsupported_numbers = AIExtractionValidator._unsupported_numbers(
            extracted_text, quote
        )
        if unsupported_numbers:
            warnings.append(
                "Claim contains numeric values absent from the source: "
                + ", ".join(sorted(unsupported_numbers))
            )
            hard_failures = True

        if ai_confidence is not None and (
            not isinstance(ai_confidence, (int, float))
            or isinstance(ai_confidence, bool)
            or not math.isfinite(ai_confidence)
            or not 0 <= ai_confidence <= 1
        ):
            warnings.append("AI confidence must be a finite value between 0 and 1")
            hard_failures = True
        elif ai_confidence is not None and ai_confidence < 0.5:
            warnings.append(f"Low AI confidence: {ai_confidence:.2f}")

        quote_match_ratio = (
            1.0 if has_literal_quote else
            AIExtractionValidator._token_overlap(quote, original_text)
        )
        quality_score = max(
            0.0,
            min(1.0, quote_match_ratio - (0.2 if unsupported_numbers else 0.0)),
        )

        return {
            "is_valid": not hard_failures,
            "quality_score": quality_score,
            "has_literal_quote": has_literal_quote,
            "quote_match_ratio": quote_match_ratio,
            "literal_quote": quote if has_literal_quote else None,
            "warnings": warnings,
            # Literal matching cannot verify that a paraphrase is entailed.
            "requires_human_review": True,
        }

    @staticmethod
    def _normalize(text: str) -> str:
        return re.sub(r"\s+", " ", text).strip().casefold()

    @staticmethod
    def _contains_exact_phrase(phrase: str, source: str) -> bool:
        return re.search(
            rf"(?<!\w){re.escape(phrase)}(?!\w)", source, flags=re.UNICODE
        ) is not None

    @staticmethod
    def _unsupported_numbers(claim: str, source: str) -> set[str]:
        claim_numbers = set(re.findall(r"\b\d+(?:[.,]\d+)?%?\b", claim))
        source_numbers = set(re.findall(r"\b\d+(?:[.,]\d+)?%?\b", source))
        return claim_numbers - source_numbers

    @staticmethod
    def _token_overlap(text: str, source: str) -> float:
        tokens = set(re.findall(r"\w+", AIExtractionValidator._normalize(text)))
        source_tokens = set(re.findall(r"\w+", AIExtractionValidator._normalize(source)))
        return len(tokens & source_tokens) / len(tokens) if tokens else 0.0

    @staticmethod
    def _find_literal_quote(extracted: str, original: str) -> str | None:
        """Find the longest extracted word sequence that appears in the source."""
        extracted_words = extracted.split()
        normalized_source = AIExtractionValidator._normalize(original)
        for start in range(len(extracted_words)):
            for end in range(len(extracted_words), start + 4, -1):
                candidate = " ".join(extracted_words[start:end])
                if AIExtractionValidator._contains_exact_phrase(
                    AIExtractionValidator._normalize(candidate), normalized_source
                ):
                    return candidate
        return None

    @staticmethod
    def format_validation_warning(validation_result: dict[str, Any]) -> str:
        if not validation_result["is_valid"]:
            return (
                "Extração não validada; revisão humana obrigatória. "
                f"Avisos: {', '.join(validation_result['warnings'])}"
            )
        return (
            "Trecho literal confirmado; a relação entre trecho e afirmação "
            "ainda exige revisão humana."
        )

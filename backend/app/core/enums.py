from enum import Enum


class CaseStatus(str, Enum):
    DRAFT = "draft"
    INVESTIGATING = "investigating"
    COMPLETE = "complete"
    ARCHIVED = "archived"


class EvidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    UNKNOWN = "unknown"


class EvidenceSourceType(str, Enum):
    ARTICLE = "article"
    DATA = "data"
    PATENT = "patent"
    STUDY = "study"
    REPORT = "report"


class HypothesisStatus(str, Enum):
    HYPOTHESIS = "hypothesis"
    SUGGESTION = "suggestion"
    OBSERVATION = "observation"
    TESTED = "tested"
    CONFIRMED = "confirmed"
    REFUTED = "refuted"


class MaterialCategory(str, Enum):
    ORGANIC = "organic"
    INORGANIC = "inorganic"
    BIOMASS = "biomass"
    MINERAL = "mineral"
    SYNTHETIC = "synthetic"
    OTHER = "other"


class MaterialAvailability(str, Enum):
    ABUNDANT = "abundant"
    LIMITED = "limited"
    SCARCE = "scarce"
    UNKNOWN = "unknown"

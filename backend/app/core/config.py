from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Estes"
    app_env: str = "development"
    app_debug: bool = True
    secret_key: str = "troque"
    api_v1_prefix: str = "/api/v1"
    sql_echo: bool = False

    database_url: str = (
        "postgresql+asyncpg://estes:estes@localhost:5434/estes"
    )
    database_url_sync: str = (
        "postgresql://estes:estes@localhost:5434/estes"
    )

    redis_url: str = "redis://localhost:6380/0"

    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    groq_model_fast: str = "llama-3.1-8b-instant"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash-exp"
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:1b"

    tavily_api_key: str = ""
    firms_api_key: str = ""

    embedding_model: str = "nomic-embed-text"
    embedding_dim: int = 768

    access_token_expire_minutes: int = 10080
    algorithm: str = "HS256"

    ia_rate_limit: str = "20/minute"

    @field_validator("secret_key")
    @classmethod
    def secret_key_nao_vazio(cls, v: str) -> str:
        if not v or v == "troque":
            raise ValueError(
                "SECRET_KEY invalido. Defina uma chave forte em producao."
            )
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

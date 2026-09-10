import os
from typing import List, Union
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MyTrip Platform"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "sqlite:///./mytrip.db"

    # JWT
    JWT_SECRET: str = "mytrip-super-secret-jwt-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # LLM
    LLM_PROVIDER: str = "demo"  # "gemini", "openai", or "demo"
    MODEL_NAME: str = "gemini-2.5-flash"
    GOOGLE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    SEARCH_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

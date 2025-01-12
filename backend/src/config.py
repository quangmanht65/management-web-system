from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    USE_CREDENTIALS: bool= True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

Config = Settings()

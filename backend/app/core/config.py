import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    IBM_WATSONX_API_KEY: str = os.getenv("IBM_WATSONX_API_KEY", "")
    IBM_WATSONX_REGION_URL: str = os.getenv("IBM_WATSONX_REGION_URL", "https://us-south.ml.cloud.ibm.com")
    IBM_WATSONX_PROJECT_ID: str = os.getenv("IBM_WATSONX_PROJECT_ID", "")
    IBM_WATSONX_SPACE_ID: str = os.getenv("IBM_WATSONX_SPACE_ID", "")

    MODEL_GRANITE_INSTRUCT: str = os.getenv("MODEL_GRANITE_INSTRUCT", "ibm/granite-4-h-small")
    MODEL_GRANITE_GUARDIAN: str = os.getenv("MODEL_GRANITE_GUARDIAN", "ibm/granite-guardian-3-8b")
    MODEL_GRANITE_VISION: str = os.getenv("MODEL_GRANITE_VISION", "ibm/granite-4.0-3b-vision")
    MODEL_GRANITE_EMBEDDING: str = os.getenv("MODEL_GRANITE_EMBEDDING", "ibm/granite-embedding-107m-multilingual")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Shared thresholds used by both the AI ensemble and Member 4 safety policy.
    MEDIUM_RISK_THRESHOLD: int = 40
    HIGH_RISK_THRESHOLD: int = 70
    ALLOW_REMOTE_URL_FETCH: bool = os.getenv("ALLOW_REMOTE_URL_FETCH", "false").lower() == "true"
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")

    @property
    def cors_origins(self):
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

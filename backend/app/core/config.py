from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "College Management System"
    DATABASE_URL: str = "postgresql://postgres:1432@localhost:5432/college_db"
    DATABASE_NAME: str = "college_db"
    SECRET_KEY: str = "mysecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings()

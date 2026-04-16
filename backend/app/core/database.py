from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

from sqlalchemy.orm import declarative_base #attendance 
Base = declarative_base() #attendance

engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 🔹 ye FastAPI me use hoga
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
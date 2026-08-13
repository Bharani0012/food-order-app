# Database engine/session setup
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# SQLite (used in tests) needs this flag since FastAPI can touch a session
# from a different thread than the one that created it
connect_args = (
    {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# FastAPI dependency that provides a DB session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

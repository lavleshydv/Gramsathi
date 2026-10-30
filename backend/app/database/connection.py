"""SQLAlchemy Async & Sync Engine & Session Connection Manager."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.database.models import Base

# Fetch DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gramsathi.db")

# Setup synchronous engine (compatible with SQLite & PostgreSQL)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Create all relational tables defined in SQLAlchemy schema."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


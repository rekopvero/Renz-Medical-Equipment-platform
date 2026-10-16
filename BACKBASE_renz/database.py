from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# URLADDRESS of postgresql

DATABASE_URL = "postgresql+psycopg2://postgres:fjune1444@localhost:14444/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
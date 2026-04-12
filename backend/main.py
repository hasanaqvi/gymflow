from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect as sa_inspect, text
from database import engine, Base
from routers import exercises, sessions, sets, recommend

Base.metadata.create_all(bind=engine)

# Add any new columns that don't exist yet (safe for existing data)
def _migrate():
    inspector = sa_inspect(engine)
    existing = {col["name"] for col in inspector.get_columns("sets")}
    with engine.connect() as conn:
        if "rpe" not in existing:
            conn.execute(text("ALTER TABLE sets ADD COLUMN rpe TEXT"))
            conn.commit()

_migrate()

app = FastAPI(title="GymFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exercises.router)
app.include_router(sessions.router)
app.include_router(sets.router)
app.include_router(recommend.router)

@app.get("/")
def root():
    return {"message": "GymFlow API is running"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import exercises, sessions, sets, recommend

Base.metadata.create_all(bind=engine)

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
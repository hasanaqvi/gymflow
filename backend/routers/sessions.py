from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import models, schemas
from database import get_db

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.get("/", response_model=List[schemas.SessionResponse])
def get_sessions(db: Session = Depends(get_db)):
    return db.query(models.Session).options(
        joinedload(models.Session.session_exercises)
        .joinedload(models.SessionExercise.exercise),
        joinedload(models.Session.session_exercises)
        .joinedload(models.SessionExercise.sets)
    ).order_by(models.Session.date.desc()).all()

@router.get("/{session_id}", response_model=schemas.SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(models.Session).options(
        joinedload(models.Session.session_exercises)
        .joinedload(models.SessionExercise.exercise),
        joinedload(models.Session.session_exercises)
        .joinedload(models.SessionExercise.sets)
    ).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/", response_model=schemas.SessionResponse)
def create_session(session: schemas.SessionCreate, db: Session = Depends(get_db)):
    db_session = models.Session(**session.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.post("/{session_id}/exercises", response_model=schemas.SessionExerciseResponse)
def add_exercise_to_session(
    session_id: int,
    session_exercise: schemas.SessionExerciseCreate,
    db: Session = Depends(get_db)
):
    db_se = models.SessionExercise(
        session_id=session_id,
        exercise_id=session_exercise.exercise_id,
        order_index=session_exercise.order_index,
        phase=session_exercise.phase
    )
    db.add(db_se)
    db.commit()
    db.refresh(db_se)
    return db.query(models.SessionExercise).options(
        joinedload(models.SessionExercise.exercise),
        joinedload(models.SessionExercise.sets)
    ).filter(models.SessionExercise.id == db_se.id).first()

@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"message": "Session deleted"}
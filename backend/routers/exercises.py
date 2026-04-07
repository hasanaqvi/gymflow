from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter(prefix="/exercises", tags=["exercises"])

@router.get("/", response_model=List[schemas.ExerciseResponse])
def get_exercises(db: Session = Depends(get_db)):
    return db.query(models.Exercise).all()

@router.get("/{exercise_id}", response_model=schemas.ExerciseResponse)
def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    return db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()

@router.post("/", response_model=schemas.ExerciseResponse)
def create_exercise(exercise: schemas.ExerciseCreate, db: Session = Depends(get_db)):
    db_exercise = models.Exercise(**exercise.model_dump())
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    return db_exercise
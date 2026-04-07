from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import models, schemas
from database import get_db

router = APIRouter(prefix="/recommend", tags=["recommend"])

@router.get("/", response_model=schemas.RecommendationResponse)
def get_recommendation(db: Session = Depends(get_db)):
    sessions = db.query(models.Session).order_by(
        models.Session.date.desc()
    ).limit(10).all()

    if not sessions:
        recommended_focus = "Upper"
        reason = "No sessions logged yet — starting with Upper body."
    else:
        last_focus = sessions[0].focus
        if last_focus == "Upper":
            recommended_focus = "Lower"
            reason = "Your last session was Upper body — time for Lower."
        elif last_focus == "Lower":
            recommended_focus = "Upper"
            reason = "Your last session was Lower body — time for Upper."
        else:
            recommended_focus = "Upper"
            reason = "Starting fresh with Upper body."

    recent_exercise_ids = set()
    cutoff = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    for session in sessions:
        if session.date >= cutoff:
            for se in session.session_exercises:
                recent_exercise_ids.add(se.exercise_id)

    all_exercises = db.query(models.Exercise).filter(
        models.Exercise.category == recommended_focus
    ).all()

    fresh_exercises = [
        ex for ex in all_exercises
        if ex.id not in recent_exercise_ids
    ]

    suggested = fresh_exercises if fresh_exercises else all_exercises

    suggested.sort(key=lambda ex: ex.muscle_group)

    return schemas.RecommendationResponse(
        recommended_focus=recommended_focus,
        reason=reason,
        suggested_exercises=suggested[:12]
    )
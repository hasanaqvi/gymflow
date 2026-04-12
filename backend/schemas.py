from pydantic import BaseModel
from typing import Optional, List

class ExerciseBase(BaseModel):
    name: str
    category: str
    muscle_group: str
    session_type: str
    description: Optional[str] = ""

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseResponse(ExerciseBase):
    id: int

    class Config:
        from_attributes = True


class SetBase(BaseModel):
    reps: Optional[int] = 0
    weight_kg: Optional[float] = 0.0
    duration_secs: Optional[int] = 0
    notes: Optional[str] = ""
    rpe: Optional[str] = None

class SetCreate(SetBase):
    session_exercise_id: int

class SetResponse(SetBase):
    id: int
    session_exercise_id: int

    class Config:
        from_attributes = True


class SessionExerciseBase(BaseModel):
    exercise_id: int
    order_index: Optional[int] = 0
    phase: str

class SessionExerciseCreate(SessionExerciseBase):
    session_id: int

class SessionExerciseResponse(SessionExerciseBase):
    id: int
    session_id: int
    exercise: ExerciseResponse
    sets: List[SetResponse] = []

    class Config:
        from_attributes = True


class SessionBase(BaseModel):
    date: str
    focus: str
    energy_level: Optional[int] = 3
    notes: Optional[str] = ""
    duration_mins: Optional[int] = 0

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    session_exercises: List[SessionExerciseResponse] = []

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    recommended_focus: str
    reason: str
    suggested_exercises: List[ExerciseResponse]
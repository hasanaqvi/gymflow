from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    muscle_group = Column(String, nullable=False)
    session_type = Column(String, nullable=False)
    description = Column(Text, default="")

    session_exercises = relationship("SessionExercise", back_populates="exercise")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    focus = Column(String, nullable=False)
    energy_level = Column(Integer, default=3)
    notes = Column(Text, default="")
    duration_mins = Column(Integer, default=0)

    session_exercises = relationship("SessionExercise", back_populates="session")


class SessionExercise(Base):
    __tablename__ = "session_exercises"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    order_index = Column(Integer, default=0)
    phase = Column(String, nullable=False)

    session = relationship("Session", back_populates="session_exercises")
    exercise = relationship("Exercise", back_populates="session_exercises")
    sets = relationship("Set", back_populates="session_exercise")


class Set(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True)
    session_exercise_id = Column(Integer, ForeignKey("session_exercises.id"), nullable=False)
    reps = Column(Integer, default=0)
    weight_kg = Column(Float, default=0.0)
    duration_secs = Column(Integer, default=0)
    notes = Column(Text, default="")
    rpe = Column(String, nullable=True)

    session_exercise = relationship("SessionExercise", back_populates="sets")
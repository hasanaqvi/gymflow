from database import SessionLocal, engine, Base
from models import Exercise

Base.metadata.create_all(bind=engine)

exercises = [
    # Upper — Chest
    {"name": "Barbell bench press", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},
    {"name": "Incline barbell bench press", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},
    {"name": "Dumbbell bench press", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},
    {"name": "Incline dumbbell bench press", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},
    {"name": "Cable chest fly", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},
    {"name": "Dumbbell chest fly", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},
    {"name": "Push ups", "category": "Upper", "muscle_group": "Chest", "session_type": "Main"},

    # Upper — Back
    {"name": "Pull ups", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},
    {"name": "Lat pulldown", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},
    {"name": "Barbell row", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},
    {"name": "Dumbbell row", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},
    {"name": "Cable row", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},
    {"name": "Face pulls", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},
    {"name": "Deadlift", "category": "Upper", "muscle_group": "Back", "session_type": "Main"},

    # Upper — Shoulders
    {"name": "Overhead barbell press", "category": "Upper", "muscle_group": "Shoulders", "session_type": "Main"},
    {"name": "Dumbbell shoulder press", "category": "Upper", "muscle_group": "Shoulders", "session_type": "Main"},
    {"name": "Lateral raises", "category": "Upper", "muscle_group": "Shoulders", "session_type": "Main"},
    {"name": "Front raises", "category": "Upper", "muscle_group": "Shoulders", "session_type": "Main"},
    {"name": "Rear delt fly", "category": "Upper", "muscle_group": "Shoulders", "session_type": "Main"},
    {"name": "Arnold press", "category": "Upper", "muscle_group": "Shoulders", "session_type": "Main"},

    # Upper — Biceps
    {"name": "Barbell curl", "category": "Upper", "muscle_group": "Biceps", "session_type": "Main"},
    {"name": "Dumbbell curl", "category": "Upper", "muscle_group": "Biceps", "session_type": "Main"},
    {"name": "Hammer curl", "category": "Upper", "muscle_group": "Biceps", "session_type": "Main"},
    {"name": "Incline dumbbell curl", "category": "Upper", "muscle_group": "Biceps", "session_type": "Main"},
    {"name": "Cable curl", "category": "Upper", "muscle_group": "Biceps", "session_type": "Main"},
    {"name": "Preacher curl", "category": "Upper", "muscle_group": "Biceps", "session_type": "Main"},

    # Upper — Triceps
    {"name": "Tricep pushdown", "category": "Upper", "muscle_group": "Triceps", "session_type": "Main"},
    {"name": "Skull crushers", "category": "Upper", "muscle_group": "Triceps", "session_type": "Main"},
    {"name": "Overhead tricep extension", "category": "Upper", "muscle_group": "Triceps", "session_type": "Main"},
    {"name": "Close grip bench press", "category": "Upper", "muscle_group": "Triceps", "session_type": "Main"},
    {"name": "Dips", "category": "Upper", "muscle_group": "Triceps", "session_type": "Main"},

    # Upper — Core
    {"name": "Plank", "category": "Upper", "muscle_group": "Core", "session_type": "Main"},
    {"name": "Cable crunch", "category": "Upper", "muscle_group": "Core", "session_type": "Main"},
    {"name": "Hanging leg raise", "category": "Upper", "muscle_group": "Core", "session_type": "Main"},
    {"name": "Ab wheel rollout", "category": "Upper", "muscle_group": "Core", "session_type": "Main"},

    # Lower — Quads
    {"name": "Barbell back squat", "category": "Lower", "muscle_group": "Quads", "session_type": "Main"},
    {"name": "Front squat", "category": "Lower", "muscle_group": "Quads", "session_type": "Main"},
    {"name": "Leg press", "category": "Lower", "muscle_group": "Quads", "session_type": "Main"},
    {"name": "Hack squat", "category": "Lower", "muscle_group": "Quads", "session_type": "Main"},
    {"name": "Leg extension", "category": "Lower", "muscle_group": "Quads", "session_type": "Main"},
    {"name": "Bulgarian split squat", "category": "Lower", "muscle_group": "Quads", "session_type": "Main"},

    # Lower — Hamstrings
    {"name": "Romanian deadlift", "category": "Lower", "muscle_group": "Hamstrings", "session_type": "Main"},
    {"name": "Leg curl lying", "category": "Lower", "muscle_group": "Hamstrings", "session_type": "Main"},
    {"name": "Leg curl seated", "category": "Lower", "muscle_group": "Hamstrings", "session_type": "Main"},
    {"name": "Stiff leg deadlift", "category": "Lower", "muscle_group": "Hamstrings", "session_type": "Main"},
    {"name": "Nordic curl", "category": "Lower", "muscle_group": "Hamstrings", "session_type": "Main"},

    # Lower — Glutes
    {"name": "Hip thrust", "category": "Lower", "muscle_group": "Glutes", "session_type": "Main"},
    {"name": "Cable kickback", "category": "Lower", "muscle_group": "Glutes", "session_type": "Main"},
    {"name": "Glute bridge", "category": "Lower", "muscle_group": "Glutes", "session_type": "Main"},
    {"name": "Step ups", "category": "Lower", "muscle_group": "Glutes", "session_type": "Main"},

    # Lower — Calves
    {"name": "Standing calf raise", "category": "Lower", "muscle_group": "Calves", "session_type": "Main"},
    {"name": "Seated calf raise", "category": "Lower", "muscle_group": "Calves", "session_type": "Main"},
    {"name": "Leg press calf raise", "category": "Lower", "muscle_group": "Calves", "session_type": "Main"},

    # Lower — Adductors / Abductors
    {"name": "Hip abduction machine", "category": "Lower", "muscle_group": "Adductors", "session_type": "Main"},
    {"name": "Hip adduction machine", "category": "Lower", "muscle_group": "Adductors", "session_type": "Main"},
    {"name": "Sumo squat", "category": "Lower", "muscle_group": "Adductors", "session_type": "Main"},

    # Cardio
    {"name": "Rowing machine", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Treadmill walking", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Treadmill running", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Stationary bike steady state", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Stationary bike intervals", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Stair climber", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Elliptical", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Jump rope steady", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Jump rope intervals", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Burpees", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Box jumps", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Battle ropes", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},
    {"name": "Pull ups cardio finisher", "category": "Cardio", "muscle_group": "Full body", "session_type": "Cardio"},

    # Warm up
    {"name": "Dynamic warm up", "category": "Warmup", "muscle_group": "Full body", "session_type": "Warmup"},
    {"name": "Foam rolling", "category": "Warmup", "muscle_group": "Full body", "session_type": "Warmup"},
    {"name": "Light cardio warm up", "category": "Warmup", "muscle_group": "Full body", "session_type": "Warmup"},
    {"name": "Band pull aparts", "category": "Warmup", "muscle_group": "Shoulders", "session_type": "Warmup"},
    {"name": "Hip circles", "category": "Warmup", "muscle_group": "Hips", "session_type": "Warmup"},
    {"name": "Leg swings", "category": "Warmup", "muscle_group": "Hips", "session_type": "Warmup"},

    # Cooldown
    {"name": "Cooldown stretching", "category": "Cooldown", "muscle_group": "Full body", "session_type": "Cooldown"},
    {"name": "Static stretching", "category": "Cooldown", "muscle_group": "Full body", "session_type": "Cooldown"},
    {"name": "Foam rolling cooldown", "category": "Cooldown", "muscle_group": "Full body", "session_type": "Cooldown"},
]

def seed():
    db = SessionLocal()
    existing = db.query(Exercise).count()
    if existing > 0:
        print(f"Database already has {existing} exercises. Skipping seed.")
        db.close()
        return

    for ex in exercises:
        db.add(Exercise(
            name=ex["name"],
            category=ex["category"],
            muscle_group=ex["muscle_group"],
            session_type=ex["session_type"],
            description=""
        ))

    db.commit()
    db.close()
    print(f"Seeded {len(exercises)} exercises successfully.")

if __name__ == "__main__":
    seed()
# GymFlow

A smart workout tracker built around an Upper/Lower split. Log your sessions, track sets and reps, and get intelligent recommendations for what to train next based on what you've done recently.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, Vite, React Router, Axios
- Infrastructure: Docker (runs PostgreSQL locally)

## Project Structure

    gymflow/
    ├── backend/
    │   ├── main.py           # FastAPI entry point
    │   ├── database.py       # PostgreSQL connection
    │   ├── models.py         # SQLAlchemy table definitions
    │   ├── schemas.py        # Pydantic request/response shapes
    │   ├── seed.py           # Seeds the exercise catalog
    │   └── routers/          # API route handlers
    │       ├── exercises.py
    │       ├── sessions.py
    │       ├── sets.py
    │       └── recommend.py
 
            ├── components/   # Reusable UI pieces
            ├── api.js        # Axios API calls
            └── App.jsx       # React Router setup

## Setup

1. Clone the repository:

    git clone https://github.com/YOUR_USERNAME/gymflow.git
    cd gymflow

2. Start the database:

    docker run --name gymflow-db \
      -e POSTGRES_USER=gymflow \
      -e POSTGRES_PASSWORD=gymflow123 \
      -e POSTGRES_DB=gymflow \
      -p 5432:5432 \
      -d postgres:15

3. Set up the backend:

    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

4. Create backend/.env with:

    DATABASE_URL=postgresql://gymflow:gymflow123@localhost:5432/gymflow

5. Set up the frontend:

    cd frontend
    npm install

## Running the App

Start the backend (from backend/ with venv active):

    uvicorn main:app --reload

Start the frontend (from frontend/ in a new terminal tab):

    npm run dev

Then open http://localhost:5173 in your browser.

## Features

sions with warm up, main focus, cardio and cooldown phases
- Track sets, reps, weight and duration per exercise
- Browse your complete exercise catalog
- Get smart recommendations for what to train next
- View progress and personal records over time

## Docker Tips

Start the database container:

    docker start gymflow-db

Stop the database container:

    docker stop gymflow-db

Check if it is running:

    docker ps

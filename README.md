# GymFlow

A smart workout tracker built around an Upper/Lower split. Log your sessions, track sets and reps, and get intelligent recommendations for what to train next based on what you've done recently.

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, Vite, React Router, Axios
- Infrastructure: Docker (runs PostgreSQL locally)

## Project Structure

    gymflow/
    ├── start.sh              # One-command startup script
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
    └── frontend/
        └── src/
            ├── pages/        # Full page components
            │   ├── Today.jsx
            │   ├── Recommend.jsx
            │   ├── Catalog.jsx
            │   └── Progress.jsx
            ├── components/   # Reusable UI pieces
            ├── api.js        # Axios API calls
            └── App.jsx       # React Router setup

## Quick Start (recommended)

Make sure Docker Desktop is installed, then run:

    ./start.sh

Or if you have set up the alias:

    gymflow

This will:
- Start Docker Desktop if not already running
- Start the PostgreSQL database container
- Start the FastAPI backend on http://127.0.0.1:8000
- Start the React frontend on http://localhost:5173
- Open the app in your browser automatically

Press Ctrl+C to stop everything cleanly.

## Manual Setup (first time only)

1. Clone the repository:

    git clone https://github.com/YOUR_USERNAME/gymflow.git
    cd gymflow

2. Create and activate the virtual environment:

    python3 -m venv venv
    source venv/bin/activate

3. Install backend dependencies:

    pip install -r backend/requirements.txt

4. Create backend/.env with your database connection:

    DATABASE_URL=postgresql://gymflow:gymflow123@localhost:5432/gymflow

5. Install frontend dependencies:

    cd frontend
    npm install

6. Start the database container:

    docker run --name gymflow-db \
      -e POSTGRES_USER=gymflow \
      -e POSTGRES_PASSWORD=gymflow123 \
      -e POSTGRES_DB=gymflow \
      -p 5432:5432 \
      -d postgres:15

7. Seed the exercise catalog:

    cd backend
    python3 seed.py

8. Run the app:

    ./start.sh

## Optional: Set up the gymflow alias

Add this to your ~/.zshrc so you can launch the app from anywhere:

    alias gymflow="~/Documents/claude-101/gymflow/start.sh"

Then reload your shell:

    source ~/.zshrc

Now just type gymflow in any terminal to start the app.

## Features

- Log full gym sessions with warm up, main focus, cardio and cooldown phases
- Track sets, reps, weight and duration per exercise
- Browse your complete exercise catalog with search and filters
- Get smart recommendations for what to train next based on recent sessions
- View full session history with exercise and set details
- One command startup and shutdown

## Pages

- Today — start a session, add exercises by phase, log sets with reps and weight
- Recommend — see what focus and exercises are suggested based on your history
- Catalog — browse all 80 exercises grouped by category and muscle group
- Progress — view all past sessions with exercise and set details

## Docker Commands

Start the database:

    docker start gymflow-db

Stop the database:

    docker stop gymflow-db

Check if running:

    docker ps
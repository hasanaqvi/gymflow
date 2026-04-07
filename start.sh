#!/bin/bash

echo ""
echo "Starting GymFlow..."
echo ""

# Start Docker Desktop if not running
if ! docker info > /dev/null 2>&1; then
  echo "Starting Docker Desktop..."
  open -a Docker
  echo "Waiting for Docker to start..."
  while ! docker info > /dev/null 2>&1; do
    sleep 2
  done
  echo "Docker is ready."
fi

# Start the database container
if [ "$(docker ps -q -f name=gymflow-db)" ]; then
  echo "Database already running."
else
  echo "Starting database..."
  docker start gymflow-db
  sleep 2
  echo "Database ready."
fi

# Start the backend
echo "Starting backend..."
cd ~/Documents/claude-101/gymflow
source venv/bin/activate
cd backend
uvicorn main:app --reload &
BACKEND_PID=$!
echo "Backend running (PID $BACKEND_PID)"

# Wait a moment for backend to be ready
sleep 2

# Start the frontend
echo "Starting frontend..."
cd ~/Documents/claude-101/gymflow/frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend running (PID $FRONTEND_PID)"

sleep 2

# Open the browser
echo ""
echo "Opening GymFlow in browser..."
open http://localhost:5173

echo ""
echo "GymFlow is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://127.0.0.1:8000"
echo "  API docs: http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop everything."
echo ""

# Keep script running and stop both servers on Ctrl+C
trap "echo ''; echo 'Stopping GymFlow...'; kill $BACKEND_PID $FRONTEND_PID; docker stop gymflow-db; echo 'Done. Goodbye!'; exit" SIGINT

wait
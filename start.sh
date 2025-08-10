#!/bin/bash

echo "🏥 Starting Medical Emergency Detection System..."

# Start backend
echo "🔧 Starting Python Backend..."
cd python_backend
source ../venv/bin/activate
python medical_detection.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting React Frontend..."
npm run dev &
FRONTEND_PID=$!

echo "✅ System started!"
echo "📊 Backend: http://localhost:5001"
echo "🖥️  Frontend: http://localhost:5173 (or 5174)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait 
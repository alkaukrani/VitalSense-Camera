#!/bin/bash

echo "🏥 Medical Emergency Detection System Status"
echo "=========================================="

# Check backend
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend: Running on http://localhost:5001"
else
    echo "❌ Backend: Not running"
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend: Running on http://localhost:5173"
elif curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "✅ Frontend: Running on http://localhost:5174"
else
    echo "❌ Frontend: Not running"
fi

echo ""
echo "🌐 Access your dashboard at:"
echo "   http://localhost:5173 (or 5174)" 
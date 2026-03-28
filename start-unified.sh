#!/bin/bash

echo "========================================"
echo " Smart Farming 360 - Unified Server"
echo "========================================"
echo ""

echo "[1/3] Installing dependencies..."
npm install --prefix backend
npm install --prefix frontend
echo ""

echo "[2/3] Building frontend..."
npm run build --prefix frontend
echo ""

echo "[3/3] Starting server..."
echo ""
echo "Server will run on: http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""
npm start --prefix backend

@echo off
echo ====================================
echo FedEx DCA Management - Setup Script
echo ====================================
echo.

echo [1/4] Setting up Python virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate
echo.

echo [2/4] Installing Python dependencies...
pip install -r requirements.txt
echo.

echo [3/4] Training ML models...
cd ..\ml
python train_prioritization.py
python train_recovery.py
echo.

echo [4/4] Seeding database...
cd ..\data
python seed_data.py
echo.

echo ====================================
echo Setup complete!
echo ====================================
echo.
echo Next steps:
echo 1. Start backend:  cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo 2. Start frontend: cd frontend ^&^& npm install ^&^& npm run dev
echo.
pause

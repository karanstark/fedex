# 🚀 Quick Start Guide - FedEx DCA Management

## Prerequisites
- Node.js 18+ and npm
- Python 3.9+

## Setup (5 minutes)

### Step 1: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Train ML Models
```bash
cd ../ml
python train_prioritization.py
python train_recovery.py
```

### Step 3: Seed Database
```bash
cd ../data
python seed_data.py
```

### Step 4: Start Backend
```bash
cd ../backend
uvicorn app.main:app --reload
```

✅ Backend running at: **http://localhost:8000**  
✅ API Docs at: **http://localhost:8000/docs**

### Step 5: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

## 🎯 Demo Flow

1. **Landing Page**: See particle animation
2. **Click to Enter**: Access dashboard
3. **Dashboard**: View KPIs and analytics
4. **Case Management**: Browse and filter cases
5. **Analytics**: Explore ageing buckets and DCA performance

## 🔥 Key Features to Show

- ✨ Particle Hero animation
- 🤖 AI-powered case prioritization
- 📊 Recovery probability predictions
- 📈 Real-time analytics dashboard
- 🎯 SLA breach tracking
- 🏆 DCA performance comparison

---

**Ready to revolutionize debt collection! 🚀**

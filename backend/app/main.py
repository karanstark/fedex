from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import cases, analytics, predictions, auth

app = FastAPI(
    title="FedEx DCA Management API",
    description="AI-Powered Debt Collection Agency Management System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
def startup_event():
    init_db()

# Include routers
app.include_router(cases.router)
app.include_router(analytics.router)
app.include_router(predictions.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "FedEx DCA Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

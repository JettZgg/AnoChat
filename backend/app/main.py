# backend/app/main.py
from fastapi import FastAPI
from app.database import engine
from app.models import Base  # Ensure Base is correctly imported
from app.api import auth, text_message

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth.router)
app.include_router(text_message.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AnoChat API"}

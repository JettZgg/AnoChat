# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine
from app import models, schemas
from app.api import auth, text_message
from .services.websocket import router as websocket_router
from app.config import settings
from app.dependencies import get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router)
app.include_router(text_message.router)
app.include_router(websocket_router)

origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/protected-route")
async def read_protected_route(current_user: schemas.User = Depends(get_current_user)):
    return {"msg": "You are authorized"}
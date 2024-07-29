# backend/app/api/text_message.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import SessionLocal
from app.dependencies import get_db

router = APIRouter(
    prefix="/text_messages",
    tags=["text_messages"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TextMessage)
def create_message(message: schemas.TextMessageCreate, db: Session = Depends(get_db)):
    return crud.create_text_message(db=db, message=message)

@router.get("/{message_id}", response_model=schemas.TextMessage)
def read_message(message_id: int, db: Session = Depends(get_db)):
    db_message = crud.get_text_message(db, message_id=message_id)
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return db_message

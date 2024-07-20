# backend/app/crud/message.py
from sqlalchemy.orm import Session
from .. import models, schemas

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(content=message.content, user_id=message.user_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_message(db: Session, message_id: int):
    return db.query(models.Message).filter(models.Message.id == message_id).first()

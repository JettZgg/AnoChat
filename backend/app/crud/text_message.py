# backend/app/crud/text_message.py
from sqlalchemy.orm import Session
from app.models.text_message import TextMessage
from app.schemas.text_message import TextMessageCreate

def create_text_message(db: Session, message: TextMessageCreate):
    db_message = TextMessage(content=message.content, user_id=message.user_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_text_message(db: Session, message_id: int):
    return db.query(TextMessage).filter(TextMessage.id == message_id).first()

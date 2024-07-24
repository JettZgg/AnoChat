# backend/app/schemas/text_message.py
from pydantic import BaseModel
from datetime import datetime

class TextMessageBase(BaseModel):
    content: str

class TextMessageCreate(TextMessageBase):
    user_id: int

class TextMessage(TextMessageBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

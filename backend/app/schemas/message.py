# backend/app/schemas/message.py
from pydantic import BaseModel

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    user_id: int

class Message(MessageBase):
    id: int

    class Config:
        orm_mode = True

# backend/app/models/__init__.py
from .user import User
from .text_message import TextMessage
from app.database import Base

# This ensures that Base is correctly imported from app.database

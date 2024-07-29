# backend/app/services/websocket.py
from fastapi import APIRouter, WebSocket, Depends, HTTPException
from fastapi.websockets import WebSocketDisconnect
from sqlalchemy.orm import Session
import json
from typing import List

from ..dependencies import get_db
from ..models import User
from ..crud import get_user_by_username
from ..config import settings
from jose import jwt, JWTError

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

async def get_token(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if token is None:
        raise HTTPException(status_code=403, detail="Not authenticated")
    return token

async def get_current_user_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    try:
        token = await get_token(websocket)
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid authentication credentials")
    
    user = get_user_by_username(db, username=username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, user: User = Depends(get_current_user_ws)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            message["username"] = user.username
            await manager.broadcast(json.dumps(message))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(json.dumps({"message": f"User {user.username} left the chat"}))
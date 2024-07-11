from fastapi import WebSocket
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("connection open")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print("connection closed")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

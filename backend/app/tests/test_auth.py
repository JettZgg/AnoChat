# backend/app/tests/test_auth.py

import pytest
from httpx import AsyncClient
from app.main import app
from app.database import SessionLocal, engine, Base
from app.models import User

@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.mark.asyncio
async def test_register_user(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})
        assert response.status_code == 200
        assert response.json()["username"] == "testuser"
        assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_login_user(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register the user first
        await ac.post("/auth/register", json={"username": "testuser", "email": "test@example.com", "password": "password123"})

        # Attempt to log in
        response = await ac.post("/auth/token", data={"username": "testuser", "password": "password123"})
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "bearer"

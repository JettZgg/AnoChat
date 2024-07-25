# backend/app/tests/test_auth.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.database import SessionLocal, engine, Base
from app.models import User
from app.core.security import get_password_hash

@pytest.fixture(scope="module")
def setup_database():
    print("Setting up database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        test_user = db.query(User).filter_by(username="testuser").first()
        if not test_user:
            test_user = User(username="testuser", email="test@example.com", hashed_password=get_password_hash("password123"))
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        print("Database setup and teardown complete.")

@pytest.mark.asyncio
async def test_register_user(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/register", json={"username": "newuser", "email": "new@example.com", "password": "password123"})
        assert response.status_code == 200
        assert response.json()["username"] == "newuser"

@pytest.mark.asyncio
async def test_login_user(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/token", data={"username": "testuser", "password": "password123"})
        assert response.status_code == 200
        assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_invalid_login_user(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/token", data={"username": "testuser", "password": "wrongpassword"})
        assert response.status_code == 401
        assert response.json()["detail"] == "Incorrect username or password"

@pytest.mark.asyncio
async def test_access_protected_route(setup_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        login_response = await ac.post("/auth/token", data={"username": "testuser", "password": "password123"})
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        protected_response = await ac.get("/protected-route", headers=headers)
        assert protected_response.status_code == 200
        assert protected_response.json() == {"msg": "You are authorized"}

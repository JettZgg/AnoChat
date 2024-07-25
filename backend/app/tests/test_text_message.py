# backend/app/tests/test_text_message.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.database import SessionLocal, engine, Base
from app.models import User

@pytest.fixture(scope="module")
def setup_database():
    print("Setting up database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if the test user already exists
        test_user = db.query(User).filter_by(username="testuser").first()
        if not test_user:
            # Create a test user if not exists
            test_user = User(username="testuser", email="test@example.com", hashed_password="fakehashedpassword")
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
        yield
    finally:
        # Drop the database tables after tests
        db.close()
        Base.metadata.drop_all(bind=engine)
        print("Database setup and teardown complete.")

@pytest.mark.asyncio
async def test_create_text_message(setup_database):
    print("Starting test_create_text_message...")
    async with AsyncClient(app=app, base_url="http://test", timeout=10.0) as ac:
        response = await ac.post("/text_messages/", json={"content": "Hello, World!", "user_id": 1})
        print(f"Response status: {response.status_code}")
        assert response.status_code == 200
        assert response.json()["content"] == "Hello, World!"
    print("test_create_text_message completed.")

@pytest.mark.asyncio
async def test_read_text_message(setup_database):
    print("Starting test_read_text_message...")
    async with AsyncClient(app=app, base_url="http://test", timeout=10.0) as ac:
        response = await ac.get("/text_messages/1")
        print(f"Response status: {response.status_code}")
        assert response.status_code == 200
        assert response.json()["id"] == 1
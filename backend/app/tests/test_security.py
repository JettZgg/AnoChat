# backend/app/tests/test_security.py

import pytest
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from datetime import timedelta

def test_password_hashing():
    password = "mysecretpassword"
    hashed_password = get_password_hash(password)
    assert verify_password(password, hashed_password) == True

def test_create_access_token():
    data = {"sub": "testuser"}
    token = create_access_token(data)
    assert isinstance(token, str)

def test_decode_access_token():
    data = {"sub": "testuser"}
    token = create_access_token(data)
    decoded_data = decode_access_token(token)
    assert decoded_data["sub"] == "testuser"

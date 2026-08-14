from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    raw_pass = "SecureTrip2026!"
    hashed = get_password_hash(raw_pass)
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token():
    user_id = "test-user-uuid-123"
    token = create_access_token(user_id)
    decoded = decode_access_token(token)
    assert decoded == user_id

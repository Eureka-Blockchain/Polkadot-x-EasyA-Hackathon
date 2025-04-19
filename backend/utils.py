from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password_hash: str) -> str:
    return pwd_context.hash(password_hash)
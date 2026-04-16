from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str
    role: str   # "ADMIN" or "FACULTY" (selected from login page toggle)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    email: str
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.schemas.schemas import LoginRequest, LoginResponse, RegisterRequest

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", description="""สมัครสมาชิก

**Console test:**
```
fetch("http://localhost:8080/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "somchai", password: "1234",
    email: "somchai.d@company.com", tel: "093-245-7894",
    date_of_birth: "25/12/2549",
    address: "689 ซอยลาดกระบัง 19 ถนนลาดกระบัง",
    credit_card: "1234-5678-9012-3456"
  }),
}).then(r => r.json()).then(console.log)
```""")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # TODO: implement register logic
    return {"message": "registered", "username": req.username}


@router.post("/login", response_model=LoginResponse, description="""เข้าสู่ระบบ

**Console test:**
```
fetch("http://localhost:8080/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "somchai", password: "1234" }),
}).then(r => r.json()).then(console.log)
```""")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # TODO: implement login logic
    return LoginResponse(message="login success", user_id=1, username=req.username)

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
    # 1. เช็คว่า username ซ้ำไหม
    existing_user = db.query(User).filter(User.username == req.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # 2. สร้าง User object จากข้อมูลที่รับมา
    new_user = User(
        username=req.username,
        password=req.password,       # TODO: ควร hash password ก่อน เช่น bcrypt
        email=req.email,
        tel=req.tel,
        date_of_birth=req.date_of_birth,
        address=req.address,
        credit_card=req.credit_card,
        money=0.0,
    )

    # 3. บันทึกลง DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # ดึง id ที่ DB generate มาใส่ใน new_user

    return {"message": "registered", "user_id": new_user.id, "username": new_user.username}


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
    # 1. find user from db ,get the user object
    user = db.query(User).filter(User.username == req.username).first()

    # 2. check password if correct with db 
    if not user or user.password != req.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # 3. 
    return LoginResponse(message="login success", user_id=user.id, username=user.username)
    


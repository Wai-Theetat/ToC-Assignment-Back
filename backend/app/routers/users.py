from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserProfile, UserUpdate
from app.services.masking import (
    mask_address,
    mask_credit_card,
    mask_dob,
    mask_email,
    mask_tel,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserProfile, description="""ดูโปรไฟล์ (ข้อมูลถูก mask)

**Console test:**
```
fetch("http://localhost:8080/users/1").then(r => r.json()).then(console.log)
```""")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    
    getUser = db.query(User).filter(User.id == user_id).first()
    if not getUser:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(
        username=getUser.username,
        email=mask_email(getUser.email),
        tel=mask_tel(getUser.tel),
        date_of_birth=mask_dob(getUser.date_of_birth),
        address=mask_address(getUser.address),
        credit_card=mask_credit_card(getUser.credit_card),
    )


@router.put("/{user_id}", description="""แก้ไขข้อมูลผู้ใช้

**Console test:**
```
fetch("http://localhost:8080/users/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "new@email.com" }),
}).then(r => r.json()).then(console.log)
```""")
def update_user(user_id: int, req: UserUpdate, db: Session = Depends(get_db)):
    getUser = db.query(User).filter(User.id == user_id).first()
    if not getUser:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = req.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in update_data.items():
        setattr(getUser, field, value)
    
    db.commit()
    db.refresh(getUser)
    return {"message": "updated", "user_id": user_id}


@router.delete("/{user_id}", description="""ลบผู้ใช้

**Console test:**
```
fetch("http://localhost:8080/users/1", {
  method: "DELETE",
}).then(r => r.json()).then(console.log)
```""")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    getUser = db.query(User).filter(User.id == user_id).first()
    if not getUser:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(getUser)
    db.commit()
    return {"message": "deleted", "user_id": user_id}

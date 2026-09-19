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
# def get_user_profile(user_id: int, db: Session = Depends(get_db)):
#     # TODO: implement get user from DB
#     return UserProfile(
#         username="somchai",
#         email=mask_email("somchai.d@company.com"),
#         tel=mask_tel("093-245-7894"),
#         date_of_birth=mask_dob("25/12/2549"),
#         address=mask_address("689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ"),
#         credit_card=mask_credit_card("1234-5678-9012-3456"),
#     )

def get_user_profile(user_id: int, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.id == user_id).first()
	if user is None:
		raise HTTPException(status_code=404, detail="User not found")

	return UserProfile(
		username=user.username,
		email=mask_email(user.email),
		tel=mask_tel(user.tel),
		date_of_birth=mask_dob(user.date_of_birth),
		address=mask_address(user.address),
		credit_card=mask_credit_card(user.credit_card),
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
# def update_user(user_id: int, req: UserUpdate, db: Session = Depends(get_db)):
# 	# TODO: implement update user
# 	return {"message": "updated", "user_id": user_id}

def update_user(user_id: int, req: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = req.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {"message": "updated", "user_id": user.id}


@router.delete("/{user_id}", description="""ลบผู้ใช้

**Console test:**
```
fetch("http://localhost:8080/users/1", {
method: "DELETE",
}).then(r => r.json()).then(console.log)
```""")

# def delete_user(user_id: int, db: Session = Depends(get_db)):
# 	# TODO: implement delete user
# 	return {"message": "deleted", "user_id": user_id}

def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "deleted", "user_id": user_id}
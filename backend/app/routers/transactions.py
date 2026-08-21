from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Transaction, User
from app.schemas.schemas import (
    BalanceResponse,
    DepositWithdrawRequest,
    TransactionResponse,
)
from app.services.masking import mask_credit_card

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/{user_id}/balance", response_model=BalanceResponse, description="""ดูยอดเงิน

**Console test:**
```
fetch("http://localhost:8000/transactions/1/balance").then(r => r.json()).then(console.log)
```""")
def get_balance(user_id: int, db: Session = Depends(get_db)):
    # TODO: implement get balance
    return BalanceResponse(username="somchai", money=500.0)


@router.post("/{user_id}/deposit", description="""ฝากเงิน

**Console test:**
```
fetch("http://localhost:8000/transactions/1/deposit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 500 }),
}).then(r => r.json()).then(console.log)
```""")
def deposit(user_id: int, req: DepositWithdrawRequest, db: Session = Depends(get_db)):
    # TODO: implement deposit
    return {"message": "deposited", "amount": req.amount}


@router.post("/{user_id}/withdraw", description="""ถอนเงิน

**Console test:**
```
fetch("http://localhost:8000/transactions/1/withdraw", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 100 }),
}).then(r => r.json()).then(console.log)
```""")
def withdraw(user_id: int, req: DepositWithdrawRequest, db: Session = Depends(get_db)):
    # TODO: implement withdraw
    return {"message": "withdrawn", "amount": req.amount}


@router.get("/{user_id}/history", response_model=List[TransactionResponse], description="""ดูประวัติธุรกรรม

**Console test:**
```
fetch("http://localhost:8000/transactions/1/history").then(r => r.json()).then(console.log)
```""")
def get_transaction_history(user_id: int, db: Session = Depends(get_db)):
    # TODO: implement get transaction history
    return []

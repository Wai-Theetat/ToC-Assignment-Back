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
fetch("http://localhost:8080/transactions/1/balance").then(r => r.json()).then(console.log)
```""")
def get_balance(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    # TODO: implement get balance
    return BalanceResponse(username=user.username, money=user.money)


@router.post("/{user_id}/deposit", description="""ฝากเงิน

**Console test:**
```
fetch("http://localhost:8080/transactions/1/deposit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 500 }),
}).then(r => r.json()).then(console.log)
```""")
def deposit(user_id: int, req: DepositWithdrawRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    updated_money = user.money + req.amount
    newTransaction = Transaction(
        user_id=user_id,
        credit_card=mask_credit_card(user.credit_card),
        old_money=user.money,
        updated_money=updated_money,
        transaction_amount=req.amount,
        status="success",
    )
    user.money = updated_money
    db.add(newTransaction)
    db.commit()
    # TODO: implement deposit
    return {"message": "deposited", "amount": req.amount}


@router.post("/{user_id}/withdraw", description="""ถอนเงิน

**Console test:**
```
fetch("http://localhost:8080/transactions/1/withdraw", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 100 }),
}).then(r => r.json()).then(console.log)
```""")
def withdraw(user_id: int, req: DepositWithdrawRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.money < req.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    updated_money = user.money - req.amount

    if(updated_money < 0):
        raise HTTPException(status_code=400, detail="Insufficient funds")
    newTransaction = Transaction(
        user_id=user_id,
        credit_card=mask_credit_card(user.credit_card),
        old_money=user.money,
        updated_money=updated_money,
        transaction_amount=req.amount,
        status="success",
    )
    user.money = updated_money
    db.add(newTransaction)
    db.commit()
    # TODO: implement withdraw
    return {"message": "withdrawn", "amount": req.amount}


@router.get("/{user_id}/history", response_model=List[TransactionResponse], description="""ดูประวัติธุรกรรม

**Console test:**
```
fetch("http://localhost:8080/transactions/1/history").then(r => r.json()).then(console.log)
```""")
def get_transaction_history(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # TODO: implement get transaction history
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    
    transaction_responses = [
        TransactionResponse(
            credit_card=mask_credit_card(transaction.credit_card),
            old_money=transaction.old_money,
            updated_money=transaction.updated_money,
            transaction_amount=transaction.transaction_amount,
            status=transaction.status,
        ) for transaction in transactions]
    return transaction_responses

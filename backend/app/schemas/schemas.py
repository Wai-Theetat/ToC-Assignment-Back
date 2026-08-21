from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# --- Auth ---

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    tel: str
    date_of_birth: str
    address: str
    credit_card: str


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    message: str
    user_id: int
    username: str


# --- User ---

class UserProfile(BaseModel):
    username: str
    email: str
    tel: str
    date_of_birth: str
    address: str
    credit_card: str

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    email: Optional[str] = None
    tel: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    credit_card: Optional[str] = None


# --- Transaction ---

class DepositWithdrawRequest(BaseModel):
    amount: float


class TransactionResponse(BaseModel):
    credit_card: str
    old_money: float
    updated_money: float
    transaction_amount: float
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BalanceResponse(BaseModel):
    username: str
    money: float

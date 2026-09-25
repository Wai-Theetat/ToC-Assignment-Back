from fastapi import APIRouter
from pydantic import BaseModel

from app.services.masking import mask_text, find_details

router = APIRouter(prefix="/mask", tags=["masking"])


class MaskRequest(BaseModel):
    text: str

class FullMaskResponse(BaseModel):
    original_email: str
    original_date_of_birth: str
    original_phone_number : str
    original_address : str
    original_credit_card : str
    email: str
    date_of_birth: str
    phone_number : str
    address : str
    credit_card : str

class MaskResponse(BaseModel):
    original: str

    email: str
    date_of_birth: str
    phone_number : str
    address : str
    credit_card : str

@router.post(
    "/",
    response_model=FullMaskResponse,
    summary="Return every masked and unmarked all information need for signup page",
)
def mask_sensitive_data(req: MaskRequest):
    masked=mask_text(req.text)
    og_credit_card, og_email, og_tel, og_date_of_birth, og_address = find_details(req.text)
    return FullMaskResponse(
        original=req.text,
        original_email=og_email,
        original_date_of_birth=og_date_of_birth,
        original_phone_number=og_tel,
        original_address=og_address,
        original_credit_card=og_credit_card,
        email=masked["email"],
        date_of_birth=masked["date_of_birth"],
        phone_number=masked["phone_number"],
        address=masked["address"],
        credit_card=masked["credit_card"]
    )

@router.post(
    "/masked",
    response_model=MaskResponse,
    summary="Auto-mask sensitive data in free-form text",
)
def mask_sensitive_data(req: MaskRequest):
    masked=mask_text(req.text)
    return MaskResponse(
        original=req.text,
        email=masked["email"],
        date_of_birth=masked["date_of_birth"],
        phone_number=masked["phone_number"],
        address=masked["address"],
        credit_card=masked["credit_card"]
    )

@router.post(
    "/premask",
    response_model=MaskResponse,
    summary="Get each detail from string",
)
def mask_sensitive_data(req: MaskRequest):
    credit_card, email, tel, date_of_birth, address = find_details(req.text)
    return MaskResponse(
        original=req.text,
        email=email,
        date_of_birth=date_of_birth,
        phone_number=tel,
        address=address,
        credit_card=credit_card
    )

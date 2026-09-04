from fastapi import APIRouter
from pydantic import BaseModel

from app.services.masking import mask_text

router = APIRouter(prefix="/mask", tags=["masking"])


class MaskRequest(BaseModel):
    text: str


class MaskResponse(BaseModel):
    original: str
    masked: str


@router.post(
    "",
    response_model=MaskResponse,
    summary="Auto-mask sensitive data in free-form text",
)
def mask_sensitive_data(req: MaskRequest):
    return MaskResponse(original=req.text, masked=mask_text(req.text))

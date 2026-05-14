from __future__ import annotations

import asyncio
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

logger = logging.getLogger(__name__)

app = FastAPI(title="Visio VTON API", version="0.1.0")


class GenerateOutfitRequest(BaseModel):
    user_image: HttpUrl
    outfit_image: Optional[HttpUrl] = None
    outfit_category: Optional[str] = None


class GenerateOutfitResponse(BaseModel):
    output_image: HttpUrl


async def generate_vton_outfit(user_image: str, outfit_image: Optional[str]) -> str:
    """
    Placeholder for external AI VTON API integration.

    Add your AI provider auth, payload mapping, and polling/retry logic here.
    """
    await asyncio.sleep(2)
    return "https://placehold.co/720x1280/png?text=Visio+Output"


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/generate-outfit", response_model=GenerateOutfitResponse)
async def create_outfit(payload: GenerateOutfitRequest) -> GenerateOutfitResponse:
    if not payload.outfit_image and not payload.outfit_category:
        raise HTTPException(status_code=422, detail="Provide outfit_image or outfit_category")

    try:
        generated = await asyncio.wait_for(
            generate_vton_outfit(str(payload.user_image), str(payload.outfit_image) if payload.outfit_image else None),
            timeout=60,
        )
        return GenerateOutfitResponse(output_image=generated)
    except TimeoutError as exc:
        logger.exception("VTON generation timed out")
        raise HTTPException(status_code=504, detail="Generation timed out") from exc
    except Exception as exc:
        logger.exception("Unexpected VTON error")
        raise HTTPException(status_code=502, detail="Failed to generate outfit") from exc

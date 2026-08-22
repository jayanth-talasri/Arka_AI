import os

from fastapi import Header, HTTPException


def verify_ai_api_key(
    x_ai_api_key: str | None = Header(default=None)
):

    expected_key = os.getenv("AI_API_KEY")

    if not expected_key:
        raise HTTPException(
            status_code=500,
            detail="AI API key is not configured"
        )

    if x_ai_api_key != expected_key:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized AI backend request"
        )

    return True

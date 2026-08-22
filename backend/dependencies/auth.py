import os

from fastapi import Header, HTTPException


def verify_ai_token(
    x_ai_token: str | None = Header(default=None)
):

    expected_token = os.getenv("AI_INTERNAL_TOKEN")

    if not expected_token:
        raise HTTPException(
            status_code=500,
            detail="AI authentication token not configured"
        )

    if x_ai_token != expected_token:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    return True
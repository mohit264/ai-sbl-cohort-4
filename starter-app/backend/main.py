"""Small API used to teach request tracing and evidence-first operations.

This is a local training service, not a production-ready application.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GroundOps Lab API", version="0.1.0")

# CORS is a browser cross-origin response policy, not authentication.
# The default is intentionally restricted to the lab's exact frontend origin.
# A later lab changes this value to demonstrate an origin mismatch.
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS", "http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    """Minimal process/HTTP health endpoint for the local lab only."""
    return {"status": "ok"}


@app.get("/api/status")
def api_status() -> dict[str, str]:
    """Return a small, deterministic response for browser request tracing."""
    return {
        "service": "groundops-api",
        "status": "available",
        "message": "The browser reached the FastAPI endpoint.",
        "version": "0.1.0",
    }

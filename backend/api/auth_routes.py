from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from datetime import datetime, timezone

from db import get_db
from auth import get_current_user
from core.config import settings
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from services.user_services import UserService
from services.token_service import TokenService
from models.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    AccessTokenResponse,
    PasswordResetRequest,
    PasswordReset,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security_scheme = HTTPBearer()

# ───────────── Cookie helpers ─────────────

REFRESH_COOKIE_NAME = "refresh_token"
REFRESH_MAX_AGE = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # seconds


def _set_refresh_cookie(response: Response, refresh_token: str):
    """Set the refresh token as an HTTP-only, secure, same-site cookie."""
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,            # JS cannot read this
        secure=False,             # Set to True in production (requires HTTPS)
        samesite="lax",           # Sent on same-site navigation
        max_age=REFRESH_MAX_AGE,
        path="/api/auth",         # Only sent to auth endpoints
    )


def _clear_refresh_cookie(response: Response):
    """Delete the refresh token cookie."""
    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/api/auth",
    )


def _build_tokens(user: dict) -> dict:
    """Helper: create access + refresh tokens for a user."""
    user_id = str(user["_id"])
    access = create_access_token({"sub": user_id, "role": user["role"]})
    refresh = create_refresh_token({"sub": user_id, "role": user["role"]})
    return {"access_token": access, "refresh_token": refresh}


# ───────────────────────── Register ─────────────────────────


@router.post("/register", response_model=AccessTokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, response: Response, db=Depends(get_db)):
    """Register a new user. Returns access token in JSON, refresh token in cookie."""
    user_service = UserService(db)
    new_user = await user_service.create_user(user_in)
    tokens = _build_tokens(new_user)

    _set_refresh_cookie(response, tokens["refresh_token"])
    return AccessTokenResponse(access_token=tokens["access_token"])


# ───────────────────────── Login ─────────────────────────


@router.post("/login", response_model=AccessTokenResponse)
async def login(credentials: UserLogin, response: Response, db=Depends(get_db)):
    """Authenticate with email + password. Returns access token in JSON, refresh token in cookie."""
    user_service = UserService(db)
    user = await user_service.authenticate(credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    tokens = _build_tokens(user)

    _set_refresh_cookie(response, tokens["refresh_token"])
    return AccessTokenResponse(access_token=tokens["access_token"])


# ───────────────────────── Logout ─────────────────────────


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    response: Response,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db=Depends(get_db),
):
    """Blacklist the current access token and clear the refresh cookie."""
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    token_service = TokenService(db)
    jti = payload.get("jti")
    exp = payload.get("exp")
    if jti and exp:
        expires_at = datetime.fromtimestamp(exp, tz=timezone.utc)
        await token_service.blacklist_token(jti, expires_at)

    _clear_refresh_cookie(response)
    return {"message": "Successfully logged out"}


# ───────────────────────── Me ─────────────────────────


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


# ───────────────────────── Refresh Token ─────────────────────────


@router.post("/refresh-token", response_model=AccessTokenResponse)
async def refresh_token(request: Request, response: Response, db=Depends(get_db)):
    """
    Exchange the refresh token (from HTTP-only cookie) for a new token pair.
    Sets a new refresh cookie and returns the new access token in JSON.
    """
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided",
        )

    try:
        payload = decode_token(token)
    except JWTError:
        _clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    # Must be a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type — expected a refresh token",
        )

    # Blacklist the old refresh token so it can't be reused
    token_service = TokenService(db)
    jti = payload.get("jti")
    exp = payload.get("exp")
    if jti:
        if await token_service.is_blacklisted(jti):
            _clear_refresh_cookie(response)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked",
            )
        if exp:
            expires_at = datetime.fromtimestamp(exp, tz=timezone.utc)
            await token_service.blacklist_token(jti, expires_at)

    # Verify user still exists
    user_id = payload.get("sub")
    user_service = UserService(db)
    user = await user_service.get_by_id(user_id)
    if not user:
        _clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    tokens = _build_tokens(user)
    _set_refresh_cookie(response, tokens["refresh_token"])
    return AccessTokenResponse(access_token=tokens["access_token"])


# ───────────────────────── Forgot Password ─────────────────────────


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(body: PasswordResetRequest, db=Depends(get_db)):
    """
    Generate a password reset token.
    Always returns 200 to avoid leaking whether the email exists.
    """
    user_service = UserService(db)
    token = await user_service.generate_password_reset_token(body.email)

    if token:
        # TODO: Replace with real email sending once SMTP is configured
        print(f"[PASSWORD RESET] Token for {body.email}: {token}")

    return {"message": "If that email is registered, a reset link has been sent"}


# ───────────────────────── Reset Password ─────────────────────────


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(body: PasswordReset, db=Depends(get_db)):
    """Validate a password reset token and set the new password."""
    user_service = UserService(db)
    await user_service.reset_password(body.token, body.new_password)
    return {"message": "Password has been reset successfully"}

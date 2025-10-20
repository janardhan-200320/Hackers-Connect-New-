from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from supabase import create_client, Client

import secrets
from fastapi.responses import RedirectResponse
import httpx
from pydantic.networks import EmailStr

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.utils import (
    generate_password_reset_token,
    send_reset_password_email,
    verify_password_reset_token,
)

router = APIRouter()

# Initialize Supabase client using keys from your .env file
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login.
    This authenticates against Supabase and returns the official Supabase JWT.
    """
    try:
        # 1. Authenticate user with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        
        # The session object from Supabase contains the official JWT
        if not auth_response.session or not auth_response.session.access_token:
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        # 2. (Optional but recommended) Check if user exists and is active in your local DB
        local_user = crud.user.get(db, id=auth_response.user.id)
        if not local_user or not local_user.is_active:
            raise HTTPException(status_code=400, detail="User is inactive or not found locally.")

        # 3. Return the official Supabase access token directly
        return {
            "access_token": auth_response.session.access_token,
            "token_type": "bearer",
        }

    except Exception as e:
        # Catch potential errors from Supabase client (e.g., invalid credentials)
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password",
        )


@router.post("/password-recovery/{email}", response_model=schemas.Msg)
def recover_password(email: str, db: Session = Depends(deps.get_db)) -> Any:
    """
    Password Recovery
    """
    user = crud.user.get_by_email(db, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    send_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    return {"msg": "Password recovery email sent"}


@router.post("/reset-password/", response_model=schemas.Msg)
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Reset password
    """
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    return {"msg": "Password updated successfully"}


@router.get("/auth/github")
async def github_auth():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}"
    )


@router.get("/auth/github/callback")
async def github_callback(code: str, db: Session = Depends(deps.get_db)):
    token_url = "https://github.com/login/oauth/access_token"
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "client_secret": settings.GITHUB_CLIENT_SECRET,
        "code": code,
    }
    headers = {"Accept": "application/json"}
    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, params=params, headers=headers)
    res.raise_for_status()
    token_data = res.json()
    github_token = token_data.get("access_token")

    user_url = "https://api.github.com/user"
    headers = {"Authorization": f"token {github_token}"}
    async with httpx.AsyncClient() as client:
        res = await client.get(user_url, headers=headers)
    res.raise_for_status()
    user_data = res.json()
    
    user_email = user_data.get("email")
    if not user_email:
        user_email = f"{user_data.get('id')}@{user_data.get('login')}.github.com"

    user = crud.user.get_by_email(db, email=user_email)
    if not user:
        user_in = schemas.UserCreate(
            email=user_email,
            password=secrets.token_urlsafe(16),
            full_name=user_data.get("name") or user_data.get("login"),
            username=user_data.get("login"),
        )
        user = crud.user.create(db, obj_in=user_in)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    app_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return RedirectResponse(f"http://localhost:5173/auth/callback?token={app_token}")
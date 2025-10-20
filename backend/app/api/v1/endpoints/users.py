from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

# NEW: Import Supabase client
from supabase import create_client, Client

router = APIRouter()

# NEW: Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user. This will now create the user in Supabase Auth first.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    try:
        # 1. Create the user in Supabase Auth
        auth_user = supabase.auth.sign_up({
            "email": user_in.email,
            "password": user_in.password,
            "options": {
                "data": {
                    "full_name": user_in.full_name,
                    "username": user_in.username,
                }
            }
        })

        if auth_user.user is None:
            raise HTTPException(status_code=400, detail="Could not create user in Supabase.")

        # 2. Create the user in your local database using the ID from Supabase
        # This ensures the UUIDs match.
        user_in_db = schemas.UserCreateDB(
            id=auth_user.user.id,  # Use the ID from Supabase
            email=user_in.email,
            hashed_password=crud.user.get_password_hash(user_in.password), # Still store hash locally
            full_name=user_in.full_name,
            username=user_in.username,
            is_superuser=user_in.is_superuser,
        )
        user = crud.user.create_with_id(db, obj_in=user_in_db)

    except Exception as e:
        # If user creation fails, you might want to clean up the Supabase user
        # For now, we'll just raise the error
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during user creation: {str(e)}"
        )

    if settings.EMAILS_ENABLED and user_in.email:
        send_new_account_email(
            email_to=user_in.email, username=user_in.email, password=user_in.password
        )
    return user
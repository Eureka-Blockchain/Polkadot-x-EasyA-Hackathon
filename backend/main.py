from fastapi import FastAPI, Depends, HTTPException, status
from auth import verify_token
from utils import pwd_context
from supabase import create_client, Client

from models import (
    CompanyRegistration, CompanyResponse,
    UserRegistration, UserResponse,
    LoginLogRegistration, UserLogin
)
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime
import uuid

load_dotenv()

app = FastAPI()

# Initialize Supabase client with error handling
try:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase credentials in environment variables")
        
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    raise

# Initialize password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is up!"}

@app.get("/protected")
def protected_route(user=Depends(verify_token)):
    return {"message": "You are authenticated!", "user": user}

@app.post("/register/company", response_model=CompanyResponse)
async def register_company(company_data: CompanyRegistration):
    try:
        # Check if company email already exists
        existing_company = supabase.table("companies").select("*").eq("email", company_data.email).execute()
        if existing_company.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company with this email already exists"
            )
        
        # Hash the password
        hashed_password = pwd_context.hash(company_data.password)
        
        # Create company record
        data = {
            "name": company_data.name,
            "email": company_data.email,
            "password": hashed_password,
            "registered_address": company_data.registered_address
        }
        
        result = supabase.table("companies").insert(data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create company"
            )
        
        company = result.data[0]
        return CompanyResponse(
            id=company["id"],
            name=company["name"],
            email=company["email"],
            registered_address=company["registered_address"],
            created_at=company["created_at"],
            updated_at=company["updated_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in register_company: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/login/company")
async def login_company(email: str, password: str):
    try:
        # Get company by email
        result = supabase.table("companies").select("*").eq("email", email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        company = result.data[0]
        
        # Verify password
        if not pwd_context.verify(password, company["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Return company data without password
        return {
            "id": company["id"],
            "name": company["name"],
            "email": company["email"],
            "registered_address": company["registered_address"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in login_company: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/register/user", response_model=UserResponse)
async def register_user(user_data: UserRegistration):
    try:
        # Check if email exists
        existing_user = supabase.table("users").select("*").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Check if company exists
        company = supabase.table("companies").select("*").eq("id", str(user_data.company_id)).execute()
        if not company.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company not found"
            )

        # Hash the password
        hashed_password = pwd_context.hash(user_data.password)

        # Insert user
        data = {
            "full_name": user_data.full_name,
            "email": user_data.email,
            "company_id": str(user_data.company_id),
            "password_hash": hashed_password
        }
        result = supabase.table("users").insert(data).execute()

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )

        user = result.data[0]
        return UserResponse(
            id=user["id"],
            full_name=user["full_name"],
            email=user["email"],
            company_id=user["company_id"],
            created_at=user["created_at"],
            updated_at=user["updated_at"]
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in register_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
@app.post("/login/user")
async def login_user(credentials: UserLogin):
    try:
        result = supabase.table("users").select("*").eq("email", credentials.email).execute()

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        user = result.data[0]

        # Check plaintext password against hashed password
        if not pwd_context.verify(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Log the login
        supabase.table("login_log").insert({
            "user_id": str(user["id"])
        }).execute()

        # Return user details (no password)
        return {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "company_id": user["company_id"]
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in login_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

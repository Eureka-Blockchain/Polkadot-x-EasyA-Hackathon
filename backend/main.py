from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from web3 import Web3
from auth import verify_token
from utils import pwd_context
from supabase import create_client, Client
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from substrateinterface import SubstrateInterface, ContractCode, Keypair

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
import json 
from pathlib import Path

load_dotenv()

app = FastAPI()

# setup web3
# Web3 setup
w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT = w3.eth.account.from_key(PRIVATE_KEY)
CONTRACT_ADDRESS = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))

# Load ABI
# /Users/gandalf/Documents/Crypto/Hackathons/EasyA/Polkadot/Code/Eureka/backend/invoice-client/contracts/EurekaInvoiceRegistry.sol
# this needs to be contract abi not contract
with open(Path(__file__).parent.joinpath("invoice-client","contracts","contract_abi.json")) as f:
    ABI = json.load(f, strict="false")

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve favicon.ico
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")

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

# models for contract
class InvoiceSubmission(BaseModel):
    sha256_hash: str  # hex string
    hashcode: str

class HashCheck(BaseModel):
    sha256_hash: str

class CodeCheck(BaseModel):
    hashcode: str

# Westend RPC and contract details
WS_URL = "wss://westend-rpc.polkadot.io"
CONTRACT_ADDRESS = "0x3C197333cFDa62bcd12FEdcEc43e0b6929110355"
METADATA_PATH = "./EurekaInvoiceRegistry.contract"  # metadata JSON from ink! compilation
HASH_CODE = "INV-2025-2004"

@app.get("/invoice/{hashcode}")
def get_invoice(hashcode: str):
    try:
        # Connect to Westend
        substrate = SubstrateInterface(
            url=WS_URL,
            type_registry_preset='substrate-node-template',
        )

        # Load contract metadata
        contract_code = ContractCode.create_from_contract_files(
            metadata_file=METADATA_PATH
        )

        # Read from contract
        contract = contract_code.read_contract(substrate, CONTRACT_ADDRESS)

        result = contract.read(keypair=Keypair.create_from_uri('//Alice'), method="getInvoice", args={"hashcode": hashcode})

        if result.is_success:
            return {"invoice": result.contract_result_data}
        else:
            raise HTTPException(status_code=500, detail=f"Contract call failed: {result.error_message}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





# contract endpoints
@app.post("/submit")
def submit_invoice(data: InvoiceSubmission):
    try:
        nonce = w3.eth.get_transaction_count(ACCOUNT.address)
        tx = contract.functions.submitInvoice(data.sha256_hash, data.hashcode).build_transaction({
            'from': ACCOUNT.address,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return {"status": "submitted", "tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/revoke")
def revoke_invoice(data: CodeCheck):
    try:
        nonce = w3.eth.get_transaction_count(ACCOUNT.address)
        tx = contract.functions.revokeInvoice(data.hashcode).build_transaction({
            'from': ACCOUNT.address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return {"status": "revoked", "tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/complete")
def complete_invoice(data: CodeCheck):
    try:
        nonce = w3.eth.get_transaction_count(ACCOUNT.address)
        tx = contract.functions.completeInvoice(data.hashcode).build_transaction({
            'from': ACCOUNT.address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return {"status": "completed", "tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/invoice/{hashcode}")
def get_invoice(hashcode: str):
    try:
        invoice = contract.functions.getInvoice(hashcode).call()
        return {
            "hash": invoice[0],
            "hashcode": invoice[1],
            "issuer": invoice[2],
            "timestamp": invoice[3],
            "revoked": invoice[4],
            "completed": invoice[5]
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/sha-exists/{sha}")
def sha_exists(sha: str):
    try:
        exists = contract.functions.shaExists(sha).call()
        return {"exists": exists}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/test/contract_exists")
def contract_exists():
    try:
        result = contract.functions.storedValue().call()
        return {"value":result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
        company_result = supabase.table("companies").select("email").eq("id", str(user_data.company_id)).execute()
        if not company_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company not found"
            )

        # Extract domain from company email
        company_email = company_result.data[0]["email"]
        company_domain = company_email.split("@")[-1]

        # Validate user email domain
        if not user_data.email.endswith(f"@{company_domain}"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User email must match company domain '@{company_domain}'"
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

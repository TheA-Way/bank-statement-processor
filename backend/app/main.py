# app/main.py

# Imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from dotenv import load_dotenv

from app.models import ProcessedStatement
from app.pdf_processor import process_bank_statement

load_dotenv()

app = FastAPI(
    title="Bank Statement Processor API",
    description="Upload a PDF bank statement and get structured transaction data back",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",              
        "https://bank-statement-processor-nf2qtv33v-thea-ways-projects.vercel.app",        
    ],
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],    
)

@app.get("/")
def root():
    """Health check — confirm the server is running"""
    return {"status": "Bank Statement Processor API is running 🏦"}


@app.post("/process-statement", response_model=ProcessedStatement)
async def process_statement(file: UploadFile = File(...)):
    """
    Accepts a PDF bank statement file upload.
    Returns structured transaction data as JSON.
    
    Parameters:
        file: The uploaded PDF file (sent as multipart/form-data)
    
    Returns:
        ProcessedStatement object with all transactions
    """
    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted. Please upload a .pdf file."
        )
    
    contents = await file.read()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)          
        tmp_path = tmp.name         
    
    try:
        result = process_bank_statement(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the PDF: {str(e)}"
        )
    finally:
        os.unlink(tmp_path)
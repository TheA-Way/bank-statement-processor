# app/models.py
from pydantic import BaseModel
from typing import List, Optional


class Transaction(BaseModel):
    merchant: str          
    amount: float          
    date: str              
    description: str       
    transaction_type: str  


class ProcessedStatement(BaseModel):
    transactions: List[Transaction]
    total_spent: float
    transaction_count: int
    date_range: Optional[str] = None
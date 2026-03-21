# app/pdf_processor.py

import pdfplumber
import re
from typing import List
from app.models import Transaction, ProcessedStatement

def extract_text_from_pdf(pdf_path: str) -> str:
    full_text = ""
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            
            if page_text:
                full_text += page_text + "\n"
    
    return full_text


def clean_merchant_name(raw_name: str) -> str:
    # Common merchant name mappings
    merchant_map = {
        r'AMZN|AMAZON': 'Amazon',
        r'WHOLEFDS|WHOLE FOODS': 'Whole Foods',
        r'STARBUCKS': 'Starbucks',
        r'MCDONALD': "McDonald's",
        r'NETFLIX': 'Netflix',
        r'SPOTIFY': 'Spotify',
        r'APPLE\.COM|APPLE STORE': 'Apple',
        r'UBER EATS': 'Uber Eats',
        r'DOORDASH': 'DoorDash',
        r'GRUBHUB': 'Grubhub',
        r'WAL-MART|WALMART': 'Walmart',
        r'TARGET': 'Target',
        r'COSTCO': 'Costco',
        r'CVS': 'CVS',
        r'WALGREEN': 'Walgreens',
    }
    
    upper_name = raw_name.upper()
    for pattern, clean_name in merchant_map.items():
        if re.search(pattern, upper_name):
            return clean_name
    
    cleaned = re.sub(r'\*[A-Z0-9]+', '', raw_name)
    cleaned = re.sub(r'#\d+', '', cleaned)
    cleaned = ' '.join(cleaned.split())
    cleaned = cleaned.title()
    
    return cleaned.strip()


def parse_transactions(text: str) -> List[Transaction]:

    transactions = []
    lines = text.split('\n')

    pattern_1 = re.compile(
        r'(\d{2}/\d{2}/\d{4})'  # Date: MM/DD/YYYY
        r'\s+'                   # One or more spaces/tabs
        r'([A-Z][A-Z0-9\s\*\#\.\-]+?)'  # Merchant: starts with capital, allows numbers/symbols
        r'\s+'
        r'(\d+\.\d{2})'          # Amount: digits.decimals
        r'\s*$'                  # End of line (with optional trailing space)
    )
    

    pattern_2 = re.compile(
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})'
        r'\s+'
        r'([A-Z][A-Z0-9\s\*\#\.\-]+?)'
        r'\s+'
        r'(\d+\.\d{2})'
        r'\s*$'
    )
    
    pattern_3 = re.compile(
        r'(\d{4}-\d{2}-\d{2})'
        r'\s+'
        r'([A-Z][A-Z0-9\s\*\#\.\-]+?)'
        r'\s+'
        r'(\d+\.\d{2})'
        r'\s*$'
    )
    
    for line in lines:
        line = line.strip()
        if not line:
            continue  
        
        skip_keywords = [
            'BALANCE', 'TOTAL', 'BEGINNING', 'ENDING', 
            'DATE', 'DESCRIPTION', 'AMOUNT', 'STATEMENT'
        ]
        if any(keyword in line.upper() for keyword in skip_keywords):
            continue
        
        matched = False
        
        m = pattern_1.match(line)
        if m:
            date_str, raw_merchant, amount_str = m.group(1), m.group(2), m.group(3)
            transactions.append(Transaction(
                merchant=clean_merchant_name(raw_merchant),
                amount=float(amount_str),
                date=date_str,
                description=line,
                transaction_type="debit" 
            ))
            matched = True
        
        if not matched:
            m = pattern_2.match(line)
            if m:
                month, day, raw_merchant, amount_str = m.group(1), m.group(2), m.group(3), m.group(4)
                date_str = f"{month} {day}"
                transactions.append(Transaction(
                    merchant=clean_merchant_name(raw_merchant),
                    amount=float(amount_str),
                    date=date_str,
                    description=line,
                    transaction_type="debit"
                ))
                matched = True
        
        if not matched:
            m = pattern_3.match(line)
            if m:
                date_str, raw_merchant, amount_str = m.group(1), m.group(2), m.group(3)
                transactions.append(Transaction(
                    merchant=clean_merchant_name(raw_merchant),
                    amount=float(amount_str),
                    date=date_str,
                    description=line,
                    transaction_type="debit"
                ))
    
    return transactions


def classify_transaction_type(amount: float, description: str) -> str:
    description_upper = description.upper()
    
    credit_keywords = [
        'DEPOSIT', 'PAYROLL', 'DIRECT DEP', 'REFUND', 
        'CREDIT', 'TRANSFER IN', 'RETURN'
    ]
    
    if any(keyword in description_upper for keyword in credit_keywords):
        return "credit"
    
    return "debit"


def process_bank_statement(pdf_path: str) -> ProcessedStatement:
    
    raw_text = extract_text_from_pdf(pdf_path)
    
    transactions = parse_transactions(raw_text)
    
    for t in transactions:
        t.transaction_type = classify_transaction_type(t.amount, t.description)
    
    debits = [t for t in transactions if t.transaction_type == "debit"]
    
    total_spent = sum(t.amount for t in debits)
    
    if transactions:
        dates = [t.date for t in transactions]
        date_range = f"{dates[0]} - {dates[-1]}"
    else:
        date_range = None
    
    return ProcessedStatement(
        transactions=transactions,
        total_spent=round(total_spent, 2),
        transaction_count=len(transactions),
        date_range=date_range
    )
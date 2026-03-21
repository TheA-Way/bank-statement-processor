# app/database.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor 
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        os.getenv("DATABASE_URL"),
        cursor_factory=RealDictCursor
    )


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS statements (
            id SERIAL PRIMARY KEY,
            uploaded_at TIMESTAMP DEFAULT NOW(),
            filename VARCHAR(255),
            total_spent DECIMAL(10, 2),
            transaction_count INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            statement_id INTEGER REFERENCES statements(id) ON DELETE CASCADE,
            merchant VARCHAR(255),
            amount DECIMAL(10, 2),
            date VARCHAR(50),
            description TEXT,
            transaction_type VARCHAR(10)
        );
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
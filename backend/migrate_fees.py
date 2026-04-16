from app.core.database import engine
from sqlalchemy import text

def migrate():
    print("--- Starting Migration: Add credit_balance to fees ---")
    
    with engine.connect() as conn:
        try:
            # Check if column already exists (PostgreSQL syntax)
            check_sql = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='fees' AND column_name='credit_balance'
            """)
            res = conn.execute(check_sql).fetchone()
            
            if not res:
                print("[INFO] Adding column 'credit_balance'...")
                conn.execute(text("ALTER TABLE fees ADD COLUMN credit_balance INTEGER DEFAULT 0"))
                conn.commit()
                print("[OK] Column added successfully.")
            else:
                print("[SKIP] Column 'credit_balance' already exists.")
                
        except Exception as e:
            print(f"[ERROR] Migration failed: {e}")

if __name__ == "__main__":
    migrate()

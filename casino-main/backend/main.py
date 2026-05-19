import sqlite3
import secrets
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from logger import log

app = FastAPI(title="Casino API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYMBOLS = ['<3', '-_-', '{}', '7']

def init_db():
    conn = sqlite3.connect('casino.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            balance INTEGER NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game TEXT NOT NULL,
            bet INTEGER NOT NULL,
            win INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    ''')

    cursor.execute('SELECT balance FROM users WHERE id = 1')
    if not cursor.fetchone():
        cursor.execute('INSERT INTO users (id, balance) VALUES (1, 100)')
        
    conn.commit()
    conn.close()

init_db()

def get_balance():
    conn = sqlite3.connect('casino.db')
    cursor = conn.cursor()
    cursor.execute('SELECT balance FROM users WHERE id = 1')
    balance = cursor.fetchone()[0]
    conn.close()
    return balance

def update_balance(amount):
    conn = sqlite3.connect('casino.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET balance = balance + ? WHERE id = 1', (amount,))
    conn.commit()
    conn.close()

def save_game(game: str, bet: int, win: int):
    conn = sqlite3.connect('casino.db')
    cursor = conn.cursor()
    date_str = datetime.utcnow().isoformat() + "Z"
    cursor.execute('INSERT INTO history (game, bet, win, date) VALUES (?, ?, ?, ?)', (game, bet, win, date_str))
    conn.commit()
    conn.close()

class SpinRequest(BaseModel):
    bet: int

class DiceRequest(BaseModel):
    bet: int
    guess: int

@app.get("/api/balance")
async def api_get_balance():
    bal = get_balance()
    return {"balance": bal, "new_balance": bal}

@app.post("/api/slots/spin")
async def spin_slots(request: SpinRequest):
    bet = request.bet
    if bet <= 0: raise HTTPException(status_code=400, detail="Invalid bet")
    if get_balance() < bet: raise HTTPException(status_code=400, detail="Not enough balance")
        
    update_balance(-bet) 
    
    w1, w2, w3 = secrets.choice(SYMBOLS), secrets.choice(SYMBOLS), secrets.choice(SYMBOLS)
    multiplier = 7 if w1 == w2 == w3 else (2 if w1 == w2 or w2 == w3 or w1 == w3 else 0)
    win_amount = bet * multiplier
    
    if win_amount > 0: 
        update_balance(win_amount)
        
    save_game("Slots", bet, win_amount)
    
    return {
        "wheels": [w1, w2, w3],
        "win_amount": win_amount,
        "multiplier": multiplier,
        "new_balance": get_balance()
    }

@app.post("/api/dice/roll")
@log(level="INFO", format_json=False)
async def roll_dice(request: DiceRequest):
    bet, guess = request.bet, request.guess
    if bet <= 0 or not (1 <= guess <= 6): raise HTTPException(status_code=400, detail="Invalid data")
    if get_balance() < bet: raise HTTPException(status_code=400, detail="Not enough balance")
        
    update_balance(-bet)
    
    roll = secrets.choice([1, 2, 3, 4, 5, 6])
    win_amount = bet * 6 if roll == guess else 0
    
    if win_amount > 0: 
        update_balance(win_amount)
        
    save_game("Dice", bet, win_amount)
    
    return {"roll": roll, "win_amount": win_amount, "new_balance": get_balance()}


@app.get("/api/history")
async def get_history(limit: int = 10, offset: int = 0):
    conn = sqlite3.connect('casino.db')
    cursor = conn.cursor()
    cursor.execute('SELECT game, bet, win, date FROM history ORDER BY id DESC LIMIT ? OFFSET ?', (limit, offset))
    rows = cursor.fetchall()
    conn.close()
    
    return [{"game": r[0], "result": {"bet": r[1], "win": r[2]}, "date": r[3]} for r in rows]

@app.post("/api/deposit")
async def deposit():
    update_balance(100)
    return {"new_balance": get_balance()}


security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != "my-secret-api-token":
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    return credentials.credentials

@app.get("/api/balance", dependencies=[Depends(verify_token)])
@log(level="INFO", format_json=True)
async def api_get_balance():
    bal = get_balance()
    return {"balance": bal, "new_balance": bal}

@app.post("/api/slots/spin", dependencies=[Depends(verify_token)])
@log(level="INFO", format_json=False)
async def spin_slots(request: SpinRequest):
    bet = request.bet
    if bet <= 0: raise HTTPException(status_code=400, detail="Invalid bet")
    if get_balance() < bet: raise HTTPException(status_code=400, detail="Not enough balance")
        
    update_balance(-bet) 
    
    w1, w2, w3 = secrets.choice(SYMBOLS), secrets.choice(SYMBOLS), secrets.choice(SYMBOLS)
    multiplier = 7 if w1 == w2 == w3 else (2 if w1 == w2 or w2 == w3 or w1 == w3 else 0)
    win_amount = bet * multiplier
    
    if win_amount > 0: 
        update_balance(win_amount)
        
    save_game("Slots", bet, win_amount)
    
    return {
        "wheels": [w1, w2, w3],
        "win_amount": win_amount,
        "multiplier": multiplier,
        "new_balance": get_balance()
    }
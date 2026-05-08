import secrets
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Casino API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYMBOLS = ['<3', '-_-', '{}', '7']

user_session = {
    "balance": 100
}

class SpinRequest(BaseModel):
    bet: int

class SpinResponse(BaseModel):
    wheels: list[str]
    win_amount: int
    multiplier: int
    new_balance: int

def calculate_multiplier(r1: str, r2: str, r3: str) -> int:
    if r1 == r2 == r3:
        return 7
    if r1 == r2 or r2 == r3 or r1 == r3:
        return 2
    return 0

@app.post("/api/slots/spin", response_model=SpinResponse)
async def spin_slots(request: SpinRequest):
    bet = request.bet

    if bet <= 0:
        raise HTTPException(status_code=400, detail="Invalid bet amount")
    if user_session["balance"] < bet:
        raise HTTPException(status_code=400, detail="Not enough balance")

    user_session["balance"] -= bet

    wheel1 = secrets.choice(SYMBOLS)
    wheel2 = secrets.choice(SYMBOLS)
    wheel3 = secrets.choice(SYMBOLS)

    multiplier = calculate_multiplier(wheel1, wheel2, wheel3)
    win_amount = bet * multiplier

    user_session["balance"] += win_amount
    
    return SpinResponse(
        wheels=[wheel1, wheel2, wheel3],
        win_amount=win_amount,
        multiplier=multiplier,
        new_balance=user_session["balance"]
    )

@app.get("/api/balance")
async def get_balance():
    return {"balance": user_session["balance"]}
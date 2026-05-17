const playDiceButton = document.getElementById('dice-gamble');
const diceResultText = document.getElementById('dice-result');
const diceText = document.getElementById('dice-text');
const dodepButton = document.getElementById('dodepNaBalik');
const dodepCase = document.getElementById('dodep');
const userBetInput = document.getElementById('user-bet');

async function syncBalance() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/balance');
        if (response.ok) {
            const data = await response.json();
            window.userBalance = typeof data.balance !== 'undefined' ? data.balance : data.new_balance;
        }
    } catch (e) {
        console.error("Cannot connect to server", e);
    }
}
syncBalance();

if (playDiceButton) playDiceButton.addEventListener('click', diceRoll);
if (dodepButton) dodepButton.addEventListener('click', dodepNaBalance);

async function diceRoll() {
    const diceBet = parseInt(userBetInput.value, 10);
    const selectedRadio = document.querySelector('input[name="dice-bet"]:checked');
    const selectedNumber = selectedRadio ? parseInt(selectedRadio.value, 10) : null;

    if (isNaN(diceBet) || diceBet <= 0) {
        diceText.textContent = 'Enter a valid bet amount!';
        return;
    }

    if (!selectedNumber) {
        diceText.textContent = 'Select a number to guess!';
        return;
    }

    if ((window.userBalance ?? 0) < diceBet) {
        diceText.textContent = 'Not enough balance!';
        dodepCase.style.display = 'block';
        return;
    }

    if (playDiceButton) playDiceButton.disabled = true;
    if (diceText) diceText.textContent = 'Rolling...';

    const rollInterval = setInterval(() => {
        if (diceResultText) diceResultText.textContent = Math.floor(Math.random() * 6) + 1;
    }, 100);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/dice/roll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bet: diceBet, guess: selectedNumber })
        });

        if (!response.ok) {
            clearInterval(rollInterval);
            diceResultText.textContent = '...';
            const errorData = await response.json();
            diceText.textContent = `Error: ${errorData.detail}`;
            
            if (response.status === 400 && errorData.detail === "Not enough balance") {
                dodepCase.style.display = 'block';
            }
            syncBalance(); 
            playDiceButton.disabled = false;
            return;
        }

        const data = await response.json();

        setTimeout(() => {
            clearInterval(rollInterval);
            if (diceResultText) diceResultText.textContent = `${data.roll}`;

            if (typeof data.new_balance !== 'undefined') {
                window.userBalance = data.new_balance;
            }

            if (diceText) {
                diceText.textContent = data.win_amount > 0 ? `Rolled ${data.roll}. You win ${data.win_amount}!` : `Rolled ${data.roll}. Try again?`;
            }
            if (playDiceButton) playDiceButton.disabled = false;
        }, 1000);

    } catch (error) {
        clearInterval(rollInterval);
        if (diceResultText) diceResultText.textContent = '...';
        if (diceText) diceText.textContent = "Server connection error.";
        console.error(error);
        syncBalance();
        if (playDiceButton) playDiceButton.disabled = false;
    }
}

async function dodepNaBalance() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/deposit', { method: 'POST' });
        if (response.ok) {
            const data = await response.json();
            if (typeof data.new_balance !== 'undefined') window.userBalance = data.new_balance;
            if (dodepCase) dodepCase.style.display = 'none';
            if (diceText) diceText.textContent = 'Balance topped up! Place your bets.';
        }
    } catch (error) {
        console.error("Deposit error:", error);
    }
}
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
            if (window.saveBalance) window.saveBalance(data.balance);
        }
    } catch (e) {
        console.error("Cannot connect to server", e);
    }
}
syncBalance();

playDiceButton.addEventListener('click', diceRoll);
dodepButton.addEventListener('click', dodepNaBalance);

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

    playDiceButton.disabled = true;
    diceText.textContent = 'Rolling...';

    if (window.saveBalance) window.saveBalance(window.userBalance - diceBet);

    const rollInterval = setInterval(() => {
        diceResultText.textContent = Math.floor(Math.random() * 6) + 1;
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
            diceResultText.textContent = `${data.roll}`;

            if (window.saveBalance) window.saveBalance(data.new_balance);

            if (data.win_amount > 0) {
                diceText.textContent = `Rolled ${data.roll}. You win ${data.win_amount}!`;
            } else {
                diceText.textContent = `Rolled ${data.roll}. Try again?`;
            }
            
            playDiceButton.disabled = false;
        }, 1000);

    } catch (error) {
        clearInterval(rollInterval);
        diceResultText.textContent = '...';
        diceText.textContent = "Server connection error.";
        console.error(error);
        syncBalance();
        playDiceButton.disabled = false;
    }
}

async function dodepNaBalance() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/deposit', { method: 'POST' });
        if (response.ok) {
            const data = await response.json();
            if (window.saveBalance) window.saveBalance(data.new_balance);
            dodepCase.style.display = 'none';
            diceText.textContent = 'Balance topped up! Place your bets.';
        }
    } catch (error) {
        console.error("Deposit error:", error);
    }
}
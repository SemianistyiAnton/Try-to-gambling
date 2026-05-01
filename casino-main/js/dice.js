import { addGameResult } from './db.js';

const playDiceButton = document.getElementById('dice-gamble');
const diceResultText = document.getElementById('dice-result');
const diceText = document.getElementById('dice-text');
const dodepButton = document.getElementById('dodepNaBalik');
const dodepCase = document.getElementById('dodep');
const userBetInput = document.getElementById('user-bet');

// ensure global balance helpers are initialized
if (window.loadBalance) window.loadBalance();
if (window.updateBalanceDisplay) window.updateBalanceDisplay();

playDiceButton.addEventListener('click', diceRoll);
dodepButton.addEventListener('click', dodepNaBalance);

async function diceRoll() {
    const diceBet = parseInt(userBetInput.value, 10);

    if (isNaN(diceBet) || diceBet <= 0) {
        diceText.textContent = 'Enter a valid bet amount!';
        return;
    }

    const balance = window.userBalance ?? 0;

    if (balance < diceBet) {
        diceText.textContent = 'Not enough balance!';
        dodepCase.style.display = 'block';
        return;
    }

    playDiceButton.disabled = true;
    if (window.saveBalance) window.saveBalance(balance - diceBet);
    if (window.updateBalanceDisplay) window.updateBalanceDisplay();

    diceText.textContent = 'Rolling...';
    diceResultText.textContent = '...';

    const selectedRadio = document.querySelector('input[name="dice-bet"]:checked');
    const selectedNumber = selectedRadio ? parseInt(selectedRadio.value, 10) : null;

    await new Promise(resolve => setTimeout(resolve, 500));

    const rollResult = Math.floor(Math.random() * 6) + 1;
    diceResultText.textContent = `${rollResult}`;

    let winAmount = 0;

    if (rollResult === selectedNumber) {
        winAmount = diceBet * 6;
        diceText.textContent = `Rolled ${rollResult}. You win!`;
        if (window.saveBalance) window.saveBalance((window.userBalance ?? 0) + winAmount);
        if (window.updateBalanceDisplay) window.updateBalanceDisplay();
    } else {
        diceText.textContent = `Rolled ${rollResult}. Try again?`;
    }

    await addGameResult('Dice', { bet: diceBet, win: winAmount });

    playDiceButton.disabled = false;
}

function dodepNaBalance() {
    const balance = window.userBalance ?? 0;
    if (window.saveBalance) window.saveBalance(balance + 100);
    if (window.updateBalanceDisplay) window.updateBalanceDisplay();
    dodepCase.style.display = 'none';
    diceText.textContent = 'Balance topped up! Place your bets.';
}


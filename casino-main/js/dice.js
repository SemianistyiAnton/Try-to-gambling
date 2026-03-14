const playDiceButton = document.getElementById("dice-gamble");
const diceResultText = document.getElementById("dice-result"); 
const diceText = document.getElementById("dice-text");
const dodepButton = document.getElementById("dodepNaBalik");
const dodepCase = document.getElementById("dodep");
const userBetInput = document.getElementById("user-bet"); 

loadBalance();
updateBalanceDisplay();

playDiceButton.addEventListener("click", diceRoll);
dodepButton.addEventListener("click", dodepNaBalance);

function diceRoll() {
    const diceBet = parseInt(userBetInput.value);

    if (isNaN(diceBet) || diceBet <= 0) {
        diceText.textContent = "Enter a valid bet amount!";
        return; 
    }

    if (userBalance < diceBet) {
        diceText.textContent = "Not enough balance!";
        dodepCase.style.display = "block";
        return;
    }

    playDiceButton.disabled = true;
    saveBalance(userBalance - diceBet);
    updateBalanceDisplay();

    diceText.textContent = "Rolling...";
    diceResultText.textContent = "...";

    const selectedRadio = document.querySelector('input[name="dice-bet"]:checked');
    const selectedNumber = parseInt(selectedRadio.value);

    setTimeout(() => {
        let rollResult = Math.floor(Math.random() * 6) + 1;
        diceResultText.textContent = `${rollResult}`;

        if (rollResult === selectedNumber) {
            diceText.textContent = `Rolled ${rollResult}. You win!`;
            saveBalance(userBalance + (diceBet * 6));
            updateBalanceDisplay();
        } else {
            diceText.textContent = `Rolled ${rollResult}. Try again?`;
        }

        playDiceButton.disabled = false;
    }, 500);
}

function dodepNaBalance() {
    saveBalance(userBalance + 100);
    updateBalanceDisplay();
    dodepCase.style.display = "none";
    diceText.textContent = "Balance topped up! Place your bets.";
}
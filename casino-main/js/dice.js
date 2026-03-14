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
        diceText.textContent = "Депни как человек, чё это!";
        return; 
    }

    if (userBalance < diceBet) {
        diceText.textContent = "Маловато на балике!";
        dodepCase.style.display = "block";
        return;
    }

    playDiceButton.disabled = true;
    saveBalance(userBalance - diceBet);
    updateBalanceDisplay();

    diceText.textContent = "Крутка";
    diceResultText.textContent = "...";

    const selectedRadio = document.querySelector('input[name="dice-bet"]:checked');
    const selectedNumber = parseInt(selectedRadio.value);

    setTimeout(() => {
        let rollResult = Math.floor(Math.random() * 6) + 1;
        diceResultText.textContent = `${rollResult}`;

        if (rollResult === selectedNumber) {
            diceText.textContent = `Выпало ${rollResult}. Победа!`;
            saveBalance(userBalance + (diceBet * 6));
            updateBalanceDisplay();
        } else {
            diceText.textContent = `Выпало ${rollResult}. Ещё разок?`;
        }

        playDiceButton.disabled = false;
    }, 500);
}

function dodepNaBalance() {
    saveBalance(userBalance + 100);
    updateBalanceDisplay();
    dodepCase.style.display = "none";
    diceText.textContent = "Ломбард озолотился! Делайте ставки.";
}
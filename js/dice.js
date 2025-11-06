const balance = document.getElementById("balance");
const playDiceButton = document.getElementById("dice-gamble");
const diceRusultText = document.getElementById("dice-result");
const diseText = document.getElementById("dice-text");
const userNumnerChoice = document.getElementById("bet-selection");
const dodepButton = document.getElementById("dodepNaBalik");
const dodepCase = document.getElementById("dodep");

const diceBet = 15;

playDiceButton.addEventListener("click", diceRoll);
dodepButton.addEventListener("click", dodepNaBalance)

loadBalance();
updateBalanceDisplay();


function diceRoll() {
    playDiceButton.disabled = true;

    const selectedBet = document.querySelector('input[name="dice-bet"]:checked');
    const selectedBetNumber = parseInt(selectedBet.value);

    if (userBalance < diceBet) {
        diseText.textContent = "deneg.net";
        playDiceButton.disabled = false; 
        dodepCase.style.display = "block";
    } else {
        saveBalance(userBalance - diceBet); 
        updateBalanceDisplay();

        diseText.textContent = "in progress";
        diceRusultText.textContent = "..."; 

        setTimeout(() => {
            let rollResult = Math.floor(Math.random()*6) + 1;
            diceRusultText.textContent = `${rollResult}`;
            if (rollResult === selectedBetNumber) {
                diseText.textContent = "soo... U win"; 
                saveBalance(userBalance + (5 * diceBet));
                updateBalanceDisplay();
            } else {
                diseText.textContent = "Lol U lose";
            }
            playDiceButton.disabled = false;
        }, 500);
    }
}

function dodepNaBalance() {
    saveBalance(userBalance + 100); 
    updateBalanceDisplay();
    dodepCase.style.display = "none";
}
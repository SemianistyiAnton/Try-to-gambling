const balance = document.getElementById("balance");
const playDiceButton = document.getElementById("dice-gamble");
const diceRusultText = document.getElementById("dice-result");
const diseText = document.getElementById("dice-text");
const userNumnerChoice = document.getElementById("bet-selection");
const dodepButton = document.getElementById("dodepNaBalik");
const dodepCase = document.getElementById("dodep");

let userBalance = 100;
const diceBet = 15;

playDiceButton.addEventListener("click", diceRoll);

function diceRoll() {
    playDiceButton.disabled = true;

    const selectedBet = document.querySelector('input[name="dice-bet"]:checked');
    const selectedBetString = selectedBet.value;

    if (userBalance < diceBet) {
        diseText.textContent = "deneg.net";
        playDiceButton.disabled = false; 
        dodepCase.style.display = "block";
        dodepButton.addEventListener("click", dodepNaBalance)
    } else {
        userBalance -= diceBet;
        balance.textContent = `Balance: ${userBalance}`;
        diseText.textContent = "in progress";
        diceRusultText.textContent = "..."; 

        setTimeout(() => {
            let rollResult = Math.floor(Math.random()*6) + 1;
            diceRusultText.textContent = `${rollResult}`;
            if (rollResult == selectedBetString) {
                diseText.textContent = "soo... U win"; 
                userBalance += 5*diceBet;
                balance.textContent = `Balance: ${userBalance}`;
            } else {
                diseText.textContent = "Lol U lose";
            }
            playDiceButton.disabled = false;
        }, 500);
    }
}

function dodepNaBalance() {
    userBalance += 100;
    balance.textContent = `Balance: ${userBalance}`;
    dodepCase.style.display = "none";
}
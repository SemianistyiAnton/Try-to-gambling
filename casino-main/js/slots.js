import { addGameResult } from './db.js'; 

const playButton = document.getElementById("gamble");
const resultText = document.getElementById("gamle-result");
const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");
const wheel3 = document.getElementById("wheel3");
const spinBetInput = document.getElementById("user-bet");

const symbols = ['<3', '-_-', '{}', '7']; 

let spinValve;
let stopStep = 0;
let spinInterval;

if (window.loadBalance) window.loadBalance();
if (window.updateBalanceDisplay) window.updateBalanceDisplay();

playButton.addEventListener("click", rungame);

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function rungame() {
    spinValve = parseInt(spinBetInput.value);

    if (isNaN(spinValve) || spinValve <= 0) {
        resultText.textContent = "Invalid bet!";
        return;
    }

    const currentBalance = window.userBalance ?? 0;

    if (currentBalance < spinValve) {
        resultText.textContent = "Not enough balance";
        return;
    }

    playButton.disabled = true;
    if (window.saveBalance) window.saveBalance(currentBalance - spinValve);
    if (window.updateBalanceDisplay) window.updateBalanceDisplay();
    
    resultText.textContent = "Good luck!";

    stopStep = 0;
    spinInterval = setInterval(wheelAnimation, 100);

    setTimeout(() => {
        stopStep = 1;
        let val1 = randomSymbol();
        wheel1.textContent = val1;

        setTimeout(() => {
            stopStep = 2;
            let val2 = randomSymbol();
            wheel2.textContent = val2;

            setTimeout(() => {
                stopStep = 3;
                let val3 = randomSymbol();
                wheel3.textContent = val3;

                clearInterval(spinInterval);

                checkWin(val1, val2, val3);
                playButton.disabled = false;

            }, 1000);
        }, 1000);
    }, 1000);
}

function wheelAnimation() {
    if (stopStep === 0) {
        wheel1.textContent = randomSymbol();
        wheel2.textContent = randomSymbol();
        wheel3.textContent = randomSymbol();
    }
    else if (stopStep === 1) {
        wheel2.textContent = randomSymbol();
        wheel3.textContent = randomSymbol();
    }
    else if (stopStep === 2) {
        wheel3.textContent = randomSymbol();
    }
}

function multiplier(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        return 7;
    }
    if (r1 === r2 || r2 === r3 || r1 === r3) {
        return 2;
    }
    return 0;
}

let preInitial;

async function checkWin(r1, r2, r3) {
    if (!preInitial) {
        preInitial = window.memo ? window.memo(multiplier, 10) : multiplier;
    }

    const currentMultiplier = preInitial(r1, r2, r3);
    let winAmount = 0; 

    if (currentMultiplier === 7) {
        winAmount = spinValve * 7;
        resultText.textContent = "JACKPOT!!! x7";
        if (window.saveBalance) window.saveBalance((window.userBalance ?? 0) + winAmount); 
        
        if (window.colorGenerator && window.timeoutConsumer) {
            const colorsGen = window.colorGenerator(['gold', 'red', 'magenta', 'lime', 'cyan']);
            window.timeoutConsumer(colorsGen, 3, (color) => {
                if (color === "") {
                    resultText.style.color = "black";
                } else {
                    resultText.style.color = color;
                }
            });
        }
    }
    else if (currentMultiplier === 2) {
        winAmount = spinValve * 2;
        resultText.textContent = "Matched pair! x2";
        if (window.saveBalance) window.saveBalance((window.userBalance ?? 0) + winAmount);
    } 
    else {
        resultText.textContent = "You lost. Try again!";
    }
    
    if (window.updateBalanceDisplay) window.updateBalanceDisplay();


    await addGameResult('Slots', { bet: spinValve, win: winAmount });
}
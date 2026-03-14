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

loadBalance();
updateBalanceDisplay();

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

    if (userBalance < spinValve) {
        resultText.textContent = "Not enough balance";
        return;
    }

    playButton.disabled = true;
    saveBalance(userBalance - spinValve);
    updateBalanceDisplay();
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

                /*val1 = '<3';
                val2 = '<3';
                val3 = '<3';*/

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

function checkWin(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        resultText.textContent = "JACKPOT!!! x7";
        saveBalance(userBalance + (spinValve * 7)); 
        const colors = window.colorGenerator(['gold', 'red', 'magenta', 'lime', 'cyan']);
        window.timeoutConsumer(colors, 3, (colors) => {
            if (colors === "") {
                resultText.style.color = "black";
            } else {
                resultText.style.color = colors;
            }
        });
    }
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        resultText.textContent = "Matched pair! x2";
        saveBalance(userBalance + (spinValve * 2));
    } 
    else {
        resultText.textContent = "You lost. Try again!";
    }
    updateBalanceDisplay();
}
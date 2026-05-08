import { addGameResult } from './db.js'; 

const playButton = document.getElementById("gamble");
const resultText = document.getElementById("gamle-result");
const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");
const wheel3 = document.getElementById("wheel3");
const spinBetInput = document.getElementById("user-bet");

const symbols = ['<3', '-_-', '{}', '7']; 

let spinInterval;

async function syncBalance() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/balance');
        if (response.ok) {
            const data = await response.json();
            if (window.saveBalance) window.saveBalance(data.balance);
            if (window.updateBalanceDisplay) window.updateBalanceDisplay();
        }
    } catch (e) {
        console.error("Cannot connect to server for balance sync", e);
    }
}

syncBalance();

playButton.addEventListener("click", rungame);

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function startFakeAnimation() {
    spinInterval = setInterval(() => {
        wheel1.textContent = randomSymbol();
        wheel2.textContent = randomSymbol();
        wheel3.textContent = randomSymbol();
    }, 100);
}

async function rungame() {
    const spinValve = parseInt(spinBetInput.value);

    if (isNaN(spinValve) || spinValve <= 0) {
        resultText.textContent = "Invalid bet!";
        return;
    }

    playButton.disabled = true;
    resultText.textContent = "Connecting to server...";
    resultText.style.color = "black";

    try {
        const response = await fetch('http://127.0.0.1:8000/api/slots/spin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bet: spinValve })
        });

        if (!response.ok) {
            const errorData = await response.json();
            resultText.textContent = `Error: ${errorData.detail || 'Server error'}`;
            playButton.disabled = false;
            return;
        }

        const data = await response.json();

        resultText.textContent = "Spinning...";
        startFakeAnimation();

        setTimeout(async () => {
            clearInterval(spinInterval);

            wheel1.textContent = data.wheels[0];
            wheel2.textContent = data.wheels[1];
            wheel3.textContent = data.wheels[2];

            if (window.saveBalance) window.saveBalance(data.new_balance);
            if (window.updateBalanceDisplay) window.updateBalanceDisplay();

            if (data.multiplier === 7) {
                resultText.textContent = "JACKPOT!!! x7";
                triggerJackpotAnimation();
            } else if (data.multiplier === 2) {
                resultText.textContent = "Matched pair! x2";
            } else {
                resultText.textContent = "You lost. Try again!";
            }

            await addGameResult('Slots', { bet: spinValve, win: data.win_amount });
            
            playButton.disabled = false;
        }, 1500);

    } catch (error) {
        resultText.textContent = "Network error. Is the server running?";
        console.error(error);
        playButton.disabled = false;
    }
}

function triggerJackpotAnimation() {
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
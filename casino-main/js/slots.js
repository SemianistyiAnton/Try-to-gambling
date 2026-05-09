const playButton = document.getElementById("gamble");
const resultText = document.getElementById("gamle-result");
const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");
const wheel3 = document.getElementById("wheel3");
const spinBetInput = document.getElementById("user-bet");

const symbols = ['<3', '-_-', '{}', '7']; 

async function syncBalance() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/balance');
        if (response.ok) {
            const data = await response.json();
            if (window.saveBalance) window.saveBalance(data.balance);
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

async function rungame() {
    const spinValve = parseInt(spinBetInput.value);

    if (isNaN(spinValve) || spinValve <= 0) {
        resultText.textContent = "Invalid bet!";
        return;
    }

    if ((window.userBalance ?? 0) < spinValve) {
        resultText.textContent = "Not enough balance";
        return;
    }

    playButton.disabled = true;
    resultText.textContent = "Spinning...";
    resultText.style.color = "black";

    if (window.saveBalance) window.saveBalance(window.userBalance - spinValve);

    let stopStep = 0;
    const spinInterval = setInterval(() => {
        if (stopStep === 0) {
            wheel1.textContent = randomSymbol();
            wheel2.textContent = randomSymbol();
            wheel3.textContent = randomSymbol();
        } else if (stopStep === 1) {
            wheel2.textContent = randomSymbol();
            wheel3.textContent = randomSymbol();
        } else if (stopStep === 2) {
            wheel3.textContent = randomSymbol();
        }
    }, 100);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        const response = await fetch('http://127.0.0.1:8000/api/slots/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bet: spinValve })
        });

        if (!response.ok) {
            clearInterval(spinInterval);
            const errorData = await response.json();
            resultText.textContent = `Error: ${errorData.detail || 'Server error'}`;
            syncBalance(); 
            playButton.disabled = false;
            return;
        }

        const data = await response.json();

        setTimeout(() => {
            stopStep = 1;
            wheel1.textContent = data.wheels[0];

            setTimeout(() => {
                stopStep = 2;
                wheel2.textContent = data.wheels[1];

                setTimeout(() => {
                    stopStep = 3;
                    wheel3.textContent = data.wheels[2];
                    clearInterval(spinInterval);

                    if (window.saveBalance) window.saveBalance(data.new_balance);

                    if (data.multiplier === 7) {
                        resultText.textContent = "JACKPOT!!! x7";
                        triggerJackpotAnimation();
                    } else if (data.multiplier === 2) {
                        resultText.textContent = "Matched pair! x2";
                    } else {
                        resultText.textContent = "You lost. Try again!";
                    }
                    
                    playButton.disabled = false;
                }, 500); 
            }, 500); 
        }, 500);

    } catch (error) {
        clearInterval(spinInterval);
        resultText.textContent = "Network error. Is the server running?";
        console.error(error);
        syncBalance(); 
        playButton.disabled = false;
    }
}

function triggerJackpotAnimation() {
    if (window.colorGenerator && window.timeoutConsumer) {
        const colorsGen = window.colorGenerator(['gold', 'red', 'magenta', 'lime', 'cyan']);
        window.timeoutConsumer(colorsGen, 3, (color) => {
            resultText.style.color = color === "" ? "black" : color;
        });
    }
}
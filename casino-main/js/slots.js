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
    const currentBalance = window.userBalance || 0; 

    if (isNaN(spinValve) || spinValve <= 0) {
        resultText.textContent = "Invalid bet!";
        return;
    }

    if (currentBalance < spinValve) {
        resultText.textContent = "Not enough balance";
        return;
    }

    playButton.disabled = true;
    resultText.textContent = "Spinning...";
    resultText.style.color = "white";

    wheel1.classList.add('spinning');
    wheel2.classList.add('spinning');
    wheel3.classList.add('spinning');

    if (window.saveBalance) window.saveBalance(currentBalance - spinValve);

    let spinning = [true, true, true];
    let tickCount = 0;
    
    const spinInterval = setInterval(() => {
        tickCount++;
        if (spinning[0]) wheel1.textContent = randomSymbol();
        if (spinning[1]) wheel2.textContent = randomSymbol();
        if (spinning[2]) wheel3.textContent = randomSymbol();
    }, 50);

    try {
        
        const [response] = await Promise.all([
            fetch('http://127.0.0.1:8000/api/slots/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bet: spinValve })
            }),
            new Promise(resolve => setTimeout(resolve, 2500))
        ]);

        if (!response.ok) {
            console.warn(`[${Date.now() - startTime}ms] status ${response.status}`);
            clearInterval(spinInterval);
            playButton.disabled = false;
            return;
        }

        const data = await response.json();
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        
        spinning[0] = false; wheel1.textContent = data.wheels[0];
        await delay(500); 

        spinning[1] = false; wheel2.textContent = data.wheels[1];
        await delay(500);

        spinning[2] = false; wheel3.textContent = data.wheels[2];
        
        clearInterval(spinInterval);

        await delay(2000);

        if (window.saveBalance) window.saveBalance(data.new_balance);
        resultText.textContent = data.multiplier > 0 ? `Win: x${data.multiplier}` : "You lost.";

    } catch (error) {
        clearInterval(spinInterval);
        resultText.textContent = "Network error / Exception";
        if (window.saveBalance) window.saveBalance((window.userBalance ?? 0) + spinValve); 
    } finally {
        playButton.disabled = false;
    }
}
function triggerJackpotAnimation() {
    if (window.colorGenerator && window.timeoutConsumer) {
        const colorsGen = window.colorGenerator(['gold', 'red', 'magenta', 'lime', 'cyan']);
        window.timeoutConsumer(colorsGen, 3, (color) => {
            resultText.style.color = color === "" ? "white" : color;
        });
    }
}
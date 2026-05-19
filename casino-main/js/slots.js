import { withLog } from 'casino-lib';

const playButton = document.getElementById("gamble");
const resultText = document.getElementById("gamle-result");
const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");
const wheel3 = document.getElementById("wheel3");
const spinBetInput = document.getElementById("user-bet");

const symbols = ['<3', '-_-', '{}', '7']; 

const executeBalanceSync = withLog({ level: 'ERROR' })(async () => {
    const response = await window.apiProxy.get('/api/balance');
    if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
    }
    return await response.json();
});

async function syncBalance() {
    try {
        const data = await executeBalanceSync();
        if (window.saveBalance && data) window.saveBalance(data.balance);
    } catch (e) {
        console.error("Cannot connect to server for balance sync", e);
    }
}

syncBalance();

if (playButton) {
    playButton.addEventListener("click", rungame);
} else {
    console.warn('Slots: play button not found (id="gamble").');
}

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

const executeSpinRequest = withLog({ level: 'INFO', formatJson: false })(async (spinValve) => {
    return await window.apiProxy.post('/api/slots/spin', { bet: spinValve });
});

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

    if (wheel1) wheel1.classList.add('spinning');
    if (wheel2) wheel2.classList.add('spinning');
    if (wheel3) wheel3.classList.add('spinning');

    const startTime = Date.now();

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
            executeSpinRequest(spinValve),
            new Promise(resolve => setTimeout(resolve, 2500))
        ]);

        if (!response.ok) {
            console.warn(`[${Date.now() - startTime}ms] status ${response.status}`);
            clearInterval(spinInterval);
            if (playButton) playButton.disabled = false;
            return;
        }

        const data = await response.json();
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        
        spinning[0] = false; if (wheel1) wheel1.textContent = data.wheels[0];
        await delay(500); 
        
        spinning[1] = false; if (wheel2) wheel2.textContent = data.wheels[1];
        await delay(500);

        spinning[2] = false; if (wheel3) wheel3.textContent = data.wheels[2];
        
        clearInterval(spinInterval);

        await delay(2000);

        if (window.saveBalance && typeof data.new_balance !== 'undefined') {
            window.saveBalance(data.new_balance);
        } else if (typeof data.new_balance !== 'undefined') {
            window.userBalance = data.new_balance;
        }

        if (resultText) {
            resultText.textContent = data.multiplier > 0 ? `Win: x${data.multiplier}` : "You lost.";
            resultText.style.color = data.multiplier > 0 ? 'lime' : 'white';
        }

    } catch (error) {
        clearInterval(spinInterval);
        if (resultText) resultText.textContent = "Network error / Exception";
        if (window.saveBalance) window.saveBalance((window.userBalance ?? 0) + spinValve);
    } finally {
        if (playButton) playButton.disabled = false;
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
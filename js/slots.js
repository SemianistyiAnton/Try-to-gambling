const playButton = document.getElementById("gamble");
const resultText = document.getElementById("gamle-result");
const balance = document.getElementById("balance");
const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");
const wheel3 = document.getElementById("wheel3");
const spinBet = document.getElementById("user-bet");

const symbols = ['UwU','-_-','^-^','7'];

let spinValve;
let stop = 0;
let spinInterval;
let finalWheelValues =[];

playButton.addEventListener("click", rungame);

loadBalance();
updateBalanceDisplay();

function rungame() {
    spinValve = parseInt(spinBet.value);
    if (spinValve<=0||isNaN(spinValve)) {
        resultText.textContent = "No no no";
    }
    else{
    playButton.disabled = true;
    if (userBalance < spinValve) {
        resultText.textContent = "credit beri";
        playButton.disabled = false;
    }
    else{
    saveBalance(userBalance - spinValve); 
    updateBalanceDisplay();
    resultText.textContent = "in progress";

    stop = 0;
    spinInterval = setInterval(whellAnimation, 100);
    finalWheelValues = [];
    setTimeout(() => {
        stop = 1;
        finalWheelValues[0] = randomSymbol();
        wheel1.textContent = finalWheelValues[0];
        setTimeout(() => {
            stop = 2;
            finalWheelValues[1] = randomSymbol();
            wheel2.textContent = finalWheelValues[1];
            setTimeout(() => {
                stop = 3;
                finalWheelValues[2] = randomSymbol();
                wheel3.textContent = finalWheelValues[2];
                winCheker(finalWheelValues);
                clearInterval(spinInterval)
                playButton.disabled = false;
            }, 1000);
        }, 1000);
    }, 1000);
    }
}
}

function randomSymbol() {
    let randomSymbol = Math.floor(Math.random()*symbols.length);
    return symbols[randomSymbol];
}

function winCheker(wheelResult){
    const r1 = wheelResult[0];
    const r2 = wheelResult[1];
    const r3 = wheelResult[2];

    if(r1 == r2 && r2 == r3){
        resultText.textContent = "JACPOT";
        saveBalance(userBalance + spinValve*7); 
        updateBalanceDisplay();
    }
    else if (r1 == r2 || r2 == r3 ||r1==r3) {
        resultText.textContent = "DoDep";
        saveBalance(userBalance + spinValve*2); 
        updateBalanceDisplay();
    }
    else{
        resultText.textContent = "U lose. Mb 1 more try?!)";
        updateBalanceDisplay();
    }
}

function whellAnimation() {
    if (stop === 0) { 
        wheel1.textContent = randomSymbol();
        wheel2.textContent = randomSymbol();
        wheel3.textContent = randomSymbol();
    } 
    else if (stop === 1) {
        wheel2.textContent = randomSymbol();
        wheel3.textContent = randomSymbol();
    } 
    else if (stop === 2) {
        wheel3.textContent = randomSymbol();
    }
}
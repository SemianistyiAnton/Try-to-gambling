const playButton = document.getElementById("gamble");
const resultText = document.getElementById("gamle-result");
const balance = document.getElementById("balance");
const wheel1 = document.getElementById("wheel1");
const wheel2 = document.getElementById("wheel2");
const wheel3 = document.getElementById("wheel3");

const symbols = ['UwU','-_-','^-^','7'];
let userBalance = 100;
const spinValve = 15;

playButton.addEventListener("click", rungame);

function rungame() {
    playButton.disabled = true;
    if (userBalance < spinValve) {
        resultText.textContent = "credit beri";
    }
    else{
    userBalance -= spinValve;
    balance.textContent = `Balance: ${userBalance}`;
    resultText.textContent = "in progress";

    wheel1.textContent = "spin))";
    wheel2.textContent = "spin))";
    wheel3.textContent = "spin))";

    setTimeout(() => {
        wheel1.textContent = randomSymbol();
        setTimeout(() => {
            wheel2.textContent = randomSymbol();
            setTimeout(() => {
                wheel3.textContent = randomSymbol();
                winCheker();
                playButton.disabled = false;
            }, 1000);
        }, 1000);
    }, 1000);
    }
}

function randomSymbol() {
    let randomSymbol = Math.floor(Math.random()*symbols.length);
    return symbols[randomSymbol];
}

function winCheker(){
    const r1 = wheel1.textContent;
    const r2 = wheel2.textContent;
    const r3 = wheel3.textContent;

    if(r1 == r2 && r2 == r3){
        resultText.textContent = "JACPOT";
        userBalance += spinValve*7;
        balance.textContent = `Balance: ${userBalance}`;
    }
    else if (r1 == r2 || r2 == r3 ||r1==r3) {
        resultText.textContent = "DoDep";
        userBalance += spinValve*2;
        balance.textContent = `Balance: ${userBalance}`;
    }
    else{
        resultText.textContent = "U lose. Mb 1 more try?!)";
        balance.textContent = `Balance: ${userBalance}`;
    }
}
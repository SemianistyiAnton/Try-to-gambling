let userBalance;

function loadBalance() {
    const savedBalance = localStorage.getItem('casinoBalance');
    if (savedBalance === null) {
        userBalance = 100; 
    } else {
        userBalance = parseInt(savedBalance);
    }
}

function saveBalance(newAmount) {
    userBalance = newAmount;
    localStorage.setItem('casinoBalance', userBalance.toString());
}

function updateBalanceDisplay() {
    const balanceElement = document.getElementById("balance");
    const maxBet = document.getElementById("user-bet");
    balanceElement.textContent = `Balance: ${userBalance}`;
    if (maxBet === null) {
        console.log("not bet on page");
    }
    else{
    maxBet.max = userBalance;
    }
}
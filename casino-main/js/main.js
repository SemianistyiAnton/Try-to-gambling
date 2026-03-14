let userBalance;

function loadBalance() {
    const savedBalance = localStorage.getItem('casinoBalance');
    if (savedBalance === null || isNaN(parseInt(savedBalance))) {
        userBalance = 100;
        saveBalance(100);
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
    if (balanceElement) {
        balanceElement.textContent = `Balance: ${userBalance}`;
    }

    const betInput = document.getElementById("user-bet");
    if (betInput) {
        betInput.max = userBalance;
        betInput.placeholder = `Max: ${userBalance}`;
    }
}
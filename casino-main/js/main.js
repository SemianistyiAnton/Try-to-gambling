function loadBalance() {
    const savedBalance = localStorage.getItem('casinoBalance');
    if (savedBalance === null || isNaN(parseInt(savedBalance))) {
        window.userBalance = 100; 
        saveBalance(100);
    } else {
        window.userBalance = parseInt(savedBalance);
    }
}

function saveBalance(newAmount) {
    window.userBalance = newAmount;
    localStorage.setItem('casinoBalance', window.userBalance.toString());
}

function updateBalanceDisplay() {
    const balanceElement = document.getElementById("balance");
    if (balanceElement) {
        balanceElement.textContent = `Balance: ${window.userBalance}`;
    }

    const betInput = document.getElementById("user-bet");
    if (betInput) {
        betInput.max = window.userBalance;
        betInput.placeholder = `Max: ${window.userBalance}`;
    }
}
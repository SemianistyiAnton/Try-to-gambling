
async function loadBalance() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/balance');
        if (response.ok) {
            const data = await response.json();
            window.userBalance = data.balance;
            updateBalanceDisplay();
        }
    } catch (e) {
        console.error("Failed to connect to server", e);
        window.userBalance = 0;
    }
}
function saveBalance(newAmount) {
    window.userBalance = newAmount;
    updateBalanceDisplay();
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
import { EventEmitter } from 'casino-lib';

window.casinoEvents = new EventEmitter();

let _userBalance = 100;

window.saveBalance = function(newAmount) {
    _userBalance = newAmount;
    window.casinoEvents.emit('balanceChanged', _userBalance);
};

Object.defineProperty(window, 'userBalance', {
    get: () => _userBalance,
    set: (val) => window.saveBalance(val)
});

const balanceElement = document.getElementById("balance");
const betInput = document.getElementById("user-bet");

if (balanceElement) {
    window.casinoEvents.on('balanceChanged', (newBalance) => {
        balanceElement.textContent = `Balance: ${newBalance}`;
    });
}

if (betInput) {
    window.casinoEvents.on('balanceChanged', (newBalance) => {
        betInput.max = newBalance;
        betInput.placeholder = `Max: ${newBalance}`;
    });
}
window.loadBalance = async function() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/balance');
        if (response.ok) {
            const data = await response.json();
            window.userBalance = data.balance !== undefined ? data.balance : data.new_balance;
        }
    } catch (e) {
        console.error("Failed to connect to server", e);
        window.userBalance = 0; 
    }
};

window.loadBalance();
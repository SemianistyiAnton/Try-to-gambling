import { EventEmitter } from 'casino-lib';

// 1. Инициализируем шину событий
window.casinoEvents = new EventEmitter();

// 2. Создаем реактивный баланс
let _userBalance = 100;

window.saveBalance = function(newAmount) {
    _userBalance = newAmount;
    // При любом изменении баланса кричим об этом всем подписчикам
    window.casinoEvents.emit('balanceChanged', _userBalance);
};

Object.defineProperty(window, 'userBalance', {
    get: () => _userBalance,
    set: (val) => window.saveBalance(val)
});

// 3. Подписываем элементы интерфейса напрямую (без DOMContentLoaded)
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

// 4. Функция загрузки баланса
window.loadBalance = async function() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/balance');
        if (response.ok) {
            const data = await response.json();
            // Поддержка двух ключей ответа API на всякий случай
            window.userBalance = data.balance !== undefined ? data.balance : data.new_balance;
        }
    } catch (e) {
        console.error("Failed to connect to server", e);
        // Если сервер недоступен, ставим 0, чтобы реактивность сработала
        window.userBalance = 0; 
    }
};

// 5. Автоматически запрашиваем баланс при инициализации скрипта
window.loadBalance();
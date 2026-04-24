import { Leaderboard } from 'casino-lib';

const rawHistory = [
    { game: "Slots", bet: 100, win: 0 },
    { game: "Slots", bet: 50, win: 500 },
    { game: "Dice", bet: 200, win: 0 },
    { game: "Roulette", bet: 1000, win: 3500 },
    { game: "Slots", bet: 10, win: 20 }
];//Працюй мій маленький чат гпт. Перепрошую, що не зробив це з реальних результатів. Це лише демо варіант

let abortButton = null;

const btnLoad = document.getElementById('btn-load-top');
const btnCancel = document.getElementById('btn-cancel-top');
const statusText = document.getElementById('leaderboard-status');
const list = document.getElementById('leaderboard-list');

btnLoad.addEventListener('click', async () => {
    list.innerHTML = "";
    statusText.textContent = "server connect. Search invalid result";
    statusText.style.color = "black";
    btnLoad.disabled = true;
    btnCancel.disabled = false; 
    
    abortButton = new AbortController();
    
    try {
        const topPlayers = await Leaderboard(rawHistory, abortButton.signal);
        
        statusText.textContent = "Loaded";
        topPlayers.forEach(player => {
            const li = document.createElement('li');
            li.innerHTML = `<b>${player.gameName}</b>: amnt <span style="color: green;">+${player.prize}</span> (bet: ${player.betAmount})`;
            list.appendChild(li);
        });

    } catch (error) {
        statusText.textContent = `${error.message}`;
        statusText.style.color = "red";
    } finally {
        abortButton = null;
        btnLoad.disabled = false;
        btnCancel.disabled = true;
    }
});

btnCancel.addEventListener('click', () => {
    if (abortButton) {
        abortButton.abort(); 
    }
});
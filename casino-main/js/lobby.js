import { Leaderboard } from 'casino-lib';
import { getGameHistory } from './db.js';

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
        const fullHistory = await getGameHistory();

        const formattedHistory = fullHistory.map(record => ({
            game: record.game,
            bet: record.result.bet, 
            win: record.result.win,  
            date: record.date
        }));

        const topPlayers = await Leaderboard(formattedHistory, abortButton.signal);
        
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
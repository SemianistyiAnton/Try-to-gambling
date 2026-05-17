import { getHistoryStream } from './db.js';

const btnLoad = document.getElementById('btn-load-top');
const statusText = document.getElementById('leaderboard-status');
const list = document.getElementById('leaderboard-list');

if (btnLoad) {
    btnLoad.addEventListener('click', async () => {
        if (list) list.innerHTML = "";
        btnLoad.disabled = true;
        if (statusText) {
            statusText.textContent = "Streaming data from server...";
            statusText.style.color = "white";
        }

        const historyStream = getHistoryStream(5); 
        
        try {
            for await (const chunk of historyStream) {
                chunk.forEach(record => {
                    const li = document.createElement('li');
                    li.innerHTML = `[STREAM] <b>${record.game}</b>: Win <span style="color: #00ff00;">+${record.result.win}</span> (bet: ${record.result.bet})`;
                    if (list) list.appendChild(li);
                });
                await new Promise(res => setTimeout(res, 500)); 
            }
            
            if (statusText) {
                statusText.textContent = "Stream finished. All data loaded!";
                statusText.style.color = "lime";
            }
        } catch (e) {
            if (statusText) {
                statusText.textContent = "Stream interrupted.";
                statusText.style.color = "red";
            }
        } finally {
            btnLoad.disabled = false;
        }
    });
} else {
    console.warn('Lobby: load button not found (id="btn-load-top").');
}
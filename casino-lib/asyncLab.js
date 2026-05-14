export async function Leaderboard(gameHistory, cutSignal = null) {
    const topWins = [];

    const waitWithAbort = (ms, signal) => {
        return new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                if (signal) signal.removeEventListener('abort', onAbort);
                resolve(true);
            }, ms);

            const onAbort = () => {
                clearTimeout(id);
                reject(new Error('Stopped by user'));
            };

            if (signal) {
                if (signal.aborted) {
                    clearTimeout(id);
                    return reject(new Error('Stopped by user'));
                }
                signal.addEventListener('abort', onAbort);
            }
        });
    };

    for (let i = 0; i < gameHistory.length; i++) {
        const record = gameHistory[i];

        if (cutSignal && cutSignal.aborted) {
            throw new Error('Stopped by user');
        }

        if (record.win <= 0) continue;

        //await waitWithAbort(300, cutSignal);

        topWins.push({
            gameName: String(record.game).toUpperCase(),
            betAmount: record.bet,
            prize: record.win,
            date: new Date().toLocaleDateString()
        });
    }

    topWins.sort((a, b) => b.prize - a.prize);

    return topWins.slice(0, 5);
}
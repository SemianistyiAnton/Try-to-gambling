export function Leaderboard(gameHistory, cutSignal = null) {
    return new Promise(async (resolve, reject) => {
        const topWins = [];

        for (let i = 0; i < gameHistory.length; i++) {
            const record = gameHistory[i];

            if (cutSignal && cutSignal.aborted) {
                return reject(new Error("Stoped by user!"));
            }//відміняйка

            if (record.win <= 0) {
                continue; 
            }//чекер ПЕРЕМОГИ

            try {
                const fakeBack = await new Promise(res => setTimeout(() => res(true), 300));//на адекватний бекенд бюджету не було, тому імітую затримку(можливо в розвитку у мене)

                if (fakeBack) {
                    topWins.push({
                        gameName: record.game.toUpperCase(),
                        betAmount: record.bet,
                        prize: record.win,
                        date: new Date().toLocaleDateString()
                    });
                }
            } catch (error) {
                return reject(error);
            }
        }

        topWins.sort((a, b) => b.prize - a.prize);

        resolve(topWins.slice(0, 5));
    });
}
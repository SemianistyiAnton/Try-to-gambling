
export async function addGameResult(game, result) {
    try {
        const key = 'casinoGameHistory';
        const raw = localStorage.getItem(key);
        let arr = raw ? JSON.parse(raw) : [];

        arr.push({ id: Date.now(), game, result, date: new Date().toISOString() });

        const MAX_LIMIT = 50;
        const KEEP_LATEST = 10;  
        const KEEP_TOP = 10;    

        if (arr.length >= MAX_LIMIT) {

            const latestGames = arr.slice(-KEEP_LATEST);

            const topGames = [...arr]
                .sort((a, b) => (b.result?.win || 0) - (a.result?.win || 0))
                .slice(0, KEEP_TOP);

            const combined = [...latestGames, ...topGames];

            const uniqueMap = new Map();
            combined.forEach(item => uniqueMap.set(item.id, item));

            arr = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
        }
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (error) {
        console.error('Error adding game result:', error);
    }
}

export async function getGameHistory() {
    try {
        const key = 'casinoGameHistory';
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Error fetching game history:', error);
        return [];
    }
}



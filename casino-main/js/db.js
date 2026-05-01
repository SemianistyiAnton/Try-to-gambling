
export async function addGameResult(game, result) {
    try {
        const key = 'casinoGameHistory';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({ id: Date.now(), game, result, date: new Date().toISOString() });
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


export async function getGameHistory() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/history');
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching game history:', error);
        return [];
    }
}
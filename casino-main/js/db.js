export async function* getHistoryStream(batchSize = 5) {
    let offset = 0;
    
    while (true) {
        try {
            const response = await window.apiProxy.get(`/api/history?limit=${batchSize}&offset=${offset}`);
            
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            
            const chunk = await response.json();
            if (chunk.length === 0) {
                return; 
            }
            yield chunk; 
            offset += batchSize; 
            
        } catch (error) {
            console.error('Stream error:', error);
            return;
        }
    }
}
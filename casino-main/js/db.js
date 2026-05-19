import { withLog } from 'casino-lib';

const fetchHistoryBatch = withLog({ level: 'DEBUG', formatJson: true })(async (offset, limit) => {
    const response = await window.apiProxy.get(`/api/history?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch batch');
    return await response.json();
});

export async function* getHistoryStream(batchSize = 5) {
    let offset = 0;

    while (true) {
        try {
            const data = await fetchHistoryBatch(offset, batchSize);
            if (data.items.length === 0) break;

            yield data.items;
            offset += batchSize;

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
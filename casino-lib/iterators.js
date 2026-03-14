export function timeoutConsumer(iterator, delayInSeconds, callback) {
    let timeoutMs = delayInSeconds * 1000;
    let startTime = Date.now();

    const consumeNext = setInterval(() => {
        if (Date.now() - startTime >= timeoutMs) {
            clearInterval(consumeNext);
            callback("");
            return;
        }
        
        const result = iterator.next();
        if (result.done) {
            clearInterval(consumeNext);
            callback("");
            return;
        }
        
        callback(result.value);
        
    }, 150);
}
export function timeoutConsumer(iterator, delayInSeconds, callback) {
    let timeoutMs = delayInSeconds * 1000;
    let startTime = Date.now();

    const consumeNext = setTimeout(() => {
        if (Date.now() - startTime >= timeoutMs) {
            clearTimeout(consumeNext);
            callback("");
            return;
        }
        const result = iterator.next();
        if (result.done) {
            clearTimeout(consumeNext);
            callback("");
            return;
        }
    }, 150);
}

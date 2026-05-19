export function withLog({ level = 'INFO', formatJson = false } = {}) {
    return function decorator(func) {
        const isAsync = func.constructor.name === 'AsyncFunction';

        const logOutput = (args, result, error, startTime) => {
            if (level === 'ERROR' && !error) return;

            const execTime = performance.now() - startTime;
            const logData = {
                timestamp: new Date().toISOString(),
                level: error ? 'ERROR' : level,
                function: func.name || 'anonymous',
                args: args,
                executionTimeMs: execTime.toFixed(2),
                result: error ? error.message : result
            };

            const logMsg = formatJson 
                ? JSON.stringify(logData) 
                : `[${logData.timestamp}] ${logData.level} - ${logData.function} in ${logData.executionTimeMs}ms | Result: ${logData.result}`;

            if (error) console.error(logMsg);
            else if (level === 'INFO') console.info(logMsg);
            else if (level === 'DEBUG') console.debug(logMsg);
        };

        if (isAsync) {
            return async function (...args) {
                const startTime = performance.now();
                try {
                    const result = await func.apply(this, args);
                    logOutput(args, result, null, startTime);
                    return result;
                } catch (error) {
                    logOutput(args, null, error, startTime);
                    throw error;
                }
            };
        } else {
            return function (...args) {
                const startTime = performance.now();
                try {
                    const result = func.apply(this, args);
                    logOutput(args, result, null, startTime);
                    return result;
                } catch (error) {
                    logOutput(args, null, error, startTime);
                    throw error;
                }
            };
        }
    };
}
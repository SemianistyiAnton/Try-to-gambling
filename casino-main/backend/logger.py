import functools
import time
import json
import logging
from datetime import datetime
import asyncio

logging.basicConfig(level=logging.INFO, format="%(message)s")

def log(level="INFO", format_json=False):
    def decorator(func):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                if level != "ERROR":
                    _log_output(func.__name__, level, args, kwargs, result, None, start_time, format_json)
                return result
            except Exception as e:
                _log_output(func.__name__, "ERROR", args, kwargs, None, e, start_time, format_json)
                raise e

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                if level != "ERROR":
                    _log_output(func.__name__, level, args, kwargs, result, None, start_time, format_json)
                return result
            except Exception as e:
                _log_output(func.__name__, "ERROR", args, kwargs, None, e, start_time, format_json)
                raise e

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    return decorator

def _log_output(func_name, level, args, kwargs, result, error, start_time, format_json):
    exec_time = time.perf_counter() - start_time
    
    log_data = {
        "timestamp": datetime.now().isoformat(),
        "level": level if not error else "ERROR",
        "function": func_name,
        "args": str(args),
        "kwargs": str(kwargs),
        "execution_time_ms": round(exec_time * 1000, 2)
    }
    
    if error:
        log_data["error"] = str(error)
    else:
        log_data["result"] = str(result)

    if format_json:
        log_msg = json.dumps(log_data)
    else:
        log_msg = f"[{log_data['timestamp']}] {log_data['level']} - {func_name} in {log_data['execution_time_ms']}ms | Args: {args} {kwargs} | Result: {error or result}"

    if log_data["level"] == "ERROR":
        logging.error(log_msg)
    else:
        logging.info(log_msg)
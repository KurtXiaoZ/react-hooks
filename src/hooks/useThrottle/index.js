import { useEffect, useRef } from "react";

/**
 * Get a throttled version of a function
 * @param {Function} callback the original function
 * @param {Number} limit time limit of the callback
 * @returns the throttled version of the function
 */
export const useThrottle = (callback, limit) => {
    const waiting = useRef(false);
    const timerRef = useRef();

    useEffect(() => {
        return () => timerRef.current && clearTimeout(timerRef.current);
    }, []);

    const throttledCallback = (...args) => {
        if(!waiting.current) {
            callback.call(null, ...args);
            waiting.current = true;
            timerRef.current = setTimeout(() => {
                waiting.current = false;
            }, [limit])
        }
    };

    return throttledCallback;
}
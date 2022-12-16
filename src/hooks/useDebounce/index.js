import { useEffect, useRef } from "react"

/**
 * Get a debounced version of a function
 * @param {Function} callback the original function
 * @param {Number} limit time delay of the callback
 * @param {Array} dependencies dependencies of the debounced function
 * @returns the debounced version of the function
 */
export const useDebounce = (callback, delay, dependencies = null) => {
    const timerRef = useRef(null);

    useEffect(() => {
        return () => timerRef.current && clearTimeout(timerRef.current);
    }, dependencies);

    return (...args) => {
        if(timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            callback.apply(null, args);
            timerRef.current = null;
        }, delay);
    }
}
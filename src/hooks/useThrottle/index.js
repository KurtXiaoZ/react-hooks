import { useCallback, useEffect, useRef, useState } from "react";

export const useThrottle = (callback, limit) => {
    const waiting = useRef(false);
    // const [waiting, setWaiting] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
        return () => timerRef.current && clearTimeout(timerRef.current);
    }, []);

    const throttledCallback = (...args) => {
        console.log('throttledCallback waiting:', waiting.current);
        if(!waiting.current) {
            callback.call(null, ...args);
            // setWaiting(true);
            waiting.current = true;
            timerRef.current = setTimeout(() => {
                // setWaiting(false);
                waiting.current = false;
            }, [limit])
        }
    };


    return throttledCallback;
}
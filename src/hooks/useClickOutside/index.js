import { useEffect } from "react";

/**
 * Custom event for clicking outside of elements
 * @param {Array} refs array of refs of elements to be excluded from the event
 * @param {Function} handler event handler
 */
export const useClickOutside = (refs, handler) => {
    useEffect(() => {
        const listener = (event) => {
            let outside = true;
            for(const ref of refs) {
                if (ref?.current?.contains(event.target)) {
                    outside = false;
                    return;
                }
            }
            if(outside) handler(event);
        };
        document.addEventListener("click", listener);
        return () => document.removeEventListener("click", listener);
    }, [refs, handler]);
}
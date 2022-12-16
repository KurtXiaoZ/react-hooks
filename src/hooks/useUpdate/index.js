import { useEffect, useRef } from "react"

/**
 * Mock componentDidUpdate
 * @param {Function} callback handler that triggers when the dependencies update
 * @param {Function} cleanUp clean up function that triggers when the dependencies update
 * @param {Array} dependencies dependencies of the callbacks
 */
export const useUpdate = (callback, cleanUp, dependencies) => {
    const firstRender = useRef(true);

    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return;
        }
        if(typeof callback === 'function') callback();
        if(typeof cleanUp === 'function') return cleanUp();
    }, dependencies);
}
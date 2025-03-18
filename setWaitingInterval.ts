const map = new Map<number, number>();

let waitingIntervalId = 0;

function getLastUntilOneLeft(arr: number[]): number {
    if (arr.length > 1) {
        // verify the edge case of empty
        if (arr.length === 0) {
            throw new Error('Array cannot be empty');
        }

        // could get the last element without mutating the array 
        const item = arr[arr.length - 1]; // get the last element 
        arr.length -= 1; // reduce the array size 

        return item;
    }

    return arr[0];
}

/**
 * This function mimics the behavior of setInterval with one key difference:
 * if the callback function takes too long to execute or if the browser throttles,
 * subsequent calls to the callback function will not occur.
 *
 * Additionally, we pass an array of timeouts to define an increasing delay period.
 * For example, given the array [16, 8, 4, 2], the delays will be 2, 4, 8, 16, 16, 16...
 */

// the type Function is too generic, can be used something more explicit like argsInternal
export function setWaitingInterval(handler: (...args: any[]) => void, timeouts: number[], ...args: any[]): number {
    waitingIntervalId += 1;

    function internalHandler(...argsInternal: any[]): void {
        handler(argsInternal);

        // a new timeout is set even if the array timeout is empty of has one element left
        if (timeouts.length > 0) {
            map.set(
                waitingIntervalId,
                window.setTimeout(internalHandler, getLastUntilOneLeft(timeouts), ...args)
            );
        }
    }

    map.set(
        waitingIntervalId,
        window.setTimeout(internalHandler, getLastUntilOneLeft(timeouts), ...args)
    );

    return waitingIntervalId;
}

export function clearWaitingInterval(intervalId: number): void {
    const realTimeoutId = map.get(intervalId);

    if (typeof realTimeoutId === 'number') {
        // this could be a pontential memory leak of not removing the entry from map
        clearTimeout(realTimeoutId);
        map.delete(intervalId); // Clean up the map
    }
}

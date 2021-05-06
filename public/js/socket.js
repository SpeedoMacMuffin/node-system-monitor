// SOCKET IO
const socket = io();

const array_range = (start, len) => {
    const arr = new Array(len);
    for (let i = 0; i < len; i++, start++) {
        arr[i] = start;
    }
    return arr;
};
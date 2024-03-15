import { io } from 'socket.io-client';

// const URL = 'http://192.168.0.20:8504';
const URL = 'https://cc41-103-184-155-125.ngrok-free.app';

export const socket = io(URL, {
    autoConnect: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
    }
});
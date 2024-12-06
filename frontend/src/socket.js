import { io } from 'socket.io-client';

const URL = 'http://localhost:8504';

export const socket = io(URL, {
    autoConnect: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
    }
});
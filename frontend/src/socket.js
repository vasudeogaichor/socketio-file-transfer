import { io } from 'socket.io-client';

// const URL = 'http://192.168.0.20:8504';
const URL = 'http://localhost:8504';
// const URL = 'https://two-moments-start.loca.lt';

export const socket = io(URL, {
    autoConnect: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
    }
});
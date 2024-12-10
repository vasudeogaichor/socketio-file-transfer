import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL;
// const URL = 'http://localhost:8504';
// console.log('URL - ', URL)
export const socket = io(URL, {
    autoConnect: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
    }
});
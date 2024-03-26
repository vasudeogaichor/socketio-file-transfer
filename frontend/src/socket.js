import { io } from 'socket.io-client';
import { getCookie } from './helpers';

// const URL = 'http://192.168.0.20:8504';
const URL = 'http://localhost:8504';
// const URL = 'https://two-moments-start.loca.lt';

export const socket = io(URL, {
    autoConnect: true,
    // Enable when using over ngrok
    // extraHeaders: {
    //     'ngrok-skip-browser-warning': 'true'
    // },
    auth: {
        token: getCookie('token')
    }
});
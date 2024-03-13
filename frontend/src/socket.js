import { io } from 'socket.io-client';

const URL = 'http://192.168.0.20:8504';

export const socket = io(URL, {
    autoConnect: true
});
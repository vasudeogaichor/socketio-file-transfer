const restify = require('restify');
const socketIo = require('socket.io');

const fileHandlers = require('./fileHandlers');

const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const onConnection = (socket) => {
    fileHandlers(io, socket);
}

// Socket.io connections
io.on('connection', onConnection);

// Start server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
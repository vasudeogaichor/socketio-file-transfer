const restify = require('restify');
const socketIo = require('socket.io');
const fs = require('fs');

const fileHandlers = require('./fileHandlers');

const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        origin: "http://192.168.0.20:8503"
    }
});

// const onConnection = (socket) => {
//     fileHandlers(socket);
// }

// // Socket.io connections
// io.on('connection', onConnection);

io.on('connection', (socket) => {
    console.log('User connected.');

    socket.on('file:upload', (data) => {
        console.log('Data received:', data);
        const filename = __dirname + '/uploads/' + data.name;
        const fileStream = fs.createWriteStream(filename, { flags: 'a' }); // 'a' flag for append mode

        fileStream.write(data.content);
        fileStream.end();

        fileStream.on('finish', () => {
            console.log('File saved:', data.name);
            socket.emit('file:upload:finished');
        });
    });
});

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
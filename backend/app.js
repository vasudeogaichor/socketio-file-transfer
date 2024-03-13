const restify = require('restify');
const socketIo = require('socket.io');
const fs = require('fs');

const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        origin: "http://192.168.0.20:8503"
        // origin: "http://localhost:8503"
    },
    maxHttpBufferSize: 8192 * 1024 * 1024,
});

io.on('connection', (socket) => {
    console.log('User connected.');

    socket.on('file:upload', ({ content, name }) => {
        const filePath = __dirname + '/uploads/' + name;
        const writable = fs.createWriteStream(filePath, { flags: 'a' }); // 'a' flag to append to existing file

        const fileBuffer = Buffer.from(content);
        writable.write(fileBuffer);

        // writable.end(() => {
        // });
    });

    socket.on('file:upload:progress', (data) => {
        const { progress } = data;
        console.log('progress - ',progress)
        socket.emit('file:upload:progress', progress);
    });

    socket.on('file:upload:finished', () => {
        socket.emit('file:upload:finished');
    });
});

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
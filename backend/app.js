const restify = require('restify');
const socketIo = require('socket.io');
const { handleFileUpload, handleFileDownload, handleFileList, handleFileDelete } = require('./socketHandlers');
const MAX_BUFFER_SIZE = 1024 * 1024;

const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        origin: "http://192.168.0.20:8503"
        // origin: "http://localhost:8503"
        // origin: "https://cruel-impalas-jog.loca.lt"
    },
    maxHttpBufferSize: MAX_BUFFER_SIZE,
});

io.on('connection', (socket) => {
    console.log('User connected.');
    handleFileUpload(socket, MAX_BUFFER_SIZE);
    handleFileDownload(socket, MAX_BUFFER_SIZE );
    handleFileList(socket);
    handleFileDelete(socket);
});

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
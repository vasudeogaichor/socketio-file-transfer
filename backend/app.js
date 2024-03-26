const restify = require('restify');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const errorHandler = require('./errorHandler');
const { handleFileUpload, handleFileDownload, handleFileList, handleFileDelete } = require('./socketHandlers');
const MAX_BUFFER_SIZE = 1024 * 1024;

mongoose.connect('mongodb://localhost:27017/filemanagement')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
  
const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        // origin: "http://192.168.0.20:8503"
        origin: "http://localhost:8503"
        // origin: "https://cruel-impalas-jog.loca.lt"
    },
    maxHttpBufferSize: MAX_BUFFER_SIZE,
});

server.use(restify.plugins.bodyParser());
require('./routes/userRoutes')(server);

io.on('connection', (socket) => {
    console.log('User connected.');
    handleFileUpload(socket, MAX_BUFFER_SIZE);
    handleFileDownload(socket, MAX_BUFFER_SIZE );
    handleFileList(socket);
    handleFileDelete(socket);
});

server.on('restifyError', errorHandler);

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
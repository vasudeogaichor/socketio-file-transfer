const restify = require('restify');
const socketIo = require('socket.io');
const fs = require('fs');
const ioStream = require('socket.io-stream');

const server = restify.createServer();
const MAX_BUFFER_SIZE = 1024 * 1024;
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

    ioStream(socket).on('file:upload', (stream, data) => {
        const filename = data.name;
        const filePath = __dirname + '/uploads/' + filename;
        const fileStream = fs.createWriteStream(filePath, { highWaterMark: MAX_BUFFER_SIZE });
        stream.pipe(fileStream);
        stream.on('end', () => {
            console.log('File uploaded:', filename);
            socket.emit('file:upload:complete');
        });
    });

    ioStream(socket).on('file:download', (stream, data) => {
        const filename = data.name;
        const filePath = __dirname + '/uploads/' + filename;
        fs.createReadStream(filePath, { highWaterMark: MAX_BUFFER_SIZE }).pipe(stream);
    });

    socket.on('file:list', () => {
        const uploadDir = __dirname + '/uploads/';
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                socket.emit('file:list', {
                    error: 'Failed to list files'
                })
                return;
            }
            files = files.filter(file => file != '.gitkeep');

            const fileDetails = files.map(file => {
                const filePath = uploadDir + file;
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    created_at: stats.birthtime,
                    size: (stats.size / (1024)).toFixed(2)
                };
            });

            socket.emit('file:list', { data: fileDetails });
        });
    });

    socket.on('file:delete', async ({ name }) => {
        const filePath = __dirname + '/uploads/' + name;

        fs.access(filePath, fs.constants.F_OK, async (err) => {
            if (err) {
                // File does not exist
                socket.emit('file:delete:error', { message: 'File not found' });
            } else {
                // File exists, delete it asynchronously
                try {
                    await fs.promises.unlink(filePath);
                    socket.emit('file:delete:success');
                } catch (err) {
                    socket.emit('file:delete:error', { message: 'Failed to delete file' });
                }
            }
        });
    });
});

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
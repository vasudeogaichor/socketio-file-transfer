const restify = require('restify');
const socketIo = require('socket.io');
const fs = require('fs');

const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        origin: "http://192.168.0.20:8503"
    },
    maxHttpBufferSize: 1024 * 1024,
});

io.on('connection', (socket) => {
    console.log('User connected.');

    socket.on('file:upload:start', ({ name }) => {
        const filePath = __dirname + '/uploads/' + name;

        fs.exists(filePath, (exists) => {
            if (exists) {
                socket.emit('file:upload:error', { message: 'File with the same name already exists. Please rename your file.' });
            } else {
                socket.emit('file:upload:start')
            }
        });
    });

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
        socket.emit('file:upload:progress', progress);
    });

    socket.on('file:upload:finished', () => {
        socket.emit('file:upload:finished');
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
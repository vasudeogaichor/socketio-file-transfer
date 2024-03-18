const restify = require('restify');
const socketIo = require('socket.io');
const fs = require('fs');
const ioStream = require('socket.io-stream');

const server = restify.createServer();
const MAX_BUFFER_SIZE = 1024 * 1024;
const io = socketIo(server.server, {
    cors: {
        origin: "http://192.168.0.20:8503"
        // origin: "https://f129-103-184-155-125.ngrok-free.app"
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
        console.log('File uploaded:', filename);
      });

    // socket.on('file:upload', ({ content, name }) => {
    //     const filePath = __dirname + '/uploads/' + name;

    //     const writable = fs.createWriteStream(filePath, { flags: 'a' }); // 'a' flag to append to existing file

    //     const fileBuffer = Buffer.from(content);
    //     writable.write(fileBuffer);

    //     // writable.end(() => {
    //     // });
    // });

    // socket.on('file:upload:progress', (data) => {
    //     const { progress } = data;
    //     socket.emit('file:upload:progress', progress);
    // });

    // socket.on('file:upload:finished', () => {
    //     socket.emit('file:upload:finished');
    // });

    ioStream(socket).on('file:download', (stream, data) => {
        const filename = data.name;
        const filePath = __dirname + '/uploads/' + filename;
        const fileStream = fs.createReadStream(filePath);
        stream.pipe(fileStream);
        console.log('File sent:', filename);
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

    socket.on('file:download:start', ({ name }) => {
        const filePath = __dirname + '/uploads/' + name;
        const chunkSize = 64 * 1024; // 64 KB chunk size

        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.log('err - ', err);
                socket.emit('file:download:error', { message: 'Error in downloading file' });
                return;
            }

            const fileSize = stats.size;
            if (fileSize === 0) {
                console.log('File is empty');
                socket.emit('file:download:error', { message: 'File is empty' });
                return;
            }

            let bytesRead = 0;

            // Read the file in chunks
            const readChunk = (start, end) => {
                fs.readFile(filePath, { start, end }, (err, data) => {
                    if (err) {
                        console.error('Error reading chunk:', err);
                        socket.emit('file:download:error', { message: 'Error reading file chunk' });
                        return;
                    }

                    bytesRead += data.length;
                    const progress = Math.ceil((bytesRead / fileSize) * 100);
                    socket.emit('file:download:chunk', { data, progress });

                    if (bytesRead < fileSize) {
                        readChunk(bytesRead, Math.min(bytesRead + chunkSize, fileSize));
                    } else {
                        socket.emit('file:download:end');
                        console.log('file has been read completely');
                    }
                });
            };

            readChunk(0, chunkSize);
        });
    });



});

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
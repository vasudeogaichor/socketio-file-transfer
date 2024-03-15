const restify = require('restify');
const socketIo = require('socket.io');
const fs = require('fs');
const { Readable } = require('stream');

const server = restify.createServer();

const io = socketIo(server.server, {
    cors: {
        // origin: "http://192.168.0.20:8503"
        origin: "https://ecaf-103-184-155-125.ngrok-free.app"
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

    // socket.on('file:download:start', async ({ name }) => {
    //     try {
    //         const filePath = __dirname + '/uploads/' + name;
    //         const stats = await fs.promises.stat(filePath);
    //         const totalSize = stats.size;
    //         const chunkSize = 1024 * 1024; // 1 MB
    //         let bytesRead = 0;
    
    //         const readable = fs.createReadStream(filePath, { highWaterMark: chunkSize });
    
    //         readable.on('data', (chunk) => {
    //             console.log('chunk - ', chunk)
    //             bytesRead += chunk.length;
    //             const progress = Math.round((bytesRead / totalSize) * 100);
    //             socket.emit('file:download:chunk', { data: chunk, progress });
    //         });
    
    //         readable.on('end', () => {
    //             console.log('file download complete - ', name)
    //             socket.emit('file:download:end', { name });
    //         });
    
    //         readable.on('error', (error) => {
    //             console.error('Error reading file:', error);
    //             socket.emit('file:download:error', { message: error.message });
    //         });
    //     } catch (error) {
    //         console.error('Error accessing file:', error);
    //         socket.emit('file:download:error', { message: error.message });
    //     }
    // });

    // socket.on('file:download:start', async ({ name }) => {
    //     try {
    //         const filePath = __dirname + '/uploads/' + name;
    //         const stats = await fs.promises.stat(filePath);
    //         const totalSize = stats.size;
    //         const chunkSize = 1024 * 1024; // 1 MB
    //         let bytesRead = 0;
    
    //         const readable = fs.createReadStream(filePath, { highWaterMark: chunkSize });
    
    //         readable.on('data', async (chunk) => {
    //             bytesRead += chunk.length;
    //             const progress = Math.round((bytesRead / totalSize) * 100);
    //             socket.emit('file:download:chunk', { data: chunk, progress });
    //         });
    
    //         readable.on('end', async () => {
    //             console.log('file download complete - ', name);
    //             socket.emit('file:download:end', { name });
    //         });
    
    //         readable.on('error', (error) => {
    //             console.error('Error reading file:', error);
    //             socket.emit('file:download:error', { message: error.message });
    //         });
    //     } catch (error) {
    //         console.error('Error accessing file:', error);
    //         socket.emit('file:download:error', { message: error.message });
    //     }
    // });
    
    socket.on('file:download:start', async ({ name }) => {
        try {
            const filePath = __dirname + '/uploads/' + name;
            const stats = await fs.promises.stat(filePath);
            const totalSize = stats.size;
            const chunkSize = 1024 * 1024; // 1 MB
            let bytesRead = 0;
    
            const readable = fs.createReadStream(filePath, { highWaterMark: chunkSize });
    
            const sendChunksWithDelay = async () => {
                for await (const chunk of readable) {
                    bytesRead += chunk.length;
                    const progress = Math.round((bytesRead / totalSize) * 100);
                    socket.emit('file:download:chunk', { data: chunk, progress });
                    await new Promise(resolve => setTimeout(resolve, 100)); // Pause for 1 second (1000 ms)
                }
    
                console.log('file download complete - ', name);
                socket.emit('file:download:end', { name });
            };
    
            sendChunksWithDelay();
    
            readable.on('error', (error) => {
                console.error('Error reading file:', error);
                socket.emit('file:download:error', { message: error.message });
            });
    
        } catch (error) {
            console.error('Error accessing file:', error);
            socket.emit('file:download:error', { message: error.message });
        }
    });
    
    
    
});

// Start server
const PORT = 8504;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
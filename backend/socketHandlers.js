const fs = require('fs');
const ioStream = require('socket.io-stream');

const handleFileUpload = (socket, MAX_BUFFER_SIZE) => {
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
};

const handleFileDownload = (socket, MAX_BUFFER_SIZE) => {
    ioStream(socket).on('file:download', (stream, data) => {
        const filename = data.name;
        const filePath = __dirname + '/uploads/' + filename;
        fs.createReadStream(filePath, { highWaterMark: MAX_BUFFER_SIZE }).pipe(stream);
    });
};

const handleFileList = (socket) => {
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
};

const handleFileDelete = (socket) => {
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
};

module.exports = {
    handleFileUpload,
    handleFileDownload,
    handleFileList,
    handleFileDelete
};
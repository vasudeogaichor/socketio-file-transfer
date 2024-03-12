const ss = require('socket.io-stream');
const fs = require('fs');

module.exports = (socket) => {
    console.log('User connected.')

    ss(socket).on('file:upload', async (stream, data) => {
        const filename = __dirname + '/uploads/' + data.name;
        const fileWriter = fs.createWriteStream(filename);

        let totalBytes = 0;

        stream.on('data', (data) => {
            totalBytes += data.length;
            const progress = totalBytes / data.size;
            socket.emit('progress', { name: data.name, progress });
        });

        stream.pipe(fileWriter);
    });
}
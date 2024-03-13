// const fs = require('fs');

// module.exports = (socket) => {
//     console.log('User connected.')

//     socket.on('file:upload', (data) => {
//         console.log('data - ', data)
//         const filename = __dirname + '/uploads/' + data.name;
//         const fileStream = fs.createWriteStream(filename);

//         data.content.forEach((chunk) => {
//             fileStream.write(chunk);
//         });

//         fileStream.end();

//         fileStream.on('finish', () => {
//             console.log('File saved:', data.name);
//         });
//     });
// }
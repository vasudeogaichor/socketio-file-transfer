const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    uploadTime: Date,
    size: Number,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('File', fileSchema);

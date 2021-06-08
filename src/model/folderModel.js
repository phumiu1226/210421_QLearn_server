const mongoose = require('mongoose');
const { Schema } = mongoose;


const folderSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    userId: String,
    parentId: { type: String, default: '0' },
    isPublic: { type: Boolean, default: true },
    isPublicEdit: { type: Boolean, default: false }
}, {
    timestamps: true
});


module.exports = mongoose.model('Folder', folderSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;


const studySetSchema = new Schema({

    title: { type: String, required: true },
    description: String,
    userId: String,
    folderId: { type: String, default: '0' },
    isPublic: { type: Boolean, default: true },
    isPublicEdit: { type: Boolean, default: false },
    words: [{ word: String, description: String, img: String, types: [String] }],

}, {
    timestamps: true
});

module.exports = mongoose.model('StudySet', studySetSchema);
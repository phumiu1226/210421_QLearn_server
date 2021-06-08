const mongoose = require('mongoose');

function connectDB() {
    return mongoose.connect('mongodb://localhost/qlearn', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, //set cai nay de ko bi loi khi su dung Model.findOneAndUpdate() , Model.findByIdAndRemove() ,...
        useCreateIndex: true
    });
}

module.exports = { connectDB }
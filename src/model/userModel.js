const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, maxLength: 30, minLength: 5, required: true, unique: true },
    password: { type: String, maxLength: 50, minLength: 5, required: true },
    avatar: String,
    firstName: String,
    lastName: String,
    address: String,
    email: String,
    dataOfBirth: Date,
    gender: { type: String, default: 'male' },
    phone: String,
}, {
    timestamps: true //cai nay auto them create_at , update_at
});


module.exports = mongoose.model('User', userSchema); //da tao 1 model xong  , qua controller de thao tac
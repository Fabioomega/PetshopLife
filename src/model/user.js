const mongoose = require('../config/connection');

const user_shema = new mongoose.Schema({
    username: String,
    is_admin: Boolean,
    phone: String
});

const User = mongoose.model('User', user_shema, 'users');

module.exports = User;

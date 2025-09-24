const mongoose = require('../config/connection');

const user_shema = new mongoose.Schema({
    dayOfWeek: String,
    time: String,
    capacity: Number
});

const Slot = mongoose.model('Slot', user_shema, 'slots');

module.exports = Slot;
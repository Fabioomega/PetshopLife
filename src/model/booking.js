const mongoose = require('../config/connection');

const slot_shema = new mongoose.Schema({
    slotId: ObjectId,
    userId: ObjectId,
    costumerName: String,
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', slot_shema, 'bookings');

module.exports = Booking;

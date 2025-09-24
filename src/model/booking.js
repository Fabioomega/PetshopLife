const mongoose = require('../config/connection');

const slot_shema = new mongoose.Schema({
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    costumerName: String,
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', slot_shema, 'bookings');

module.exports = Booking;

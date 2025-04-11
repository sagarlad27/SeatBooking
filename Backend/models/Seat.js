const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: Number,
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = mongoose.model('Seat', seatSchema);
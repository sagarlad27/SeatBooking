const Seat = require('../models/Seat');

exports.getSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};

exports.bookSeats = async (req, res) => {
  try {
    const { seatCount } = req.body;
    if (seatCount > 7) return res.status(400).json({ error: 'Max 7 seats allowed' });

    const seats = await Seat.find({ bookedBy: null }).sort('seatNumber');
    if (seats.length < seatCount) return res.status(400).json({ error: 'Not enough seats' });

    const blocks = [];
    for (let i = 0; i <= seats.length - seatCount; i++) {
      const block = seats.slice(i, i + seatCount);
      const first = block[0].seatNumber;
      const last = block[block.length - 1].seatNumber;
      if (Math.floor((first - 1) / 7) === Math.floor((last - 1) / 7)) {
        blocks.push(block);
        break;
      }
    }

    const selected = blocks.length > 0 ? blocks[0] : seats.slice(0, seatCount);
    await Promise.all(
      selected.map((seat) =>
        Seat.updateOne({ _id: seat._id }, { $set: { bookedBy: req.userId } })
      )
    );

    // Return updated seats to reflect booking state in frontend
    const allSeats = await Seat.find().sort('seatNumber');

    res.json({ message: 'Seats booked', bookedSeats: selected.map(s => s.seatNumber), seats: allSeats });
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
};

exports.resetSeats = async (req, res) => {
  try {
    await Seat.updateMany({}, { $set: { bookedBy: null } });
    res.json({ message: 'All seats reset' });
  } catch (error) {
    res.status(500).json({ error: 'Reset failed' });
  }
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const seatRoutes = require('./routes/seatRoutes');
const Seat = require('./models/Seat');

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://seatbooking-frontend-6ni3.onrender.com', 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', authRoutes);
app.use('/api', seatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  const count = await Seat.countDocuments();
  if (count < 80) {
    const seats = Array.from({ length: 80 }, (_, i) => ({ seatNumber: i + 1 }));
    await Seat.insertMany(seats);
    console.log('Seats initialized');
  }
});

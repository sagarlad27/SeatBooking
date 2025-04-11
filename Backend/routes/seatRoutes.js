const express = require('express');
const { getSeats, bookSeats, resetSeats } = require('../controllers/seatController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/seats', auth, getSeats);
router.post('/book', auth, bookSeats);
router.post('/reset', auth, resetSeats);

module.exports = router;
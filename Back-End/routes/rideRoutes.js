const express = require('express');
const { createRide, bookRide, completeRide,getAvailableRides } = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createRide);
router.get('/available',authMiddleware, getAvailableRides);
router.put('/:id/book', authMiddleware, bookRide);
router.put('/:id/complete', authMiddleware, completeRide);

module.exports = router;
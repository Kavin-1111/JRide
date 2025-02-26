const { Rider, User } = require('../models/tableSchema');

exports.registerRider = async (req, res) => {
    try {
        const { origin, destination, vehicleType, genderPreference } = req.body;

        const rider = await Rider.create({
            userId: req.user.userId,
            origin,
            destination,
            vehicleType,
            genderPreference,
        });

        res.status(201).json(rider);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register rider' });
    }
};

exports.getAllRiders = async (req, res) => {
    try {
        const riders = await Rider.findAll({ include: User });
        res.json(riders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch riders' });
    }
};
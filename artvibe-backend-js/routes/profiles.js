const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// @route   GET api/profiles/user/:user_id
// @desc    Get a user's profile by their user ID
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['displayName', 'avatar']);

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
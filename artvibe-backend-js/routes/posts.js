const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/posts
// @desc    Create a post
router.post('/', auth, async (req, res) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            authorId: req.user.id, // Sequelize uses 'authorId' based on our model definition
        });
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                as: 'author',
                attributes: ['displayName'], // Only include the author's name
            },
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
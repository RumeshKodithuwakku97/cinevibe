const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This links the profile to a specific user
        required: true,
    },
    bio: {
        type: String,
        default: 'Welcome to my Cinevibe profile! Click "Edit Profile" to add your intro.',
    },
    coverImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=85&fm=jpg&crop=entropy&cs=srgb&w=1600', // A default cover
    },
    skills: [{
        name: String,
        level: String,
    }],
    portfolio: [{
        title: String,
        description: String,
        url: String,
    }],
    stats: {
        followers: { type: Number, default: 0 },
        following: { type: Number, default: 0 },
    },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
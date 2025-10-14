const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Import User to define the relationship

const Post = sequelize.define('Post', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

// Define the relationship: A Post belongs to a User
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Post, { foreignKey: 'authorId' });

module.exports = Post;
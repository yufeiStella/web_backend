const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
    username: String,
    following: Array,       
});

module.exports = followingSchema;
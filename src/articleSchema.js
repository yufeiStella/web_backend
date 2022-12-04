const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  pid: Number,
  author: String,
  text: String,
  date: Date,
  comments: [{ author: String, comment: String }],
  img: String,
});

module.exports = articleSchema;

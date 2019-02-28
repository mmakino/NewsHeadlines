/* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Schema for article comments
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
"use strict";

const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new Schema object
const CommentSchema = new Schema({
  title: String,
  body: String,
  
  // `createdAt` is a time when this comment is inserted
  createdAt: {
    type: Date,
    default: Date.now 
  },
  
});

// Create the comment model
const Comment = mongoose.model("comment", CommentSchema);

// Export the Comment model
module.exports = Comment;

/* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Article schema
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
"use strict";

const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new Schema object
const ArticleSchema = new Schema({
  // `headline` is required and of type String
  headline: {
    type: String,
    required: true
  },

  // `summary` is required and of type String
  summary: {
    type: String,
    required: true
  },
 
  // `link` is a unique index and of type String
  link: {
    type: String,
    index: true,
    unique: true,
  },
  
  // a link to an image if available
  imageURL: {
    type: String,
    required: false,
    default: null,
  },
  
  // the time when this article has been inserted
  createdAt: {
    type: Date,
    default: Date.now 
  },
  
  // an array of comment id's
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

/* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Main app server 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/

"use strict";

// backend modules
const express = require("express");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");

// Load mongoose database models
const db = require("./models");

// server port number
const PORT = process.env.PORT || 3003;

// Load routes
const index = require("./routes/index");
const comment = require("./routes/comment");
const scrape = require("./routes/api/scrape");
const articles = require("./routes/api/articles");

// Initialize Express
const app = express();
// Initialize Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// = = = = = = = = = = = = = =
// == Configure middleware ==

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Set up router middleware
app.use("/", index);
app.use("/comment", comment);
app.use("/api/scrape", scrape);
app.use("/api/articles", articles);

// = = = = = = = = = = = = = =

// Connect to the Mongo DB
mongoose.connect(db.MONGODB_URI, { 
  useNewUrlParser: true,
  useCreateIndex: true 
}).then(() => console.log(`Connected to MongoDB ${db.MONGODB_URI}`))
  .catch(err => console.log(err));

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

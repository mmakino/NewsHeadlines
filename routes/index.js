/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
Routes for the html page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");

//
// GET /test
//
router.get("/test", (req, res) => {
  res.json({ test: "/test"});
});

//
// A GET route for scraping at EE Times website
//
router.get("/", (req, res) => {
  db.Article.find({}).sort({ createdAt: 1 })
    .then(result => {
      console.log(`Article count: ${result.length}`);
      res.render("index", { article: result });
    })
    .catch(err => {
      res.render("index", { article: "failed to get articles"});
    });
});

module.exports = router;
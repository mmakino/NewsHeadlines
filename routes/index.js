/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
Routes for the main html page
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");
const scraper = require("./api/scrape");

//
// GET /test
//
router.get("/test", (req, res) => {
  res.json({ test: "/test"});
});

//
// A GET route for all articles
//
router.get("/", (req, res) => {
  db.Article.find({}).sort({ createdAt: -1 })
    .then(result => {
      console.log(`Article count: ${result.length}`);
      res.render("index", { article: result });
    })
    .catch(err => {
      res.render("index", { article: "failed to get articles"});
    });
});

//
// A GET route for all commented articles
//
router.get("/commented", (req, res) => {
  db.Article.find({
    comments: { 
      $exists: true, 
      $ne: [] 
    }
  }).sort({ createdAt: -1 })
    .then(result => {
      console.log(`Article count(commented): ${result.length}`);
      res.render("index", { article: result });
    })
    .catch(err => {
      res.render("index", { article: "failed to get articles"});
    });
});

//
// A GET route for scraping articles
//
// // On heroku, web scraping causes timeout
//
// router.get("/scrape", (req, res) => {
//   scraper(); // go async
//   setTimeout(waitAndReloadRoot, 3000, res);
// });

//
// helper function for "/scrape" route for redirecting to root "/"
//
// function waitAndReloadRoot(res) {
//   res.redirect('/');
// }

//
// In conjunction with Promise-based scraping
//
router.get("/scrape", (req, res) => {
  scraper()
  .then(articleInfo => {
    res.redirect('/');
  })
  .catch(error => {
    res.json(error);
  });
});

module.exports = router;
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
// A GET route for all articles
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

//
// GET /comment/:articleId
// Article comment page
//
router.get("/comment/:articleId", (req, res) => {
  db.Article.findOne({
    _id: req.params.articleId
  })
  .populate("comments")
  .then(article => {
    console.log("COMMENT+ARTICLE ", article);
    res.render("comment", { 
      article: article,
    });
  })
  .catch(err => res.send(err));
});

//
// POST /comment/:articleId
// Article comment page
//
router.post("/comment/:articleId", (req, res) => {
  new db.Comment({
    title: req.body.title,
    body: req.body.comment,
    article: req.params.articleId
  })
  .save()
  .then(comment => {
    db.Article.findOne({
      _id: comment.article
    })
    .then(article => {
      article.comments.push(comment._id);
      article
        .save()
        .then(article => {
          res.redirect("/comment/" + comment.article);
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
  });
});

module.exports = router;
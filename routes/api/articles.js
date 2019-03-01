/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
Routes for news articles at a web site
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Load express and mongodb 
const express = require("express");
const router = express.Router();
const db = require("../../models");

//
// GET /api/articles/test
//
router.get("/test", (req, res) => {
  res.json({ test: "/api/article/test"});
});

//
// GET /api/article
// Route for getting all Articles from the db
//
router.get("/", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//
// GET /api/article/:id
// Route for grabbing a specific Article by id, 
// populate it with comments
//
router.get("/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//
// POST /api/article/:id
// Route for saving/updating an Article and an associated comment
// 
// PARAMS:
// * POST params { title: "...", body: "..." }
//        body is required
//
router.post("/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ 
        _id: req.params.id 
      }, { 
        comment: dbComment._id 
      }, { 
        new: true 
      });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//
// DELETE /api/article/:id
// Route for an Article's associated 
// 
router.delete("/:id", function(req, res) {
  db.Article.deleteOne({
    _id: req.params.id
  })
  .then(result => {
    db.Comment.deleteMany({
      article: req.params.id
    })
    .then(delComments => {
      res.json(delComments);
    })
    .catch(commErr => res.json(commErr));
  })
  .catch(err => res.json(err));
});


module.exports = router;
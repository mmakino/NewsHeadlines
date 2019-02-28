/* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Router(s) for scraping articles at a web site
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
"use strict";

// Load express and mongodb 
const express = require("express");
const router = express.Router();
const db = require("../../models");

// modules for scraping
const axios = require("axios");
const cheerio = require("cheerio");

// the target web site config
const url = "http://www.eetimes.com/";

//
// GET /api/scrape/test
//
router.get("/test", (req, res) => {
  res.json({ test: "/api/scrape/test"});
});

//
// A GET route for scraping at EE Times website
//
router.get("/", (req, res) => {
  // First, grab the body of the html with axios
  axios.get(url).then(response => {
    // collect articles in the body
    const articleInfo = collectEETimesNews(response.data);

    // Insert the collected articles into the database
    articleInfo.forEach(item => {
      const article = new db.Article(item);
      
      article
        .save()
        .then(dbArticle => console.log(dbArticle))
        .catch(err => console.log(err));
    });
  });

  console.log("Scrape Complete");
  res.redirect("/");
});

//
// Export the router
//
module.exports = router;

/* * * * * * * * * * * * * * * * * * */
/* Helper Functions */

//
// Collect articles on the EE Times main web page
//
// PARAMS:
// * data = axios GET request response.data object
//
// RETURN:
// * an array of article info objects
//
function collectEETimesNews(data) {
  // Collect ojbects of article info into this "articles" array
  let articles = [];
  const $ = cheerio.load(data);

  // html element context wherein the articles of interest are placed
  const contexts = [$("#newsTop .container .segment-main .columns .block"),
                    $("#newsTop .container .segment-main #paginateMainDiv .block")];

  contexts.forEach(context => {
    context.each(function(i, element) {
      let article = {};
      
      article.headline = $(".card .card-body .card-title a", element).text();
      article.summary = $(".card .card-body .card-text", element).text();
      article.link = url + $(".card figure a", element).attr("href");
      article.imageURL = $(".card figure a img", element).attr("src");
      
      articles.push(article);
    });
  }); 
  
  return articles;
}

/* 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Scrape articles at a web site 
 No route. Only exports "scrapeEETimes" function
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
"use strict";

// Load models 
const db = require("../../models");

// modules for scraping
const axios = require("axios");
const cheerio = require("cheerio");

// the target web site config
const EETimesURL = "http://www.eetimes.com/";

//
// Scrape EE Times
//
function scrapeEETimes(url = EETimesURL) {
  // First, grab the body of the html with axios
  axios.get(url).then(response => {
    // collect articles in the body
    const articleInfo = collectEETimesNews(response.data).map(article => {
      article.link = url + article.link;
      return article;
    });
    console.log(`Found ${articleInfo.length} articles`);
    addArticles(articleInfo);
  });
}

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
      articles.push({
        headline: $(".card .card-body .card-title a", element).text(),
        summary: $(".card .card-body .card-text", element).text(),
        link: $(".card figure a", element).attr("href"),
        imageURL: $(".card figure a img", element).attr("src")
      });
    });
  }); 
  
  return articles;
}

//
// Insert articles into the Article collection
//
function addArticles(articles) {
  console.log(`Adding ${articles.length} articles`);
  
  articles.forEach(item => {
    // const article = new db.Article(item);
    
    // "unique" constraint doesn't seem to work sometimes(?)
    // somehow allowing to insert duplicates
    // article
    //   .save()
    //   .then(dbArticle => console.log(dbArticle))
    //   .catch(err => console.log(err));
    
    // console.log(`Adding ${item}`);
    db.Article.findOneAndUpdate({
      link: item.link
    }, 
    item, {
      upsert: true,
      returnNewDocument: true
    })
    .then(doc => {
      // console.log(`Added ${doc}`);
      ;
    })
    .catch(err => console.log(err));
  });
}

// * * * export * * *
module.exports = scrapeEETimes;

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
  return new Promise((resolve, reject) => {
    // First, grab the body of the html with axios
    axios.get(url)
      .then(response => {
        // collect articles in the body
        const articleInfo = collectEETimesNews(response.data).map(article => {
          console.log(JSON.stringify(article));
          article.link = article.link;
          return article;
        });
        console.log(`Found ${articleInfo.length} articles`);
        addArticles(articleInfo);
        resolve(articleInfo);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
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
    console.log(`Adding --------------\n\t${JSON.stringify(item)}\n`);
    
    db.Article.findOneAndUpdate({
      link: item.link
    }, 
    item, {
      upsert: true,
      returnNewDocument: true
    })
    .then(doc => {
      // console.log(`Added ${doc}`);
      return doc;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
  });
}

// * * * export * * *
module.exports = scrapeEETimes;

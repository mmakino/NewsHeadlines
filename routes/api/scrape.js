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
const EETimesURL = "https://www.eetimes.com/";

// Dummy User-Agent strings, since EE times seems to be anti-scraping site
// However, the following bots appear to be allowed at least for now
const UA = [
  'Wget/1.19.4 (linux-gnu)',
  'Googlebot/2.1 (+http://www.google.com/bot.html)'
];

//
// Random array index for UA
//
function randomIndexForUA() {
  return Math.floor(Math.random() * 10**Math.ceil(Math.log10(UA.length))) % UA.length;
}

function setUserAgent() {
  axios.defaults.headers.common['User-Agent'] = UA[randomIndexForUA()];
}

//
// Scrape EE Times
//
// function scrapeEETimes(url = EETimesURL) {
//   setUserAgent();

//   // First, grab the body of the html with axios
//   axios.get(url, {
//     timeout: 29000,
//   })
//     .then(response => {
//       // collect articles in the body
//       const articleInfo = collectEETimesNews(response.data);
//       console.log(`Found ${articleInfo.length} articles`);
//       if (articleInfo.length > 0) {
//         addArticles(articleInfo);
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

//
// Promise version of scraping, good for timely reloading of a page
//
function scrapeEETimes(url = EETimesURL) {
  return new Promise((resolve, reject) => {
    // First, grab the body of the html with axios
    axios.get(url, {
      timeout: 29000
    })
      .then(response => {
        // collect articles in the body
        const articleInfo = collectEETimesNews(response.data);
        console.log(`Found ${articleInfo.length} articles`);
        if (articleInfo.length > 0) {
          addArticles(articleInfo);
          resolve(articleInfo);
        } else {
          resolve("No articles found");
        }
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
  articles.forEach(item => {
    // console.log(`Adding --------------\n\t${JSON.stringify(item)}\n`);
    
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

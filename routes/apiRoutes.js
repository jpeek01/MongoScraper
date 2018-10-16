const axios = require('axios');
const cheerio = require('cheerio');
var db = require("../models");

module.exports = function(app) {

    app.get("/scrape", function(req, res) {
        axios.get("http://www.echojs.com/").then(function(response) {

            var $ = cheerio.load(response.data);
    
            $("article h2").each(function(i, element) {
                var result = {};
        
                result.title = $(this)
                .children("a")
                .text();
                result.link = $(this)
                .children("a")
                .attr("href");
        
                db.Article.create(result)
                .then(function(dbArticle) {
                    //console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            });
        });
    });

    app.get('/articles', function(req, res) {
        db.Article.find({})
        .then(function (dbArticles) {
            console.log()
            res.json(dbArticles)
        })
        .catch(function(err) {
            res.json(err);
        });
    });
}

// Example
// { _id: 5bc553a4346f872478c0ae0e,
//     title: 'WarriorJS - Will your JS skills be enough to get to the Top 10?',
//     link: 'https://warriorjs.com',
//     __v: 0 }
  
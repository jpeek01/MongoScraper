const axios = require('axios');
const cheerio = require('cheerio');
var db = require("../models");

module.exports = function(app) {

    app.get("/scrape", function(req, res) {
        console.log('starting');
        //axios.get("http://www.echojs.com/").then(function(response) {
        axios.get("https://www.npr.org/sections/news/")
        .then(function(response) {
        console.log('starting axios');
            const $ = cheerio.load(response.data);
    
            $("article div div.imagewrap a").each(function(i, element) {
                var result = {};
        
                result.title = $(this)
                .children("img")
                .attr("alt");
                
                result.image = $(this)
                .children("img")
                .attr("data-original");

                result.link = $(this)
                .attr("href");

                // console.log(result);

                db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            })
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

    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
          .populate("note")
          .then(function(dbArticle) {
            res.json(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
      });
}


  
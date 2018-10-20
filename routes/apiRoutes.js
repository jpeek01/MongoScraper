const axios = require('axios');
const cheerio = require('cheerio');
var db = require("../models");

module.exports = function(app) {

    app.get("/scrapeArticles", function(req, res) {
        //axios.get("http://www.echojs.com/").then(function(response) {
        axios.get("https://www.npr.org/sections/news/")
        .then(function(response) {
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
                    // return res.json(err);
                });
            })
        });
    });

    app.get('/unsavedArticles', function(req, res) {
        db.Article.find({"saved": 0})
        .then(function (dbArticles) {
            console.log(dbArticles);
            res.json(dbArticles)
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    app.get('/savedArticles', function(req, res) {
        db.Article.find({"saved": 1})
        .then(function (dbArticles) {
            console.log(dbArticles);
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


      app.post("/articles/:id", function(req, res) {
        db.Note.create(req.body)
          .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
          })
          .then(function(dbArticle) {
            res.json(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
      });

      app.post("/savedArticles/:id", function(req, res) {
        db.Article.update({_id: req.params.id }, {$set: {saved: 1}})
          .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: 1 });
          })
          .then(function(dbArticle) {
            res.json(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
      });

} //End Module Export


  
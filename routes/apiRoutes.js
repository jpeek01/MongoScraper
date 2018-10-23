const axios = require('axios');
const cheerio = require('cheerio');
var db = require("../models");

module.exports = function(app) {

    app.get("/scrapeArticles", function(req, res) {
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
                    // console.log(dbArticle);
                    res.redirect("/");
                })
                .catch(function(err) {
                    console.log(res.json(err));
                });
            })
        });
    });

    //Get unsaved articles for the Main page
    app.get('/unsavedArticles', function(req, res) {
        db.Article.find({"saved": false})
            .then(function (dbArticles) {
                // console.log(dbArticles);
                res.json(dbArticles)
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    //get the saved articles for display on the Saved page
    app.get('/savedArticles', function(req, res) {
        db.Article.find({"saved": true})
            .then(function (dbArticles) {
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

      //post the Saved Article's note
    app.post("/articles/:id", function(req, res) {
        db.Note.create(req.body)
            .then(function(dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbArticle) {
                // console.log(dbArticle);
                res.json(dbNote);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

      //set Article as saved
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

    app.delete("/articles/delete/:note_id/:article_id", function (req, res) {
        db.Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
            db.Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id }})
                .exec(function (err) {
                });
        });
    });

} //End Module Export


  
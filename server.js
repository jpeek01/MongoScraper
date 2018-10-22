const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const db = require('./models');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoScraper";

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true});

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


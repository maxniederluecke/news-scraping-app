var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("/public"));
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function (req, res) {
    axios.get("https://www.nhl.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $(".mixed-feed__item-header-text").each(function (i, element) {
            var entry = {};
            entry.headline = $(element).find("h4").text();
            entry.summary = $(element).find("h5").text();
            entry.url = "https://www.nhl.com/" + $(element).find("a").attr("href");
            if (((entry.summary) !== "") && ((entry.summary) !== null)) {
                console.log(entry);
                db.News.create(entry)
                .catch(function (err) {
                    console.log(err);
                })
            };   
        });
    }).then(function() {
        db.News.find({})
        .populate("comment")
        .then(function(results){
            res.render("index", {
                news: results
            });
        })
        .catch(function(err){
            console.log(err);
        })
    })
});

app.delete("/comment/:id", function(req, res){
    db.Comment.findByIdAndDelete(req.params.id)
    .then(function(){
        console.log("Comment deleted");
    })
});

app.post("/news/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (koivu) {
            return db.News.update({ _id: req.params.id }, { $push: { comment: koivu } })
        });
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
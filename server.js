
var express = require('express');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require('mongoose');

var Article = require('./models/Article.js')
mongoose.Promise = Promise;

var app = express();
var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

//--------------------------- MONGOOSE ---------------------------
mongoose.connect('mongodb://localhost/nytreact');
// mongoose.connect('mongodb://heroku_6g70dlvh:u9q4bgi9vsir8fvan5dui1s7ck@ds147681.mlab.com:47681/heroku_6g70dlvh');
var db = mongoose.connection;

// Show any Mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//--------------------------- ROUTES ---------------------------
// Main "/" Route. This will redirect the user to our rendered React application
// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/public/index.html");
// });

// query MongoDB for all saved articles
app.get('/api/saved', function(req,res) {
    Article.find({}, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
    });
});

// save an article to the MongoDB
app.post('/api/saved', function(req,res) {

    Article.create({
      title: req.body.title,
      date: req.body.date,
      url: req.body.url
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send("Saved to MongoDB");
      }
    })

});

// delete a saved article in the database
app.delete('/api/saved', function(req,res) {
    Article.findByIdAndRemove({_id: req.body._id}, function(err, doc) {
      if(err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

//route for react HTML page
app.get('*', function(req,res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT,function() {
    console.log('App is listening at ' + PORT);
})
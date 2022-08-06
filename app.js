const express = require("express"); //return as function refference which is called later on line 11
const bodyParser = require("body-parser");
const ejs = require("ejs"); //Embedded Javascript(EJS) used as templating engine
const mongoose =  require("mongoose");
const req = require("express/lib/request");

// const app = express() creates an app object that has it's own methods such as
// app.get() and app.post() that allow you to register route handlers.
//  And, a method like app.listen() allows you to start the server.
//  There are many methods on the app object.
const app = express(); 

// set the view engine to ejs
app.set('view engine', 'ejs');

// in order to use BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

//to allow Mongoose to connect to our Local MongoDB instance.
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true})

//Schema to create a model using this schema for mongoose
const articleSchema = {
    title: String,
    content: String
};

//the Model Article having schema as -ArticleSchema
const Article = mongoose.model("Article", articleSchema);

///////////////////////// Requests Targeting all articles /////////////////////////

app.route("/articles")
  .get(function (req, res) {
    //setting up the GET(http verb) route
    Article.find(function (err, foundResults) {
      //find method from mongoose, it finds all the articles present and sends the result to callback
      if (!err) {
        res.send(foundResults);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    //http delete verb by using express.js

    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles!");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////// Requests Targeting A Specific article /////////////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title were found.");
        }
      }
    );
  })
  .put(function(req, res){
    Article.replaceOne(
          {title: req.params.articleTitle},
          {title: req.body.title, content: req.body.content},
          //{overwrite: true},
          function(err){
              if(!err){
                  res.send('Successfully put article.');
              }else{
                  res.send(err);
              }
          }
  );
  })
  .patch(function(req,res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if (!err) {
          res.send("Successfully patched article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res)=>{
    Article.deleteOne({ title: req.params.articleTitle }, 
      
      function (err) {
      if (!err) {
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});
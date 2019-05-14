const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});


const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articlesSchema);

const article1 = new Article({
  title: "Testowy tytuł",
  content: "testowy content"
});



//////////////////////////////////////////// Targetting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("Succesfully added a new article!");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("succesfully deleted all articles")
    } else {
      res.send(err);
    }
  });
});


//////////////////////////////////////////// Targetting specific article

app.route("/articles/:articleTitle")
.get(function(req, res) {
  //here goes the get callback

  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No article was found");
    }
  });

})
.put(function(req, res) {
  //here goes the post callback

  Article.update(
    {title:req.params.articleTitle},
      {title:req.body.title, content:req.body.content},
        {overwrite: true},
      function(err) {
        if (!err) {
          res.send("succesfully updated document!");
        } else {
          res.send(err);
        }
  });

})
.patch(function(req, res) {
  //here goes the delete callback

  Article.update(
    {title: req.params.articleTitle},
    {$set:req.body},
    function(err) {
      if (!err) {
        res.send("succesfully updated chosen content");
      } else {
        res.send(err);
      }
    });

})
.delete(function(req, res) {
  //here goes delete callback

  Article.delete(
    {title: req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("Succesfully deleted an article");
      } else {
        res.send(err);
      }
    }
  );
});


app.listen(3000, function(req, res) {
  console.log("server started succesfully");
});

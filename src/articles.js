const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://yufei:yufeipassword@cluster0.a1tnr.mongodb.net/?retryWrites=true&w=majority";


const userSchema = require("./userSchema");
const articleSchema = require("./articleSchema");
const profileSchema = require("./profileSchema");

const User = mongoose.model("user", userSchema);
const Article = mongoose.model("article", articleSchema);
const Profile = mongoose.model("profile", profileSchema);

const connector = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function getArticles(req, res) {
  (async () => {
    const username = req.params.user ? req.params.user : req.username;
    const id = req.params.id;
    if (!username) {
      res.status(400).send({"alert": "no user logged in"});
      return;
    }

    if (id) {
      let number_id = parseInt(id);
      if (isNaN(number_id)) {
        // id is not a number
        const articles = await Article.find({ author: id }).exec();
        res.status(200).send({ articles: articles });
      } else {
        // id is a number
        const article = await Article.findOne({ pid: id }).exec();
        if (!article) {
          res.status(401).send({"alert": "No such article with id as author"});
          return;
        } else {
          res.status(200).send({ articles: article });
        }
      }
    } else {
      const articles = await Article.find({ author: username }).exec();
      res.status(200).send({ articles: articles });
    }
  })();
}

function getArticlesByAuthor(req, res) {
  (async () => {
    const username = req.params.user ? req.params.user : req.username;
    if (!username) {
      res.status(400).send({"alert":"no user logged in"});
      return;
    }
    
    const profile = await Profile.findOne({ username:
username }).exec();
    if (!profile) {
      res.status(401).send({"alert":"No such profile with username"});
      return;
    }
    const following = profile.following;
    const authors = [username, ...following];
    const articles = await Article.find({ author: { $in: authors } }).exec();
    res.status(200).send({ articles: articles });
  })();
}


function updateArticle(req, res) {
  (async () => {
    const id = req.params.id;
    const text = req.body.text;
    const commentId = req.body.commentId;

    if (!id || !text) {
      res.status(400).send({"alert":"no id or text"});
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({"alert":"no user logged in"});
      return;
    }

    const article = await Article.findOne({ pid: id }).exec();

    if (!article) {
      res.status(401).send({"alert":"No such article with id"});
      return;
    }

    if (article.author !== username) {
      res.status(401).send({"alert":"You don't own the article"});
      return;
    }

    if (!commentId) {
      // update article
      article.text = text;
      await article.save();
      res.status(200).send({ articles: article });
    } else if (commentId !== -1 && commentId !== "-1") {
      // update comment
      const comment = article.comments[commentId];
      if (!comment) {
        res.status(401).send({"alert":"No such comment with id"});
        return;
      }
      comment.comment = text;
      await article.save();
      res.status(200).send({ articles: article });
    } else {
      // add comment
      const comment = { comment: text, author: username };

      article.comments.push(comment);
      await article.save();
      res.status(200).send({ articles: article });
    }
  })();
}

function addArticle(req, res) {
  (async () => {
    const text = req.body.text;
    const img = req.body.img;
    if (!text) {
      res.status(400).send({"alert":"no text"});
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({"alert":"no user logged in"});
      return;
    }

    let article;
    let articles = await Article.find({}).exec();
    let new_id = articles.length +1;
    if (!img) {
      article = new Article({
        pid: new_id,
        author: username,
        text: text,
        date: new Date(),
        comments: [],
      });
    } else {
      article = new Article({
        pid: new_id,
        author: username,
        text: text,
        date: new Date(),
        comments: [],
        img: img,
      });
    }

    await article.save();
    res.status(200).send({ articles: article });
  })();
}

module.exports = (app) => {
  app.get("/articles/:id?", getArticles);
  app.get("/articlesByAuthor", getArticlesByAuthor);
  app.put("/articles/:id", updateArticle);
  app.post("/article", addArticle);
};

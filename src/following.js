const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://yufei:yufeipassword@cluster0.a1tnr.mongodb.net/?retryWrites=true&w=majority";

const userSchema = require("./userSchema");
const articleSchema = require("./articleSchema");
const profileSchema = require("./profileSchema");
//const followingSchema = require("./followingSchema");

const User = mongoose.model("user", userSchema);
const Article = mongoose.model("article", articleSchema);
const Profile = mongoose.model("profile", profileSchema);
//const Following = mongoose.model("following", followingSchema);

const connector = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function getFollowing(req, res) {
  (async () => {
    const username = req.params.user ? req.params.user : req.username;
    if (!username) {
      res.status(400).send({"alert":"no user logged in"});
      return;
    }

    const following = await Profile.findOne({
      username: username,
    }).exec();

    if (!following) {
      res.status(401).send({"alert":"Following not found"});
      return;
    }

    res
      .status(200)
      .send({ username: username, following: following.following });
  })();
}

function addFollowing(req, res) {
  (async () => {
    const follower_name = req.params.user;
    if (!follower_name) {
      res.status(400).send({"alert":"Please enter new follower's name"});
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({"alert":"no user logged in"});
      return;
    }

    const following = await Profile.findOne({
      username: username,
    }).exec();

    let follower;

    if (!following) {
      res.status(401).send({"alert":"Following not found, creating new following"});
      follower = new Profile({
        username: username,
        following: [follower_name],
      });
      return;
    } else {
      if (following.following.indexOf(follower_name) == -1 && follower_name != username) {
        const follower_real = await User.findOne({
            username: follower_name,
            }).exec();
            console.log("follower_real is "+ follower_real);
            console.log("follower_name is "+ follower_name);
            //console.log("following is "+ following.following.toString());
        if (!follower_real) {
            res.status(401).send({"alert": "Follower not found"});
            return;
        }

        following.following.push(follower_name);
        await following.save();
        res
          .status(200)
          .send({ username: username, following: following.following });
      } else {
        console.log("follower_name is "+ follower_name);
        console.log("following is "+ following.following.toString());
        res.status(401).send({ "alert" : "Already following or you can't follow yourself" });
        return;
      }
    }
  })();
}

function deleteFollowing(req, res) {
  (async () => {
    const remove_name = req.params.user;
    if (!remove_name) {
      res.status(400).send({"alert":"Please enter the name to be removed"});
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({"alert":"no user logged in"});
      return;
    }

    const following = await Profile.findOne({
      username: username,
    }).exec();

    if (!following) {
      res.status(401).send({"alert":"Following not found"});
      return;
    }

    const index = following.following.indexOf(remove_name);
    if (index > -1) {
      following.following.splice(index, 1);
    }

    await following.save();
    res
      .status(200)
      .send({ username: username, following: following.following });
  })();
}

module.exports = (app) => {
  app.get("/following/:user?", getFollowing);
  app.put("/following/:user", addFollowing);
  app.delete("/following/:user", deleteFollowing);
};

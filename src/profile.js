const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://yufei:yufeipassword@cluster0.a1tnr.mongodb.net/?retryWrites=true&w=majority";

const userSchema = require("./userSchema");
const articleSchema = require("./articleSchema");
const profileSchema = require("./profileSchema");

const User = mongoose.model("user", userSchema);
const Article = mongoose.model("article", articleSchema);
const Profile = mongoose.model("profile", profileSchema);
const uploadImage = require("./uploadCloudinary");

const connector = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function updateHeadline(req, res) {
  (async () => {
    const headline = req.body.headline;
    if (!headline) {
      res.status(400).send({ alert: "no new headline" });
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const user = await User.findOne({ username }).exec();

    if (!user) {
      res.status(401).send({ alert: "User not found" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    profile.headline = headline;
    await profile.save();
    res.status(200).send({ username: username, headline: headline });
  })();
}

function getHeadline(req, res) {
  (async () => {
    const username = req.params.username ? req.params.username : req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    res.status(200).send({
      username: username,
      headline: profile.headline ? profile.headline : "No headline",
    });
  })();
}

function getEmail(req, res) {
  (async () => {
    const username = req.params.username ? req.params.username : req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    res.status(200).send({
      username: username,
      email: profile.email ? profile.email : "No email",
    });
  })();
}

function updateEmail(req, res) {
  (async () => {
    const email = req.body.email;
    if (!email) {
      res.status(400).send({ alert: "no new email" });
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const user = await User.findOne({
      username: username,
    }).exec();

    if (!user) {
      res.status(401).send({ alert: "User not found" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    profile.email = email;
    await profile.save();
    res.status(200).send({ username: username, email: email });
  })();
}

function getPhone(req, res) {
  (async () => {
    const username = req.params.username ? req.params.username : req.username;

    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    res.status(200).send({
      username: username,
      phone: profile.phone ? profile.phone : "No phone",
    });
  })();
}

function updatePhone(req, res) {
  (async () => {
    const phone = req.body.phone;
    if (!phone) {
      res.status(400).send({ alert: "no new phone" });
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }
    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    profile.phone = phone;
    await profile.save();
    res.status(200).send({ username: username, phone: phone });
  })();
}

function getZipcode(req, res) {
  (async () => {
    const username = req.params.username ? req.params.username : req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    res.status(200).send({
      username: username,
      zipcode: profile.zipcode ? profile.zipcode : "No zipcode",
    });
  })();
}

function updateZipcode(req, res) {
  (async () => {
    const zipcode = req.body.zipcode;
    if (!zipcode) {
      res.status(400).send({ alert: "no new zipcode" });
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    profile.zipcode = zipcode;
    await profile.save();
    res.status(200).send({ username: username, zipcode: zipcode });
  })();
}

function getDob(req, res) {
  (async () => {
    const username = req.params.username ? req.params.username : req.username;

    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    res.status(200).send({
      username: username,
      dob: profile.dob ? profile.dob : "No dob",
    });
  })();
}


function getAvatar(req, res) {
  (async () => {
    const username = req.params.username ? req.params.username : req.username;

    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({ username: username }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    res.status(200).send({
      username: username,
      avatar: profile.avatar ? profile.avatar : "No avatar",
    });
  })();
}

function updateAvatar(req, res) {
  (async () => {
    let avatar = req.body.avatar;
    if (!avatar) {
      res.status(400).send({ alert: "no new avatar" });
      return;
    }
    const username = req.username;
    if (!username) {
      res.status(400).send({ alert: "no user logged in" });
      return;
    }

    const profile = await Profile.findOne({
      username: username,
    }).exec();

    if (!profile) {
      res.status(401).send({ alert: "Profile not found" });
      return;
    }

    profile.avatar = avatar;
    await profile.save();
    res.status(200).send({ username: username, avatar: avatar });
  })();
}

function uploadAvatar(req, res) {
  res.send({ url: req.fileurl });
}


module.exports = (app) => {
  app.put("/uploadAvatar", uploadImage("avatar"), uploadAvatar);
  app.put("/headline", updateHeadline);
  app.get("/headline/:user?", getHeadline);
  app.get("/email/:user?", getEmail);
  app.put("/email", updateEmail);
  app.get("/zipcode/:user?", getZipcode);
  app.put("/zipcode", updateZipcode);
  app.get("/dob/:user?", getDob);
  app.get("/avatar/:user?", getAvatar);
  app.put("/avatar", updateAvatar);
  app.get("/phone/:user?", getPhone);
  app.put("/phone", updatePhone);
};

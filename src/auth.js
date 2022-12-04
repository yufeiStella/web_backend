let sessionUser = {};
let cookieKey = "sid";
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://yufei:yufeipassword@cluster0.a1tnr.mongodb.net/?retryWrites=true&w=majority";

const md5 = require("md5");

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

function isLoggedIn(req, res, next) {
  (async () => {
    if (!req.cookies) {
      res.status(401).send({"alert in isLoggedIn": "You are not logged in: no cookie"});
      return;
    }

    let sid = req.cookies[cookieKey];
    if (!sid) {
      res.status(401).send({"alert in isLoggedIn": "You are not logged in: no sid"});
      return;
    }

    let username = sessionUser[sid];

    if (!username) {
      res.status(401).send({"alert in isLoggedIn": "You are not logged in: no username"});
      return;
    }
    let user = await User.findOne({ username: username }).exec();
    if (!user) {
      res.status(401).send({"alert in isLoggedIn": "You are not logged in: user not found"});
      return;
    }
    req.username = username;
    next();
  })();
}

function login(req, res) {
  (async () => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      res.status(400).send({"alert":"no username or password"});
      return;
    }
    const user = await User.findOne({ username : username }).exec();

    if (!user) {
      res.status(401).send({"alert":"User not found"});
      return;
    }

    const hash = md5(user.salt + password);
    if (hash !== user.hash) {
      res.status(401).send({"alert":"Password is incorrect"});
      return;
    }

    const profile = await Profile.findOne({ username : username  }).exec();
    const articles = await Article.find({ author : username  }).exec();

    const sid = md5(new Date().getTime() + username);
    sessionUser[sid] = username;
    res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true, secure: true, sameSite: 'none'});
    res.send({ username: username, result: "success" , profile: profile, articles: articles ? articles : []});
  })();
}

function logout(req, res) {
  (async () => {
    const sid = req.cookies[cookieKey];
    if (!sid) {
      res.status(401).send({"alert in logout": "You are not logged in: no sid"});
      return;
    }
    delete sessionUser[sid];
    res.clearCookie(cookieKey);
    res.send({ result: "OK" });
  })();
}

function register(req, res) {
  (async () => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const dob = req.body.dob;
    const zipcode = req.body.zipcode;
    //const avatar = req.body.avatar;
    const phone = req.body.phone;

    if (!username || !password) {
      res.status(400).send({"alert":"no username or password"});
      return;
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    let user = await User.findOne({ username }).exec();

    if (user) {
      res.status(401).send({"alert":"User already exists"});
      return;
    }

    let newUser = await createUser(username, salt, hash);

    let newProfile = await createProfile(username, email, dob, zipcode, phone);

    res.send({ result: "success", username: username });
  })();
}

async function createProfile(username, email, dob, zipcode, phone) {
  return new Profile({
    username: username,
    email: email,
    dob: dob,
    zipcode: zipcode,
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    following: [],
    headline: "default headline",
    status: "default status",
    phone: phone,
  }).save();
}

async function createUser(username, salt, hash) {
  return new User({
    username: username,
    salt: salt,
    hash: hash,
  }).save();
}

function changePassword(req, res) {
  (async () => {
    const username = req.username;
    const password = req.body.password;
    if (!username || !password) {
      res.status(400).send({"alert":"no username or password"});
      return;
    }
    const user = await User.findOne({ username }).exec();
    if (!user) {
      res.status(401).send({"alert":"User not found"});
      return;
    }

    const salt = username + new Date().getTime();
    const hash = md5(salt + password);
    user.salt = salt;
    user.hash = hash;
    await user.save();
    res.send({ username: username, result: "success" });
  })();
}

module.exports = (app) => {
  app.post("/login", login);
  app.post("/register", register);
  app.use(isLoggedIn);
  app.put("/logout", logout);
  app.put("/password", changePassword);
};

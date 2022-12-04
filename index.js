const auth = require('./src/auth');
const profile = require('./src/profile');
const articles = require('./src/articles');
const following = require('./src/following');
const cors = require('cors');
const corsOptions = {
     origin: ['http://localhost:3000', 'https://yufeizhanghw7.surge.sh'],
     credentials: true,
     sameSite: 'None',
     secure: true,
}


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(cors(corsOptions));
auth(app);
profile(app);
articles(app);
following(app);


// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})

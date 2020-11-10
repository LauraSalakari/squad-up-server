require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

require("./config/db.config");

app.use(
  session({
    secret: 'squad-secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
      autoRemove: 'disabled',
    }),
  })
);

// Middleware Setup
app.use(logger('dev'));

const cors = require('cors')
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Squad Up!';


// api routes
const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const gamesRoutes = require("./routes/games.routes");
app.use("/api", gamesRoutes);

const uploadRoutes = require("./routes/upload.routes");
app.use("/api", uploadRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

const squadRoutes = require("./routes/squad.routes");
app.use("/api", squadRoutes);

const forumsRoutes = require("./routes/forums.routes");
app.use("/api", forumsRoutes);
 
app.use((req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
})

module.exports = app;

require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var db = require("./models");
var app = express();
var PORT = process.env.PORT || 3000;

//authentication packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');

// Middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(express.static("public"));
app.use(expressValidator());

var options = {
  host: 'bmsyhziszmhf61g1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: 'tf0flkww6x5gjq2j'
};

var sessionStore = new MySQLStore(options);
//for express session 
app.use(session({
  secret: 'asdlkfj;salfkjnv9313y4e',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: __dirname + "/views/partials/"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

passport.use(new LocalStrategy(
  function (username, password, done) {

    //once the user sends the login info find the username in the db. 
    db.Users.findOne({
      where: {
        user_name: username
      }
    }).then((results) => {
      if (results === null) {
        //there is no user in the db
        if (!results){

          return done(null, false);
        }

        if(!user.validPassword(password)){
          return done(null, false);
        }

      }
      var checkpw = bcrypt.compareSync(password, results.password);

      if (checkpw === true) {

        return done(null, {
          id: results.id
        });
      } else {
        return done(null, false);
      }

    })
  }
));

var syncOptions = {
  force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
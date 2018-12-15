var db = require("../models");
var passport = require('passport');
module.exports = function (app) {

  app.get("/", (req, res) => {

    if (req.user === undefined) {
      res.redirect("/all");
    } else {
      res.render("index", {})
    }
  })

  app.get("/all", (req, res) => {
    res.render("all", {})
  })
  app.get("/profile", function (req, res) {
    if (req.isAuthenticated()) {

      res.render("profile", {
        username: "testing"
      })
    } else {
      //if not authenticated go to register
      res.redirect("/login");
    }
  });


  app.get("/createPost", function (req, res) {

    res.render("createPost", {})

  })

  //register get route
  app.get("/register", function (req, res) {
    res.render("register", {
      title: "Register"
    })
  });



  app.get('/logout', function (req, res) {
    req.logout()
    req.session.destroy(function (err) {
      res.redirect('/'); //Inside a callback… bulletproof!
    });
  })

  app.get("*", function (req, res) {
    res.render("404");
  });

};

//req.login uses these functions 
passport.serializeUser(function (user_id, done) {
  done(null, user_id)
})
//this gets the users info
passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});
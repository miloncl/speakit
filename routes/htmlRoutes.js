var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.render("index", {});
  });

  //the login route
  app.get("/login", function (req, res) {
    res.render("login", {})
  });

  app.get("/register", function (req, res) {
    res.render("register", {
      title: "Register"
    })
  });

  //register a different view when the user registers
  app.post("/register", function (req, res) {
    res.render("register", {
      title: "User Registered"
    })
  });
  //route for the subspeaks
  //This will display the posts of that specific subspeak
  app.get("/s/:username", function (req, res) {

  });

  app.get("/s/:subspeak/:post", function (req, res) {

  })

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
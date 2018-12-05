var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  //the login route
  app.get("/login", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("authentication", {});
    });
  });

  //register route
  app.post("/register", function(req, res) {});
  //route for the subspeaks
  //This will display the posts of that specific subspeak
  app.get("/s/:username", function(req, res) {
    db.Example.findOne({ where: { username: req.params.username } }).then(function(
      dbExample
    ) {
      res.render("s", {
        example: dbExample
      });
    });
  });

  app.get("/s/:subspeak/:post", function(req, res){
    db.Example.findOne({ where: { subspeak: req.params.subspeak }} )  
  })

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

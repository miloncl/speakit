var db = require("../models");
var expressValidator = require("express-validator");
var bcrypt = require('bcrypt');
var saltRounds = 10;

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new user
  app.post("/register", function(req, res) {
    //check the fields make sur they're not empty

    req.checkBody('username', 'Username cannot be empty.').notEmpty(); 
    req.checkBody('email', 'Email field must not be empty.').notEmpty(); 
    req.checkBody('email', 'Email field must be and email.').isEmail(); 
    req.checkBody('password', 'Password must be 8 characters long.').len(8, 100); 
    req.checkBody('passwordMatch', 'Password must be 8 characters long.').len(8, 100); 
    req.checkBody('passwordMatch', 'Password must be 8 characters long.').equals(req.body.password); 

    var errors = req.validationErrors();
    
    if(errors) {
      console.log(`errors: ${JSON.stringify(errors)}`) 

      res.render('register', {title: "Register",  errors: errors});
    } else {
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(req.body.password, salt); 
      //bcrypt the password then insert
        console.log('hello')
        db.Users.findOrCreate({
          where: { user_name: req.body.username },
          defaults: {
            user_name: req.body.username,
            user_email: req.body.email,
            password: hash 
          }
        }).spread((user, created) => {
          //read about spread at http://docs.sequelizejs.com/manual/tutorial/models-usage.html
          console.log(`created: ${created}`)
          if(created === false){
            res.render("register", {
              title: "That Username already exists"
            });
          } else {
            res.render("register", {
              title: "User Registered"
            });
          }
        })
    }
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};

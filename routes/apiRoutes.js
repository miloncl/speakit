var db = require("../models");
var expressValidator = require("express-validator");
var bcrypt = require('bcrypt');
var saltRounds = 10;
var passport = require('passport');

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

    //index page
    // Load index page
    app.get("/", function (req, res) {

      //testing to see if we're logged in 
      console.log(req.user);
      console.log(req.isAuthenticated());
      res.render("index", {
        user: req.isAuthenticated()
      });
    });

  //profile route
  app.get("/profile", function (req, res) {
    if(req.isAuthenticated()){

      res.render("profile", {
        username: "testing"
      })
    } else {
      //if not authenticated go to register
      res.redirect("/login");
    }
  });

  //load login page
  app.get("/login", function (req, res) {
    if(req.isAuthenticated()){

      res.redirect("/profile")
    } else {
      res.render("login", {title: "Login"})
    }
  });

  //login user
  app.post("/login", passport.authenticate('local', {
    successRedirect: '/profile', 
    failureRedirect: '/login'
  }));


  //register get route
  app.get("/register", function (req, res) {
    res.render("register", {
      title: "Register"
    })
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
    
    //if there are errors display them on screen 
    if(errors) {
      console.log(`errors: ${JSON.stringify(errors)}`) 

      res.render('register', {title: "Register",  errors: errors});
    } else {
      //hash the password 
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
          console.log(`user ${JSON.stringify(user.id)}`);
          if(created === false){
            res.render("register", {
              title: "That Username already exists"
            });
          } else {
            const user_id = JSON.stringify(user.id);
            //login the newly added user automatically using passport req.login is passport thing
            req.login(user_id, (err) => {
              res.redirect('/');
            })
          }
        })
    }
  });

  app.get('/logout', function(req, res){
    req.logout()
    req.session.destroy(function (err) {
      res.redirect('/'); //Inside a callback… bulletproof!
    });
  })

  app.post("/s/subspeaks", function(req, res){
    db.Subspeaks.create({ description: 'foo', views: 'bar', numberofsub: 5, icon: 'hello' }).then(task => {
      // you can now access the newly created task via the variable task
    })
  })

  app.post("/s/posts", function(req, res){
    db.Post.create({ post_text: 'foo', tags: 'bar', categories: '', views: 5, title: '', }).then(task => {
      // you can now access the newly created task via the variable task
    })
  })

//this route is not working
  app.post("/s/comments", function(req, res){
    db.Comments.create({ comments: 'foo', voting: 'bar',}).then(task => {
      // you can now access the newly created task via the variable task
    })
  })

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  app.get("*", function (req, res) {
    res.render("404");
  });
};

//req.login uses these functions 
passport.serializeUser(function(user_id, done) {
  done(null, user_id)
})

//this gets the users info
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});


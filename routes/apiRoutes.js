var db = require("../models");
var expressValidator = require("express-validator");
var bcrypt = require('bcrypt');
var saltRounds = 10;
var passport = require('passport');
var Sequelize = require("sequelize");
module.exports = function (app) {

  app.get("/api/checkLogin", (req, res) => {
    let userId = checkForMultipleUsers(req);
    let userObj = {}

    if (req.isAuthenticated()) {

      db.Users.findOne({
        where: {
          id: userId
        },
        include: [{
          model: db.SubbedSubspeaks,
          where: {
            UserId: userId
          },
          required: false
        }]
      }).then((userInfo) => {


        // console.log("USERINFO: " + JSON.stringify(userInfo));

        userObj = {
          id: userId,
          username: userInfo.user_name,
          subspeaks: userInfo.SubbedSubspeaks,
          logged: true
        }

        res.json(userObj)
      });
    } else {
      userObj = {
        id: "",
        username: "",
        subspeaks: "",
        logged: false
      }
      res.json(userObj)
    }

  })

  // get route for post... MySQL equiv... join... SELECT WHERE... 
  app.get("/api/post", function (req, res) {
    let userId = checkForMultipleUsers(req);
    let postArray = [];
    let userUpVoted = "";
    let userDownVoted = "";
    if (req.isAuthenticated()) {
      db.Users.findOne({
        where: {
          id: userId
        },
        include: [{
          model: db.SubbedSubspeaks,
          where: {
            UserId: userId
          },
          required: false
        }]
      }).then(userInfo => {

        for (let j = 0; j < userInfo.SubbedSubspeaks.length; j++) {
          db.Post.findAll({
            where: {
              SubspeakId: JSON.stringify(userInfo.SubbedSubspeaks[j].SubspeakId)
            }
          }).then(result => {
            //for each post get the votes and respond to request
            for (let i = 0; i < result.length; i++) {
              db.Users.findOne({
                where: {
                  id: result[i].UserId
                }
              }).then(op => {
                let originalPoster = op.user_name;
                db.Votes.findAll({
                  where: {
                    PostId: result[i].id
                  }
                }).then(votes => {
                  let countedVotes = 0;
                  let userUpVoted = "";
                  let userDownVoted = "";
                  votes.forEach(eachVote => {

                    if (eachVote.votes === "upvote") {
                      countedVotes++;
                      if (eachVote.UserId === userId) {
                        userUpVoted = "userUpVoted";
                      }
                    } else {
                      countedVotes--;
                      if (eachVote.UserId === userId) {
                        userDownVoted = "userDownVoted";
                      }
                    }
                    //see if the logged in user upvoted or downvoted

                  })
                  db.Comments.findAll({
                    where: {
                      PostId: result[i].id
                    }
                  }).then(comments => {

                    let post = {
                      id: result[i].id,
                      title: result[i].title,
                      post_text: result[i].post_text,
                      subspeak: userInfo.SubbedSubspeaks[j].subspeak_name,
                      votes: countedVotes,
                      op: originalPoster,
                      comments: comments.length,
                      upVoted: userUpVoted,
                      downVoted: userDownVoted
                    }
                    postArray.push(post)

                    if (j === userInfo.SubbedSubspeaks.length - 1 && i === result.length - 1) {
                      console.log(postArray)
                      res.json(postArray)
                    }
                  })

                })
              })
            }

          })
        }
      })
    }
  })

  app.get("/api/subspeakPosts/:name", function (req, res) {
    let postArray = []
    db.Subspeaks.findOne({
      where: {
        name: req.params.name
      },

    }).then(result => {

      db.Post.findAll({
        where: {
          SubspeakId: result.id
        }
      }).then(posts => {

        //for each post get the votes and respond to request
        for (let i = 0; i < posts.length; i++) {
          db.Users.findOne({
            where: {
              id: posts[i].UserId
            }
          }).then(op => {

            //need to query the users db to get OP
            console.log("OP: " + JSON.stringify(op));
            let originalPoster = op.user_name;
            db.Votes.findAll({
              where: {
                PostId: posts[i].id
              }
            }).then(votes => {
              let countedVotes = 0;
              votes.forEach(eachVote => {
                if (eachVote.votes === "upvote") {
                  console.log("anything")
                  countedVotes++;
                } else {
                  countedVotes--;
                }

              })
              db.Comments.findAll({
                where: {
                  PostId: posts[i].id
                }
              }).then(comments => {

                let post = {
                  id: posts[i].id,
                  title: posts[i].title,
                  post_text: posts[i].post_text,
                  subspeak: req.params.name,
                  votes: countedVotes,
                  op: originalPoster,
                  comments: comments.length
                }
                postArray.push(post)



                if (i === posts.length - 1) {
                  res.json(postArray)
                }
              })
            })
          })
        }
      })
    })
  })

  //login user
  app.post("/api/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',

  }));

  // Create a new user
  app.post("/api/register", function (req, res) {
    //check the fields make sur they're not empty

    req.checkBody('username', 'Username cannot be empty.').notEmpty();
    req.checkBody('email', 'Email field must not be empty.').notEmpty();
    req.checkBody('email', 'Email field must be and email.').isEmail();
    req.checkBody('password', 'Password must be 8 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Password must be 8 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Password must be 8 characters long.').equals(req.body.password);

    var errors = req.validationErrors();

    //if there are errors display them on screen 
    if (errors) {
      //console.log(`errors: ${JSON.stringify(errors)}`)

      res.render('register', {
        title: "Register",
        errors: errors
      });
    } else {
      //hash the password 
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(req.body.password, salt);
      //bcrypt the password then insert
      console.log('hello')
      db.Users.findOrCreate({
        where: {
          user_name: req.body.username
        },
        defaults: {
          user_name: req.body.username,
          user_email: req.body.email,
          password: hash
        }
      }).spread((user, created) => {
        //read about spread at http://docs.sequelizejs.com/manual/tutorial/models-usage.html
        console.log(`created: ${created}`)
        console.log(`user ${JSON.stringify(user.id)}`);
        if (created === false) {
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

  app.post("/api/createPost", function (req, res) {


    db.Subspeaks.findOne({
      where: {
        name: req.body.subspeakName
      }
    }).then((result) => {
      let userId = checkForMultipleUsers(req);
      //console.log("Results: " + result.id, "Title: " + req.body.title)
      db.Post.create({
        post_text: req.body.text,
        title: req.body.title,
        SubspeakId: result.id,
        UserId: userId
      }).then(task => {
        db.Votes.create({
          votes: "upvote",
          UserId: userId,
          PostId: task.id
        })
      })
      res.json(true)
    })

  });

  //load a subspeak 
  app.get("/s/:subspeak", function (req, res) {
    let userId = checkForMultipleUsers(req);
    db.Subspeaks.findOne({
      where: {
        name: req.params.subspeak
      },
      include: [{
        model: db.SubbedSubspeaks,
        where: {
          UserId: userId
        },
        required: false
      }]
    }).then((result) => {
      console.log("Load Subspeak: " + JSON.stringify(result.SubbedSubspeaks))
      if (result) {
        if (result.SubbedSubspeaks.length === 0) {
          res.render("subspeaks", {
            subspeakName: result.name,
            subspeakId: result.id,
            subspeakDescription: result.description,
            subscribed: false
          })
        } else {

          for (let i = 0; i < result.SubbedSubspeaks.length; i++) {
            if (result.SubbedSubspeaks[i].SubspeakId === result.id) {
              res.render("subspeaks", {
                subspeakName: result.name,
                subspeakId: result.id,
                subspeakDescription: result.description,
                subscribed: true
              })
              return;
            }
          }
        }
      } else {

        res.render("subspeaks", {})
      }
    })
  });

  //load the post on the page
  app.get("/s/p/:postTitle", function (req, res) {
    let numberOfVotes = 0;
    db.Post.findOne({
      where: {
        title: req.params.postTitle
      },

    }).then(result => {
      db.Subspeaks.findOne({
        where: {
          id: result.SubspeakId
        }
      }).then(subspeak => {

        db.Users.findOne({
          where: {
            id: result.UserId
          }
        }).then(user => {

          db.Votes.findAll({
            where: {
              PostId: result.id
            }
          }).then(votes => {
            console.log("Votes: " + JSON.stringify(votes));
            
            votes.forEach(element => {
              if (element.votes === "upvote") {
                numberOfVotes++;
              } else {
                numberOfVotes--;
              }
            });
            res.render("postPage", {
              postName: result.title,
              postText: result.post_text,
              postId: result.id,
              votes: numberOfVotes,
              user: user.user_name,
              subspeak: subspeak.name
            })
          })
        })
      })
    })
  })

  app.get("/api/getComments/:id", function (req, res) {
    db.Comments.findAll({
      where: {
        PostId: req.params.id
      }
    }).then(comments => {
      let commentArray = [];
      for (let i = 0; i < comments.length; i++) {

        db.Users.findOne({
          where: {
            id: comments[i].UserId
          }
        }).then(users => {
          let comment = {
            comments: comments[i].comments,
            user: users.user_name
          }
          commentArray.push(comment)
          if (i === comments.length - 1) {
            res.json(commentArray);

          }
        })
      }
    })
  })
  //get all post
  app.get("/api/getAll", function (req, res) {
    let userId = checkForMultipleUsers(req);
    let posts = []
    let userUpVoted = "";
    let userDownVoted = "";
    db.Post.findAll({}).then(post => {

      for (let i = 0; i < post.length; i++) {
        db.Users.findOne({
          where: {
            id: post[i].UserId
          }
        }).then(op => {


          db.Subspeaks.findOne({
            where: {
              id: post[i].SubspeakId
            }

          }).then(subspeak => {

            db.Votes.findAll({
              where: {
                PostId: post[i].id
              }
            }).then(votes => {

              let countedVotes = 0;
              let userUpVoted = "";
              let userDownVoted = "";
              votes.forEach(eachVote => {
                if (eachVote.votes === "upvote") {
                  countedVotes++;
                  if (eachVote.UserId === userId) {

                    userUpVoted = "userUpVoted";
                  }
                } else {
                  countedVotes--;
                  if (eachVote.UserId === userId) {

                    userDownVoted = "userDownVoted"
                  }
                }

              })

              db.Comments.findAll({
                where: {
                  PostId: post[i].id
                }
              }).then(comments => {

                let fullPost = {
                  title: post[i].title,
                  subspeak: subspeak.name,
                  post_text: post[i].post_text,
                  votes: countedVotes,
                  op: op.user_name,
                  comments: comments.length,
                  upVoted: userUpVoted,
                  downVoted: userDownVoted
                }
                posts.push(fullPost);
                if (i === post.length - 1) {
                  res.json(posts)
                }
              })
            })
          })
        })
      }
    });
  })
  //post a reply to the post
  app.post("/api/postComment", function (req, res) {
    let userId = checkForMultipleUsers(req);
    db.Comments.create({
      comments: req.body.comment,
      UserId: userId,
      PostId: req.body.id
    }).then(result => {})
  })
  //get the users subscriptions
  app.get("/api/subscribe", function (req, res) {
    let userId = checkForMultipleUsers(req);

    db.SubbedSubspeaks.findAll({
      where: {
        UserId: userId
      }
    }).then((userSubs) => {
      let randomSpeaks = [];
      let usedNumbers = [];
      if (userSubs.length === 0) {
        db.Subspeaks.findAll({
          order: Sequelize.literal('rand()'),
          limit: 5
        }).then(speaks => {

          console.log(`RandomSpeaks: ${speaks}`)
          res.json({
            noSubs: true,
            subspeaks: speaks
          })
        })
      } else {


        console.log("SUBSCRIBED: " + JSON.stringify(userSubs));

        res.json(userSubs)
      }
    })
  });
  //subscribe the logged in user to a subspeak
  app.post("/api/subscribe", function (req, res) {
    let userId = checkForMultipleUsers(req);
    console.log(req.body)
    //create a new sub
    db.SubbedSubspeaks.create({
      subspeak_name: req.body.name,
      subspeak_description: req.body.description,
      SubspeakId: req.body.subspeakId,
      UserId: userId
    }).then(result => {
      console.log("SUBSCRIBE" + result)
      res.json(result)
    })

  })

  //unsubscribe a user from the subspeak
  app.delete("/api/subscribe/:id/:name", function (req, res) {
    let userId = checkForMultipleUsers(req);
    db.SubbedSubspeaks.destroy({
      where: {
        SubspeakId: req.params.id,
        UserId: userId
      }
    })
    res.json("done")
  })
  //get all data from client js file
  app.post("/api/subspeaks", function (req, res) {
    console.log(req.body)

    let userId = checkForMultipleUsers(req);

    db.Subspeaks.findOrCreate({

      where: {
        name: req.body.name
      },
      defaults: {
        name: req.body.name,
        description: req.body.description,
        views: req.body.views,
        numberofsubs: req.body.numberofsubs,
        icon: req.body.icon,
        createdBy: userId
      }
    }).spread((results, created) => {
      console.log(`Created Subspeak : ${created}`)
      if (created === false) {
        res.json(false) 
      } else {
   

        //automatically subscibe the user to their subspeak 
        db.SubbedSubspeaks.create({
          subspeak_name: results.name,
          subspeak_description: results.description,
          SubspeakId: results.id,
          UserId: userId
        })
        res.json(true)
      }
    })
  })

  app.post("/s/posts", function (req, res) {
    db.Post.create({
      post_text: 'foo',
      tags: 'bar',
      categories: '',
      views: 5,
      title: '',
    }).then(task => {
      // you can now access the newly created task via the variable task
    })
  })

  app.post("/api/upvotePost/:id", function (req, res) {
    let userId = checkForMultipleUsers(req);
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.Votes,
        where: {
          UserId: userId
        },
        required: false
      }]
    }).then(result => {

      if (result.Votes.length !== 0) {
        if (result.Votes.votes === "downvote") {

          db.Votes.create({
            votes: "upvote",
            PostId: req.params.id,
            UserId: userId,
          }).then(() => {
            db.Votes.destroy({
              where: {
                id: result.Votes[0].id
              }
            })
          })

        } else {

          //this means that the user already has voted
          //delete the already existing upvote that the user did
          db.Votes.destroy({
            where: {
              id: result.Votes[0].id
            }
          })
        }

      } else {
        db.Votes.create({
          votes: "upvote",
          PostId: req.params.id,
          UserId: userId,
        })
      }
    })
  })

  app.post("/api/downvotePost/:id", function (req, res) {
    let userId = checkForMultipleUsers(req);
    db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.Votes,
        where: {
          UserId: userId
        },
        required: false
      }]
    }).then(result => {
      console.log(result)
      if (result.Votes.length !== 0) {
        if (result.Votes.votes === "upvote") {

          db.Votes.create({
            votes: "downvote",
            PostId: req.params.id,
            UserId: userId,
          }).then(() => {
            db.Votes.destroy({
              where: {
                id: result.Votes[0].id
              }
            })
          })

        } else {

          //this means that the user already has voted
          //delete the already existing upvote that the user did
          db.Votes.destroy({
            where: {
              id: result.Votes[0].id
            }
          })
        }

      } else {
        db.Votes.create({
          votes: "downvote",
          PostId: req.params.id,
          UserId: userId,
        })
      }
    })
  })


};

function checkForMultipleUsers(req) {
  let userId;

  //check if req.user is an object, if there are multiple users in a table than it is, if there's one than it's not
  if (typeof req.user !== 'object') {
    console.log('not an object')
    return userId = req.user
  } else {
    return userId = req.user.id
  }
}

//req.login uses these functions 
passport.serializeUser(function (user_id, done) {
  done(null, user_id)
})
//this gets the users info
passport.deserializeUser(function (user_id, done) {
  done(null, user_id);
});
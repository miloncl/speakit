let subspeakName = $('#subspeakName');
let subspeakDesc = $('#subspeakDesc');
let loginUsername = $('#loginUsername');
let loginPassword = $('#loginPassword');
let cpSSName = $("#cpSSName");
let cpSSTitle = $("#cpSSTitle");
let cpSSTextArea = $("#cpSSTextArea");
// The API object contains methods for each kind of request we'll make
var API = {
  checkUser: function () {
    return $.ajax({
      url: "/api/checkLogin",
      type: "GET"
    })
  },
  getAll: function () {
    return $.ajax({
      url: "/api/getAll",
      type: "GET"
    })
  },
  loginUser: function () {
    return $.ajax({
      url: "/api/login",
      type: "POST"
    })
  },
  createSubspeak: function (data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/subspeaks",
      data: JSON.stringify(data)
    });
  },
  createPost: function (data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/createPost",
      data: JSON.stringify(data)
    })
  },
  subscribe: function (data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/subscribe",
      data: JSON.stringify(data)
    });
  },

  getSubscribed: function () {
    return $.ajax({
      url: "/api/subscribe",
      type: "GET"
    });
  },
  unSubscribe: function (id, name) {
    return $.ajax({
      url: "/api/subscribe/" + id + "/" + name,
      type: "DELETE"
    });
  },
  getPost: function () {
    return $.ajax({
      url: "/api/post",
      type: "GET"
    });
  },
  getSubspeaksPosts: function (name) {
    return $.ajax({
      url: "/api/subspeakPosts/" + name,
      type: "GET"
    });
  },
  postComment: function (data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/postComment",
      data: JSON.stringify(data)
    });
  },
  getComments: function (id) {
    return $.ajax({
      url: "/api/getComments/" + id,
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

$(document).ready(function () {
  checkForUser();

  function checkForUser() {

    API.checkUser().then((user) => {
      console.log(user);
      if (user.logged === false) {

        let loginBtn = $('<button type="button" class="btn btn-info btn-lg mainBtn" data-toggle="modal" data-target="#myModal"><i class="fas fa-sign-in-alt loginIcon"></i>Login</button>')

        let ul = $(` <ul>
        <li><a href="/"><i class="far fa-newspaper" id="myFeed"></i></a></li>
        <li><a href="/"><i class="fas fa-cog" id="settings"></i></li>
        
      </ul>`)
        $('.username').append(loginBtn)
        $('#navList').append(ul)

        API.getAll().then(post => {

          console.log(post);

          //create post

          post.forEach(element => {
            console.log(element)
            let newPost = $(

              `<div class="col-xl-12">
              <div class="post_container">

                  <div class="post_title_container d-flex">
                    <h3 class="title"><a href="/s/p/${element.title}">${element.title}</a></h3>
                    <a href="/s/${element.subspeak}"class="subspeak_name ml-auto">${element.subspeak}</a>
                  </div>
                  
                  <div class="post_description"> 
                  ${element.post_text}
                  </div>
                  <div class="d-flex post_footer">
                    <ul>
                      <li><i class="far fa-comments"></i></li>
                      <li><i class="far fa-bookmark"></i></li>
                      <li><i class="fas fa-user-edit"></i></li>
                      <li><button class="upvote"><i class="fas fa-arrow-up"></i></button>${element.votes}<button class="downvote"><i class="fas fa-arrow-down"></i></button></li>
                    </ul>

                  <span class="badges ml-auto">
                  <ul>
                  <li><i class="far fa-smile"></i></li>
                  <li><i class="fas fa-info"></i></li>
                  <li><i class="fas fa-pencil-alt"></i></li>
                </ul>
                  </span>
                </div>
              </div>`)

            $("#post_row").prepend(newPost);
          });

        })
      } else {
        let username = $(`<p>${user.username}</p>`)
        let logout = $(`<a href="/logout">Logout</a>`);

        let dropdown = $(`

        <div class="btn-group">
          <button type="button" class="btn dropdown dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <p>${user.username}<i class="fa down-arrow fa-angle-down"></i></p>
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="/logout">Logout</a>
          </div>
        </div>
        `)

        let ul = $(` <ul>
        <li><a href="/"><i class="far fa-newspaper" id="myFeed"></i></a></li>
        <li><a href="/"><i class="fas fa-cog" id="settings"></i></li>
        <li><a href="/createPost"><i class="far fa-edit" id="createPost"></i></a></li>
        <li><button type="button" data-toggle="modal" data-target="#ssModal" id="createSSBtn"><i class="fas fa-pen-nib"
              id="createSS"></i></button></li>
      </ul>`)
        $('.username').append(dropdown);
        $('#navList').append(ul)
        refreshSubscriptions();

        //if on my feed page
        if (window.location.pathname === "/") {
          API.getPost().then(post => {

            post.forEach(element => {
              console.log(element)
              let newPost = $(

                `<div class="col-xl-12">
                <div class="post_container">

                    <div class="post_title_container d-flex">
                      <h3 class="title"><a href="/s/p/${element.title}">${element.title}</a></h3>
                      <a href="/s/${element.subspeak}"class="subspeak_name ml-auto">${element.subspeak}</a>
                    </div>
                    
                    <div class="post_description"> 
                    ${element.post_text}
                    </div>
                    <div class="d-flex post_footer">
                      <ul>
                        <li><i class="far fa-comments"></i></li>
                        <li><i class="far fa-bookmark"></i></li>
                        <li><i class="fas fa-user-edit"></i></li>
                        <li><i class="fas fa-arrow-up"></i><i class="fas fa-arrow-down"></i></li>
                      </ul>

                    <span class="badges ml-auto">
                    <ul>
                    <li><i class="far fa-smile"></i></li>
                    <li><i class="fas fa-info"></i></li>
                    <li><i class="fas fa-pencil-alt"></i></li>
                  </ul>
                    </span>
                  </div>
                </div>`)

              $("#post_row").prepend(newPost);
            });

          })
        }

        //load the subspeak posts
        if (window.location.pathname.includes("/s/") && !window.location.pathname.includes("/p/")) {

          console.log(window.location.pathname);
          let subspeakName = window.location.pathname.split("/");
          subspeakName = subspeakName[2]
          console.log(subspeakName)
          API.getSubspeaksPosts(subspeakName).then(posts => {
            posts.forEach(element => {
              let newPost = $(

                `<div class="col-xl-12">
                <div class="post_container">

                    <div class="post_title_container d-flex">
                      <h3 class="title">${element.title}</h3>
                      <a href="/s/${subspeakName}"class="subspeak_name ml-auto">${subspeakName}</a>
                    </div>
                    
                    <div class="post_description"> 
                    ${element.post_text}
                    </div>
                    <div class="d-flex post_footer">
                      <ul>
                        <li><i class="far fa-comments"></i></li>
                        <li><i class="far fa-bookmark"></i></li>
                        <li><i class="fas fa-user-edit"></i></li>
                        <li><i class="fas fa-arrow-up"></i><i class="fas fa-arrow-down"></i></li>
                      </ul>

                    <span class="badges ml-auto">
                    <ul>
                    <li><i class="far fa-smile"></i></li>
                    <li><i class="fas fa-info"></i></li>
                    <li><i class="fas fa-pencil-alt"></i></li>
                  </ul>
                    </span>
                  </div>
                </div>`)

              $("#post_row").append(newPost);
            });
          })


        }
        //load the posts page
        if (window.location.pathname.includes("/p/")) {
          let postId = $("#postName").attr('data-id');
          API.getComments(postId).then(result => {
            console.log(result)

            result.forEach(element => {
              let newComment = $(
                `<div class="col-xl-12">
                <div class="row" id="comments_row">
                <div class="commentContainer">
                  <div class="commentBody d-flex">
                    ${element.comments}
                  </div>
                  <div class="commentFooter d-flex">
                    <ul>
                      <li>User</li>
                      <li>Voting</li>
                    </ul>
                  </div>
                </div>
              </div> 
                </div>`
              )
              $("#comments_row").append(newComment);
            });
          })

        }

      }
    })

  }

  function refreshSubscriptions() {
    API.getSubscribed().then((usersSubs) => {
      console.log(usersSubs)

      $(".subspeak_main_div").empty();
      usersSubs.forEach(element => {

        let heading = $(`<h3 class="subspeak_name"><a class="sideMenuSubspeakButtons" data-id="${element.SubspeakId}" href="/s/${element.subspeak_name}">${element.subspeak_name}</a></h3>`)
        let description = $(`<p class="subspeak_description">${element.subspeak_description}</p>`)
        let mainDiv = $(`<div class="sidebar_subspeaks d-flex flex-column align-items-start justify-content-center"></div>`)

        mainDiv.append(heading);
        mainDiv.append(description);
        $(".subspeak_main_div").append(mainDiv)

      });
    })
  }

  function refreshPosts() {
    console.log("refresh posts");
  }

  $("#createPostForm").submit(function (event) {
    event.preventDefault();

    var data = {
      subspeakName: cpSSName.val().trim(),
      title: cpSSTitle.val().trim(),
      text: cpSSTextArea.val()
    }

    API.createPost(data).then(function () {
      refreshPosts();
    })

  })

  //form submit for when a user creates a new subspeak
  $("#createSSForm").submit(function (event) {

    //data gets sent to the api rout /s/subspeaks
    event.preventDefault();

    var data = {
      name: subspeakName.val().trim(),
      views: 0,
      description: subspeakDesc.val().trim(),
      numberofsubs: 1,
      icon: "hello",
      createdBy: ""
    }

    API.createSubspeak(data).then(function () {
      refreshSubscriptions();
    });

    subspeakName.val("");
    subspeakDesc.val("");

  })

  //when the user clicks the subscribe button on the subspeak page
  $(document).on("click", "#ssSubscribe", function () {
    console.log("Run")
    var data = {
      name: $("#ssSubscribe").attr("data-subspeak"),
      description: $("#ssSubscribe").attr("data-description"),
      subspeakId: $("#ssSubscribe").attr("data-id")
    }
    API.subscribe(data).then(function () {

    })
  })

  //when the user clicks the subscribe button on the subspeak page
  $(document).on("click", "#ssUnSubscribe", function () {
    console.log("Run")
    var subspeakName = $("#ssUnSubscribe").attr("data-subspeak");
    var id = $("#ssUnSubscribe").attr("data-id");

    API.unSubscribe(id, subspeakName).then(function () {

    })
  })

  //post a comment
  $(document).on("click", "#postAComment", function () {
    var postId = $("#postAComment").attr("data-id");
    var commentText = $('#commentTextArea').val();
    console.log(postId)
    var data = {
      id: postId,
      comment: commentText
    }
    API.postComment(data).then(comment => {
      if (comment) {
        window.location.reload();
      }
    })
  })

})
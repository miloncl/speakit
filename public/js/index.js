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
  upvotePost: function (id, data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "/api/upvotePost/" + id,
      type: "POST",
      data: JSON.stringify(data)
    });
  },
  downvotePost: function (id, data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "/api/downvotePost/" + id,
      type: "POST",
      data: JSON.stringify(data)
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

      if (user.logged === false) {
        //force go to /all
        let leftBarTitle = $(`<span id="subspeaks_title_left_bar">LOGIN TO SEE SUBSPEAKS</span>`)
        let leftImage = $(`<img id="leftBarPlaceholder" src="../images/leftMenuPlaceholder.png">`)
        let loginBtn = $('<button type="button" class="btn btn-info btn-lg mainBtn" data-toggle="modal" data-target="#myModal"><i class="fas fa-sign-in-alt loginIcon"></i>Login</button>')

        let ul = $(` <ul>
        <li><a href="/"><i class="fas fa-list-ol" id="all"></i></li>
        
        </ul>`)
        $('.username').append(loginBtn)
        $('#navList').append(ul)
        $('#subspeaks_title_div').append(leftBarTitle);
        $('.subspeak_main_div').append(leftImage);
        //load the all page
        loadAll();

      } else {
        let leftBarTitle = $(`<span id="subspeaks_title_left_bar">MY SUBSPEAKS</span>`)
        //the right bar content when logged in 
        let dropdown = $(`

        <div class="btn-group d-flex justify-content-center">
          <button type="button" class="btn dropdown dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <p class="dropdownP"><i class="far fa-user"></i><span id="dropdownUsername">${user.username}</span><i class="fa down-arrow fa-angle-down"></i></p>
          </button>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="/logout">Logout</a>
          </div>
        </div>
        `)

        let ul = $(` <ul>
        <li><a href="/"><i class="far fa-newspaper menuIcons" id="myFeed" title="My Feed"></i></a></li>
        <li><a href="/all"><i class="fas fa-list-ol menuIcons" id="all" title="All Posts"></i></li>
        <li><a href="/createPost"><i class="far fa-edit menuIcons" title="Create a Post" id="createPost"></i></a></li>
        <li><button type="button" data-toggle="modal" data-target="#ssModal" id="createSSBtn"><i class="fas fa-pen-nib menuIcons"
              id="createSS" title="Create a Subspeak"></i></button></li>
      </ul>`)
        $('.username').append(dropdown);
        $('#navList').append(ul)
        $('#subspeaks_title_div').append(leftBarTitle);
        refreshSubscriptions();

        //if on my feed page
        if (window.location.pathname === "/") {
          API.getPost().then(posts => {
            function sortNumber(a, b) {
              return a.votes - b.votes;
            }

            posts.sort(sortNumber);
            posts.forEach(element => {
              addPostToPage(element);
            });

          })
        }

        //if on /all page
        loadAll();
        //if on subspeaks page
        if (window.location.pathname.includes("/s/") && !window.location.pathname.includes("/p/")) {

          let subspeakName = window.location.pathname.split("/");
          subspeakName = subspeakName[2]
        

          API.getSubspeaksPosts(subspeakName).then(posts => {
            //sort posts by votes

            function sortNumber(a, b) {
              return a.votes - b.votes;
            }

            posts.sort(sortNumber);

            posts.forEach(element => {
              addPostToPage(element);
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
                      <li> <li class="postIcons"><i class="fas fa-user-edit"></i><span>${element.user}</span></li></li>
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

  function loadAll() {
    if (window.location.pathname === "/all") {


      API.getAll().then(posts => {

        function sortNumber(a, b) {
          return a.votes - b.votes;
        }

        posts.sort(sortNumber);
        posts.forEach(element => {
          addPostToPage(element);
        });
      })
    }

  }

  function refreshSubscriptions() {
    API.getSubscribed().then((usersSubs) => {
      console.log(`USERSUBS: ${usersSubs}`)


      $(".subspeak_main_div").empty();


      if (usersSubs.noSubs !== true) {
        usersSubs.forEach(element => {

          let heading = $(`<h3 class="subspeak_name"><a class="sideMenuSubspeakButtons" data-id="${element.SubspeakId}" href="/s/${element.subspeak_name}">${element.subspeak_name}</a></h3>`)
          let description = $(`<p class="subspeak_description">${element.subspeak_description}</p>`)
          let mainDiv = $(`<div class="sidebar_subspeaks d-flex flex-column align-items-start justify-content-center"></div>`)

          mainDiv.append(heading);
          mainDiv.append(description);
          $(".subspeak_main_div").append(mainDiv)

         
        });
         //if on the create post page load the posts into the dropdown
         if (window.location.pathname === ("/createPost")) {
          usersSubs.forEach(element => {
            let option = $(`<option value=${element.subspeak_name}>${element.subspeak_name}</option>`);
            $("#cpSSName").append(option);
          })
        }
      } else {
        console.log(usersSubs);
        //no subscriptions
        let leftImage = $(`<img id="leftBarPlaceholder" src="../images/leftMenuPlaceholder.png">`)
        let subscribeMessage = $(`
        <div class="col-xl-12  text-center">
        <p id="subscribeSuggestion">SUBSCRIBE TO SUBSPEAKS TO SEE POSTS</p>
        <p id="subscribeSuggestionSecondary">Check out these Subspeaks</p>
        </div>
        `)
        $('.subspeak_main_div').append(leftImage);
        if (window.location.pathname === "/") {
          $('#post_row').append(subscribeMessage);

          usersSubs.subspeaks.forEach(subs => {

            let randomSubspeaks = $(`
            <div class="col-xl-12 text-center">
            <a class="testSubspeaks" href="/s/${subs.name}">${subs.name}</a>
            <p class="testSubspeaksDesc">${subs.description}</p>
            </div>
            `)
            $('#post_row').append(randomSubspeaks);
          })
        }


      }
    })
  }

  function addPostToPage(element) {
    let newPost = $(
      `<div class="col-xl-12">
      <div class="post_container">

          <div class="post_title_container d-flex">
            <h3 class="title"><a href="/s/p/${element.title}">${element.title}<i class="fas fa-chevron-right"></i></a></h3>
            <a href="/s/${element.subspeak}"class="subspeak_name_post ml-auto">${element.subspeak}</a>
          </div>
          
          <div class="post_description"> 
          ${element.post_text}
          </div>
          <div class="d-flex post_footer">
            <ul>
              <li class="postIcons"><i class="far fa-comments"></i><span>${element.comments}</span></li>
              <li class="postIcons"><i class="fas fa-user-edit"></i><span>${element.op}</span></li>
              <li class="postIcons"><button data-postid="${element.id}" class="upvote "><i class="fas fa-arrow-up ${element.upVoted}"></i></button><span>${element.votes}</span><button data-postid="${element.id}" class="downvote "><i class="fas fa-arrow-down ${element.downVoted}"></i></button></li>
            </ul>

       
        </div>
      </div>`)

    $("#post_row").prepend(newPost);
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

    API.createPost(data).then(function (done) {

    })
    refreshPosts();
    console.log("POSTED")

    $('#cpSSTitle').val("");
    $('#cpSSTextArea').val("");
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

    });
    refreshSubscriptions();

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
    API.subscribe(data).then(function (result) {
      console.log(result)
      if(result){
        location.reload();
      }
    })
    // location.reload();
  })

  //when the user clicks the subscribe button on the subspeak page
  $(document).on("click", "#ssUnSubscribe", function () {
    console.log("Run")
    var subspeakName = $("#ssUnSubscribe").attr("data-subspeak");
    var id = $("#ssUnSubscribe").attr("data-id");

    API.unSubscribe(id, subspeakName).then(function (data) {
      if(data === "done"){
        location.reload();
      }
    })
    
    
  })

  //when a user clicks upvote
  $(document).on("click", ".upvote", function () {
    let postId = $(this).attr("data-postid")
    let data = {};
    API.upvotePost(postId, data).then(done => {

    })
    setTimeout(function () {location.reload()}, 2000)
  })
  //when a user clicks downvote
  $(document).on("click", ".downvote", function () {
    let postId = $(this).attr("data-postid")
    let data = {};
    API.downvotePost(postId, data).then(done => {

    })
    location.reload();
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
      }
    })
    if(commentText !== ""){

      location.reload();
    }
  })

})
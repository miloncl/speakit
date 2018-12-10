let subspeakName = $('#subspeakName');
let subspeakDesc = $('#subspeakDesc');
let loginUsername = $('#loginUsername');
let loginPassword = $('#loginPassword');
// The API object contains methods for each kind of request we'll make
var API = {
  checkUser: function () {
    return $.ajax({
      url: "/api/checkLogin",
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
        $('.username').append(loginBtn)
      } else {
        let username = $(`<p>${user.username}</p>`)
        let logout = $(`<a href="/logout">Logout</a>`);
        $('.username').append(username);
        $('.username').append(logout);

        refreshSubscriptions();
      }
    })

  }

  function refreshSubscriptions() {
    API.getSubscribed().then((usersSubs) => {
      console.log(usersSubs)

      $(".subspeak_main_div").empty();
      usersSubs.forEach(element => {

        let heading = $(`<h3 class="subspeak_name"><a href="/s/${element.subspeak_name}">${element.subspeak_name}</a></h3>`)
        let description = $(`<p class="subspeak_description">${element.subspeak_description}</p>`)
        let mainDiv = $(`<div class="sidebar_subspeaks d-flex flex-column align-items-start justify-content-center"></div>`)

        mainDiv.append(heading);
        mainDiv.append(description);
        $(".subspeak_main_div").append(mainDiv)

      });
    })
  }



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

})
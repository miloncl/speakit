// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

let subspeakName = $('#subspeakName');
let subspeakDesc = $('#subspeakDesc');

// The API object contains methods for each kind of request we'll make
var API = {
  createSubspeak: function(data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/subspeaks",
      data: JSON.stringify(data)
    });
  },
  subscribe: function(data) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/subspeaks",
      data: JSON.stringify(data)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};


//create a subspeak form 
$("#createSSForm").submit(function (event){

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

  API.createSubspeak(data).then(function() {
    // refreshExamples();
  });

  subspeakName.val("");
  subspeakDesc.val("");

})

$("#ssSubscribe").click(function() {
  var data = {
    name: $("#ssSubscribe").attr("data-subspeak")
  }
  API.subscribe(data).then(function (){

  })
})

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};


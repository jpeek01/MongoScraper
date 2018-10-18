$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articleDisplay").append(
            "<img src='" + data[i].image + "'></img>" +
            "<a href='" + data[i].link + "' target='_blank'>Link</a>" +
            "<br>" +
            "<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>"
        );
    }
  });

  $(document).on("click", "p", function() {

    $("#notesDisplay").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
     .then(function(data) {
        console.log(data);

        $("#notesDisplay").append("<h2>" + data.title + "</h2>");

        $("#notesDisplay").append("<input id='titleinput' name='title' >");

        $("#notesDisplay").append("<textarea id='bodyinput' name='body'></textarea>");

        $("#notesDisplay").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  




    function clear() {
        $('#articleDisplay').empty();
    }

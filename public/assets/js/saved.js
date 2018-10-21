$.getJSON("/savedArticles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#cardContainer").append(
            "<div class='card m-2 articleCard'>" + 
                "<img class='card-img-top' src='" + data[i].image + "'></img>" +
                "<div class='card-body' id='linkHolder'>" +
                    "<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>" +
                    "<div id='buttonHolder'><hr>" +
                        "<button type='button' class='btn btn-primary mx-1' id='noteModal' data-toggle='modal' data-target='#notes' data-id='" + data[i]._id + "'>Add Note</button>" +
                    "</div>" +
                "</div>" + 
            "</div>"  
        );
    }
  });

  $(document).on("click", "#noteModal", function() {

    $("#modalForm").empty();
    $("#modalButtons").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
    method: "GET",
    url: "/articles/" + thisId
    })
    .then(function(data) {
        // console.log(data);

        $("#modalForm").append(
            "<div class='form-group'>" +
                "<label for='noteTextarea' id='noteTitle'>" + data.title + "</label>" +
                "<textarea class='form-control' id='FormControlTextarea' rows='3'></textarea>" +
            "</div>"
        );

        $("#modalButtons").append(
            "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>" +
            "<button type='button' class='btn btn-primary' id='saveNote' data-id='" + thisId + "'><i class='fas fa-save'></i> Save</button>"
        );

        // if (data.note) {;
        //     $("#FormControlTextarea").val(data.note.body);
        // }
    });
});

$(document).on("click", "#saveNote", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            note: $("#FormControlTextarea").val()
        }
    }).then(function(data) {

        $("#FormControlTextarea").empty();
    });
});

$(document).on("click", "#articles", function() {
    window.location.href = "/";
});
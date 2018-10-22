$.getJSON("/savedArticles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#cardContainer").append(
            "<div class='card m-2 articleCard'>" + 
                "<img class='card-img-top' src='" + data[i].image + "'></img>" +
                "<div class='card-body' id='linkHolder'>" +
                    "<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>" +
                    "<div id='buttonHolder'><hr>" +
                        "<button type='button' class='btn btn-primary mx-1' id='noteModal' data-toggle='modal' data-target='#notes' data-id='" + data[i]._id + "'>Notes</button>" +
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
        console.log(data);
        $("#modalForm").append(
            "<div class='form-group'>" +
                "<label for='noteTextarea' id='noteTitle'>" + data.title + "</label>" +
                "<textarea class='form-control' id='FormControlTextarea' rows='3'></textarea>" +
            "</div>"
        );

        if (data.note) {
            $("#modalForm").append(
                "<div class='form-group row mx-1'>" +
                    "<input type='text' id='disabledTextInput' class='form-control'' placeholder='" + data.note.note + "'></p>" + 
                    "<button type='button' class='btn btn-danger mx-1' id='deleteButton' data-id='" + data.note._id + "' data-article-id='" + data._id + "' data-dismiss='modal'><i class='fas fa-trash-alt'></i></button>" +
                "</div>"
                )

        }

        $("#modalButtons").append(
            "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>" +
            "<button type='button' class='btn btn-primary' id='saveNote' data-id='" + thisId + "'><i class='fas fa-save'></i> Save</button>"
        );
    });
});

$(document).on("click", "#saveNote", function(event) {
    event.preventDefault();

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
        // location.reload();
        window.location = '/savedArticlesPage';
    });
});

$(document).on("click", "#deleteButton", function() {
    var noteId = $(this).attr("data-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + noteId + "/" + articleId
    }).then(function(data) {
        window.location = "/savedArticlesPage"
    })
});

$(document).on("click", "#articles", function() {
    window.location = "/";
});


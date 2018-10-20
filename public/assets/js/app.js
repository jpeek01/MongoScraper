$.getJSON("/unsavedArticles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      $("#articleDisplay").append(
            "<div class='card mt-2' style='width: 18rem;'>" + 
                "<img class='card-img-top' src='" + data[i].image + "'></img>" +
                "<div class='card-body'>" +
                    "<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>" +

                    "<div><hr>" +
                        "<button type='button' class='btn btn-primary mx-1' id='saveArticle' data-id='" + data[i]._id + ">Save Article</button>" +
                    "</div>" +
                "</div>" + 
            "</div>"
        );
    }
  });

//   "<button type='button' class='btn btn-primary mx-1' id='noteModal' data-toggle='modal' data-target='#notes' data-id='" + data[i]._id + "'>Add Note</button>" +

    $(document).on("click", "#saveArticle", function() {

        var thisId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/savedArticles/" + thisId,
            articleData: {
                saved: 1
            }
        }).then(function(data) {
            console.log(data);
        });
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

            if (data.note) {;
            $("#FormControlTextarea").val(data.note.body);
            }
        });
  });
 
$(document).on("click", "#saveNote", function() {

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        noteData: {
            title: $("#noteTitle").text(),
            body: $("#FormControlTextarea").val()
        }
    }).then(function(notedata) {
        console.log(notedata);
        
        $("#FormControlTextarea").empty();
    });
});

// Navigation
$(document).on("click", "#savedArticles", function() {
    window.location.href = "/savedArticles";
});

$(document).on("click", "#articles", function() {
    window.location.href = "/";
});

$(document).on("click", "#scrapeArticles", function() {
    window.location.href = "/scrapeArticles";
});

$.getJSON("/unsavedArticles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#cardContainer").append(
            "<div class='card m-2 articleCard'>" + 
                "<img class='card-img-top' src='" + data[i].image + "'></img>" +
                "<div class='card-body' id='linkHolder'>" +
                    "<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>" +
                    "<div id='buttonHolder'><hr>" +
                        "<button type='button' class='btn btn-primary mx-1' id='saveArticle' data-id='" + data[i]._id + "'>Save Article</button>" +
                    "</div>" +
                "</div>" + 
            "</div>"  
        );
    }
  });

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



// Navigation
$(document).on("click", "#savedArticles", function() {
    window.location.href = "/savedArticlesPage";
});

$(document).on("click", "#scrapeArticles", function() {
    window.location.href = "/scrapeArticles";
});

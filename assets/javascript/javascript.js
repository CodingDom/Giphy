 // Initial array of movies
 var movies = ["Fire", "Water", "Wind", "Earth"];

 function createButton(title) {
   var newBtn = $("<button class='gif-btn'>" + title + "</button>");
   $("#gif-view").append(newBtn);

   if ($("#gif-view").children().length%10 == 0) {
       $("#gif-view").append($("<br>"));
   }
 };

 // Function for displaying movie data
 function renderButtons() {

   for (var i = 0; i < movies.length; i++) {
     createButton(movies[i]);
   };

 };

 // This function handles events where one button is clicked
 $("#add-gif").on("click", function(event) {
   event.preventDefault();
   
   createButton($("#gif-input").val());

 });

 $("#gif-view").on("click", ".gif-btn", function(event) {
   $.ajax({
     url: "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=" + $(this).text() + "&limit=10",
     method: "GET"
   }).then(function(response) {
       var randomGif = response.data[Math.floor(Math.random()*response.data.length)];
       console.log(randomGif);
        $("#poster").data("motion",randomGif.images.original.url);
        $("#poster").data("still",randomGif.images.original_still.url);
        $("#poster").attr("src",randomGif.images.original_still.url);

   });
 });

 renderButtons();


 $("#poster").on("click", function() {
    if ($("#poster").attr("src") == $("#poster").data("still")) {
        $("#poster").attr("src",$("#poster").data("motion"));
    }
    else {
        $("#poster").attr("src",$("#poster").data("still"));
    }
 });
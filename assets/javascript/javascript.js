 // Initial array of topics
 var topics = ["Samuel Jackson", "Vin Diesel", "Morgan Freeman", "Sandra Bullock"];

 function createButton(title) {
   var newBtn = $(`<button class='gif-btn btn btn-info btn-lg'>${title}</button>`);
   $("#gif-btn-container").append(newBtn);
 };

 // Function for displaying movie data
 function renderButtons() {

   for (var i = 0; i < topics.length; i++) {
     createButton(topics[i]);
   };

 };

 // This function handles events where one button is clicked
 $("#add-gif").on("click", function(event) {
   event.preventDefault();
   
   createButton($("#gif-input").val());

 });

 $("#gif-btn-container").on("click", ".gif-btn", function(event) {
   var button = this;
   $.ajax({
     url: "https://api.giphy.com/v1/gifs/search?api_key=0ykeCUek1iK3ICpMlF26BSnVqS8gzjAd&q=" + $(this).text() + "&limit=10",
     method: "GET"
   }).then(function(response) {
      var gifs = response.data;
      
      for (var i = 0; i < gifs.length; i++) {
        console.log(gifs[i]);
        let stillPic = gifs[i].images.original_still.url;
        let motionPic = gifs[i].images.original.url;
        let rating = gifs[i].rating.toUpperCase();
        var newCard = $(`
        <div class="card" style="width: 18rem;">
          <img class="poster" src="${stillPic}" data-motion="${motionPic}" data-still="${stillPic}" class="card-img-top" alt="" width="100%">
          <div class="card-body">
            <p class="card-text">Rating: ${rating}</p>
          </div>
        </div>
        `);
        $("#gif-stuff").append(newCard);
      };
   });
 });

 renderButtons();


 $("#gif-stuff").on("click", function() {
    if ($(this).attr("src") == $(this).data("still")) {
        $(this).attr("src",$(this).data("motion"));
    }
    else {
        $(this).attr("src",$(this).data("still"));
    }
 });
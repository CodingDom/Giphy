 // Initial array of topics
 var topics = ["Samuel Jackson", "Vin Diesel", "Will Smith", "Morgan Freeman", "Sandra Bullock", "Halle Berry", "Scarlett Johansson"];
 var responseOffset = {};

 function createButton(title) {
   var newBtn = $(`<button class='gif-btn btn btn-info btn-lg'>${title}</button>`);
   $("#gif-btn-container").append(newBtn);
   responseOffset[newBtn.text().toLowerCase().replace(/[ ]/g,"")] = 0;
 };

 // Function for displaying movie data
 function renderButtons() {

   for (var i = 0; i < topics.length; i++) {
     createButton(topics[i]);
   };

 };

 //Function to check if input character is a letter
function letterInput(event) {
  var value = String.fromCharCode(event.which);
  var pattern = new RegExp(/[a-z ]/i);
  return pattern.test(value);
};

$("#gif-input").bind('keypress',letterInput);

function createCarousel(id,name) {
  return $(`<div id="${id}" class="container-fluid jumbo-tron border border-info">
    <h3>${name}</h3>
    <div class="row" style="position:relative;">
      <div class="column col-12">
        <div id="${id}-carousel" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
          </div>
          <a class="carousel-control-prev" href="#${id}-carousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon rounded-circle bg-info control-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#${id}-carousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon rounded-circle bg-info control-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  `);
};

 // This function handles events where one button is clicked
 $("#add-gif").on("click", function(event) {
   event.preventDefault();
   
   createButton($("#gif-input").val());

 });

 $("#gif-btn-container").on("click", ".gif-btn", function(event) {
   var button = $(this);
   if (button.hasClass("btn-danger")) {return;};
   button.removeClass("btn-info");
   button.addClass("btn-danger");
   var deckId = button.text().toLowerCase().replace(/[ ]/g,"");
   $.ajax({
     url: `https://api.giphy.com/v1/gifs/search?api_key=0ykeCUek1iK3ICpMlF26BSnVqS8gzjAd&q=${$(this).text()}&limit=10&offset=${responseOffset[deckId]*10}`,
     method: "GET"
   }).then(function(response) {
      var gifs = response.data;
      var tron = $(`#${deckId}`); 
      if (tron.length <= 0) {
        tron = createCarousel(deckId,button.text());
        $("#gif-stuff").append(tron);
      };
      var row = tron.find(".row");
      var col = row.find(".column");
      var deck = $(`#${deckId}-deck`);

      const oldItems = col.find(".carousel-inner").children();
      let item = oldItems[oldItems.length-1] || `<div class="carousel-item">`;
      item = $(item);
      col.find(".carousel-inner").append(item);

      for (var i = 0; i < gifs.length; i++) {
        let stillPic = gifs[i].images.fixed_height_still.url;
        let motionPic = gifs[i].images.fixed_height.url;
        let rating = gifs[i].rating.toUpperCase();

        tron.find(".temp-item").remove();

        if (item.children().length > 0 && item.children().length%3 == 0) {
          item = $(`<div class="carousel-item">`);
          col.find(".carousel-inner").append(item);
        };
        var newCard = $(`
          <div class="card border border-secondary" style="width: 12rem;">
            <img class="poster" src="${stillPic}" data-motion="${motionPic}" data-still="${stillPic}" class="card-img-top" alt="" height="200" width="100%">
            <div class="card-body">
              <p class="card-text">Rating: ${rating}</p>
            </div>
          </div>
        `);
        
        var cardNumber = $(`<p class="card-number bg-info rounded-circle">`);
        cardNumber.text("#"+(tron.find(".card").length+1));
        cardNumber.css({"position":"absolute","top":0,"right":0,"color":"white"});
        newCard.find(".card-body").append(cardNumber);

        newCard.css({"display":"inline-block","margin":"0 30px"});
        item.append(newCard);
        col.css("overflow","hidden");
        if (item.parent().children().length == 1) {
          item.addClass("active");
          if (col.children().length <= 1) {
            row.css("min-height",newCard.height()+10+"px");
          };
        };
      };

      for (var i = 2-item.children().length; i >= 0; i--) {
        const original = tron.find(".card")[i];
        const tempItem = $(original).clone();
        tempItem.addClass("temp-item");
        item.append(tempItem);
      };
      responseOffset[deckId] += 1;
      button.removeClass("btn-danger");
      button.addClass("btn-info");
   });
 });

 renderButtons();


 $("#gif-stuff").on("click", function(event) {
   var poster = event.target;
    if (!$(poster).hasClass("poster")) {return;};
    if ($(poster).attr("src") == $(poster).data("still")) {
        $(poster).attr("src",$(poster).data("motion"));
        $(poster).parent().removeClass("border-secondary");
        $(poster).parent().addClass("bg-info border-success");
    }
    else {
        $(poster).attr("src",$(poster).data("still"));
        $(poster).parent().removeClass("bg-info border-success");
        $(poster).parent().addClass("border-secondary");
    }
 });
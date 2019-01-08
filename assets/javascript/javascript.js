 // Initial array of topics
 let topics = ["Samuel Jackson", "Vin Diesel", "Will Smith", "Morgan Freeman", "Sandra Bullock", "Halle Berry", "Scarlett Johansson"];
 // Storing page index for giphy search
 let responseOffset = {};

 // Maximum amount of gifs created for one topic
 const maxGifs = 60; 

 // Creates topic button
 function createButton(title) {
   // Setting up button id
   const btnId = title.toLowerCase().replace(/[ ]/g,"") + "-button";
   // Stopping duplicated buttons
   if ($(`#${btnId}`)[0] != undefined) {return;};
   // Creating and appending button
   const newBtn = $(`<button id="${btnId}" class='gif-btn btn btn-info btn-lg'>${title}</button>`);
   $("#gif-btn-container").append(newBtn);
   // Setting up page index
   responseOffset[btnId.replace("-button","")] = 0;
 };

 // Function for displaying initial topic data
 function renderButtons() {
   // Loop through list of topics and create button
   for (let i = 0; i < topics.length; i++) {
     createButton(topics[i]);
   };
 };

 // Function to handle input keypress
function letterInput(event) {
  // Create button when enter key is pressed
  if (event.which == 13) {
    createButton($(this).val());
    return
  };
  // Check if input character is a letter
  const value = String.fromCharCode(event.which);
  // Only grab letters a-z and whitespaces
  const pattern = new RegExp(/[a-z ]/i);
  return pattern.test(value);
};

// Function to create container with carousel inside
function createCarousel(id,name) {
  return $(`<div id="${id}" class="container-fluid jumbo-tron border-top border-left border-right border-info">
    <h3 style="text-transform:capitalize;">${name}</h3>
    <div class="row" style="position:relative;">
      <div class="column col-12">
        <div id="${id}-carousel" class="carousel slide" data-ride="carousel">
          
          <div class="carousel-inner"></div>
          <a class="carousel-control-prev" href="#${id}-carousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon rounded-circle bg-info control-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#${id}-carousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon rounded-circle bg-info control-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
          <ol class="carousel-indicators"></ol>
        </div>
      </div>
    </div>
  </div>
  `);
};

$(document).ready(function() {

 // Listener for user input
 $("#gif-input").bind('keypress',letterInput);

 // Listener for submit button
 $("#add-gif").on("click", function(event) {
   event.preventDefault();
   createButton($("#gif-input").val());
 });


 // Click listener for topic buttons
 $("#gif-btn-container").on("click", ".gif-btn", function(event) {
   const button = $(this);
   // Debounce to prevent multiple ajax calls for same topic
   if (!button.hasClass("btn-info")) {return;}; 
   // Changing button color
   button.removeClass("btn-info");
   button.addClass("btn-danger");
   const deckId = button.attr("id").replace("-button","");

   $.ajax({
     url: `https://api.giphy.com/v1/gifs/search?api_key=0ykeCUek1iK3ICpMlF26BSnVqS8gzjAd&q=${$(this).text()}&limit=10&offset=${responseOffset[deckId]*10}`,
     method: "GET"
   }).then(function(response) {
      const gifs = response.data;
      let tron = $(`#${deckId}`);
      // If jumbotron doesn't already exist, create new one
      if (tron.length <= 0) {
        tron = createCarousel(deckId,button.text());
        $("#gif-stuff").append(tron);
      };
      const row = tron.find(".row");
      const col = row.find(".column");

      const oldItems = col.find(".carousel-inner").children();
      // Grab previous carousel item if it exists or make a new one
      let item = oldItems[oldItems.length-1] || `<div class="carousel-item">`;
      item = $(item);
      col.find(".carousel-inner").append(item);

      // If new item then create new pagination
      if (item.children().length < 1) {
        const newNav = $(`<li data-target="#${deckId}-carousel" data-slide-to="${col.find(".carousel-item").length}" class="active"></li>`);
        tron.find(".carousel-indicators").append(newNav);
      };

      // Deletes the filler cards
      tron.find(".temp-item").remove();

      // Loops through giphy response data
      for (let i = 0; i < gifs.length; i++) {
        const stillPic = gifs[i].images.fixed_height_still.url;
        const motionPic = gifs[i].images.fixed_height.url;
        const rating = gifs[i].rating.toUpperCase();

        // Creates new carousel item when current carousel item has created maximum amount of cards
        if ((item.children().length > 0) && (item.children().length%3 == 0)) {
          const newNav = $(`<li data-target="#${deckId}-carousel" data-slide-to="${col.find(".carousel-item").length}"></li>`);
          tron.find(".carousel-indicators").append(newNav);
          item = $(`<div class="carousel-item">`);
          col.find(".carousel-inner").append(item);
        };

        // Creates new card to hold gif
        const newCard = $(`
          <div class="card border border-secondary">
            <img class="poster" src="${stillPic}" data-motion="${motionPic}" data-still="${stillPic}" class="card-img-top" alt="" height="200" width="100%">
            <div class="card-body">
              <p class="card-text">Rating: ${rating}</p>
            </div>
          </div>
        `);
        newCard.css({"display":"inline-block","width":"12rem","margin":"0 30px"});

        // Setting up display for card number
        const cardNumber = $(`<p class="card-number bg-info rounded-circle">`);
        cardNumber.text("#"+(tron.find(".card").length+1));
        cardNumber.css({"position":"absolute","top":0,"right":0,"color":"white"});
        newCard.find(".card-body").append(cardNumber);

        
        item.append(newCard);
        
        // Default settings for first carousel item
        if (item.parent().children().length == 1) {
          item.addClass("active");
          if (col.children().length <= 1) {
            row.css("min-height",newCard.height()+10+"px");
          };
        };
      }; // End of response data loop

      // Adds filler cards when number of cards in carousel item is less than 3
      for (let i = 2-item.children().length; i >= 0; i--) {
        const original = tron.find(".card")[i];
        const tempItem = $(original).clone();
        tempItem.addClass("temp-item");
        item.append(tempItem);
      };

      // Adds 1 to page index of giphy search
      responseOffset[deckId] += 1;
      
      // Removes red color
      button.removeClass("btn-danger");

      // If maximum amount of gifs are reached disable topic button
      if (tron.find(".card").length >= maxGifs) {
        button.addClass("btn-secondary");
        return;
      };

      // Reset color and debounce
      button.addClass("btn-info");
   });
 });

 // Click listener for playing/pausing gifs
 $("#gif-stuff").on("click", ".card", function(event) {
   const poster = $(this).find(".poster");
    // Switch between still image and animated gif
    if ($(poster).attr("src") == $(poster).data("still")) {
        $(poster).attr("src",$(poster).data("motion"));
        $(poster).parent().removeClass("border-secondary");
        $(poster).parent().addClass("bg-info active");
    }
    else {
        $(poster).attr("src",$(poster).data("still"));
        $(poster).parent().removeClass("bg-info active");
        $(poster).parent().addClass("border-secondary");
    };
 });

 // Setting up initial topic buttons
 renderButtons();

});
const http = require("https");
const {Place} = require("../db/models/places");

function placesList(req, res){

    const options = {
        method: "GET",
        hostname: process.env.API_HOSTNAME,
        port: null,
        path: process.env.API_LIST_PLACES_PATH + "/" + req.body.country + "/" + req.body.currency + "/en-GB/?query=" + req.body.city,
        headers: {
            "x-rapidapi-key": process.env.API_KEY,
            "x-rapidapi-host": process.env.API_HOST,
            "useQueryString": true
        }
    };

    console.log("sono in place");


    // REST CALL
    const reqPlaces = http.request(options, function (response) {
        response.on("data", function(data){
           const listOfPlaces = JSON.parse(data);
           listOfPlaces.Places.forEach((placeSearch) => {

               // SEARCH FILE ON DB
              Place.findOne({PlaceId:placeSearch.PlaceId}, function (err, placeFound){
                  if (err) {
                      console.log(err);
                      res.status(400).send("Something goes wrong!, please try again later.");
                  } else {

                      // SAVE FILE ON DB
                      if (placeFound === null) {
                          const place = new Place(placeSearch);
                          place.save();
                      } else {

                          // UPDATE FILE ON DB
                          Place.where({_id: placeFound._id}).update(placeSearch);
                      }
                  }
              });
           });
        });
    });
    reqPlaces.end();
}

module.exports = placesList;
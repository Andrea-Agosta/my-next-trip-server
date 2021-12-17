const http = require("https");
const {Place} = require("../../database/models/old_model/places");
const {Country} = require("../../database/models/old_model/country");


// FUNCTION FOR SAVE THE LIST OF PLACES ON DB
function placesList(req, res) {

    // SEARCH FILE ON DB
    Place.find(function (err, placeFound) {
        if (err) {
            console.log(err);
            res.status(400).send("Something goes wrong!, please try again later.");
        } else {
            if (placeFound != null && placeFound.length > 0) {
                // DROP COLLECTION
                Place.collection.drop();
            }
                Country.find({}, {},/* {limit:120}, */ function (err, countryFound) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Something goes wrong!, please try again later.");
                } else {
                    countryFound.forEach( country =>
                        {
                            const options = {
                                method: "GET",
                                hostname: process.env.API_HOSTNAME,
                                port: null,
                                path: process.env.API_LIST_PLACES_PATH + "/" + country.Code + "/GBP/en-GB/?query=" + encodeURIComponent(country.Name),
                                headers: {
                                    "x-rapidapi-key": process.env.API_KEY,
                                    "x-rapidapi-host": process.env.API_HOST,
                                    "useQueryString": true
                                }
                            };

                            // REST CALL
                            const reqPlaces = http.request(options, function (response) {
                                const chunks = [];

                                response.on("data", function (chunk) {
                                    // SLEEP 2 SEC BETWEEN REST CALL
                                    let stop = new Date().getTime();
                                    while (new Date().getTime() < stop + 4000) {};

                                    chunks.push(chunk);
                                });

                                response.on("end", function () {
                                    // SLEEP 2 SEC BETWEEN REST CALL
                                    let stop = new Date().getTime();
                                    while (new Date().getTime() < stop + 4000) {};

                                    const body = Buffer.concat(chunks);
                                    const listOfPlaces = JSON.parse(body.toString());
                                    console.log(listOfPlaces);

                                    Place.insertMany(listOfPlaces.Places, function (err, item){});
                                });
                            });
                            reqPlaces.end();
                        }
                    )
                }
            });
        }
    })
}

module.exports = placesList;
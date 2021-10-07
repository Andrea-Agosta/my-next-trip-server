const http = require("https");
const {Country} = require("../db/models/country");

function countryList(){
    const options = {
        method: "GET",
        hostname: process.env.API_HOSTNAME,
        port: null,
        path: process.env.API_COUNTRY_PATH,
        headers: {
            "x-rapidapi-key": process.env.API_KEY,
            "x-rapidapi-host": process.env.API_HOST,
            "useQueryString": true
        }
    };

    // REST CALL
    const reqCountry = http.request(options, function (response) {
        const chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            const countryList = JSON.parse(body.toString());

            // SEARCH FILE ON DB
            Country.findOne(null, function (err, countryFound) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Something goes wrong!, please try again later.");
                }

                // DROP COLLECTION
                if (countryFound != null) {
                    Country.collection.drop();
                }

                // SAVE FILE ON DB
                countryList.Countries.forEach((countrySearch) => {
                    const country = new Country(countrySearch);
                    country.save();
                });
            });
        });
    });
    reqCountry.end();
}

module.exports = countryList;
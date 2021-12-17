const http = require("https");
const {Currency} = require("../../database/models/old_model/currency");

function currenciesList() {
    const options = {
        method: "GET",
        hostname: process.env.API_HOSTNAME,
        port: null,
        path: process.env.API_CURRENCIES_PATH,
        headers: {
            "x-rapidapi-key": process.env.API_KEY,
            "x-rapidapi-host": process.env.API_HOST,
            "useQueryString": true
        }
    };

    // REST CALL
    const reqCurrencies = http.request(options, function (response) {
        const chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            const currenciesList = JSON.parse(body.toString());

            // SEARCH FILE ON DB
            Currency.findOne(null, function (err, currencyFound) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Something goes wrong!, please try again later.");
                }

                // DROP COLLECTION
                if (currencyFound != null) {
                    Currency.collection.drop();
                }

                // SAVE FILE ON DB
                currenciesList.Currencies.forEach((currencySearch) => {
                    const currency = new Currency(currencySearch);
                    currency.save();
                });
            });
        });
    });
    reqCurrencies.end();
}

module.exports = currenciesList;
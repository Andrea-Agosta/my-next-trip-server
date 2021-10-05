const http = require("https");
const setPlace = require('../flightClient/setPlace');


function searchFlightController(req, res, callbackFlight) {
    let fromCode = "";
    let toCode = "";

    setPlace(req,res, callback => {
        console.log("callback: ",callback);
        fromCode = callback[0];
        toCode = callback[1];

        const options = {
            method: "GET",
            hostname: process.env.API_HOSTNAME,
            port: null,
            path: process.env.API_PATH + "/" + req.query.country + "/" + req.query.currency + "/en-GB" + "/" + fromCode + "/" + toCode + "/" + req.query.depart + "?inboundpartialdate=" + req.query.return,
            headers: {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST,
                "useQueryString": true
            }
        };

        // REST CALL
        const reqUser = http.request(options, response => {
            const chunks = [];

            response.on("data", function (chunk) {
                chunks.push(chunk);
            });

            response.on("end", async function () {
                const body = Buffer.concat(chunks);
                const flights = JSON.parse(body.toString());
                await callbackFlight(flights);
            });
        });
        reqUser.end();
    });
}

module.exports = searchFlightController;
const http = require("https");

function searchFlightController(req, res) {
        const options = {
            method: "GET",
            hostname: process.env.API_HOSTNAME,
            port: null,
            path: process.env.API_PATH + "/" + req.body.country + "/" + req.body.currency + "/en-GB" + "/" + req.body.from + "/" + req.body.destination + "/" + req.body.departDate + "/" + req.body.returnDate,
            headers: {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST,
                "useQueryString": true
            }
        };

    console.log(options.path);


        const reqUser = http.request(options, response => {
            const chunks = [];

            response.on("data", function (chunk) {
                chunks.push(chunk);
            });

            response.on("end", function () {
                const body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        reqUser.end();
}

module.exports = searchFlightController;
const {Place} = require("../db/models/places");
const axios = require("axios");


async function setPlace(req, res, callback) {
    const from = req.query.from;
    const to = req.query.to;
    let fromRest = "";
    let toRest = "";

    Place.find({PlaceName: {$in:[from,to]}}, async function (err,data){
        if (err) {
            console.log(err);
            res.status(400).send("Something goes wrong!, please try again later.");
        } else {
            if (data.length === 0) {
                fromRest = await callRestPlace(req, from);
                toRest = await callRestPlace(req, to);
            } else if(data.length === 1){
                if (data[0].PlaceName === from) {
                    fromRest = data[0].CityId;
                    toRest = await callRestPlace(req, to);
                } else {
                    fromRest = await callRestPlace(req, from);
                    toRest = data[0].CityId;
                }
            } else {
                fromRest = data[0].CityId;
                toRest = data[1].CityId;
            }
            await callback([fromRest, toRest]);
        }
    });
}

async function callRestPlace(req, from){
    let result = "";
    const options = {
        method: 'GET',
        url: 'https://' + process.env.API_HOSTNAME + process.env.API_LIST_PLACES_PATH + '/' + req.query.country + '/' + req.query.currency + '/en-GB/',
        params: {query: from},
        headers: {
            'x-rapidapi-host': process.env.API_HOST,
            'x-rapidapi-key': process.env.API_KEY
        }
    };

    // REST CALL
    return axios.request(options)
        .then(function (response) {
            const listOfPlaces = response.data;

            // SAVE FILE ON DB
            Place.insertMany(listOfPlaces.Places, function (err, item) {
            });
            result = listOfPlaces.Places[0].CityId;
                return result;
        })
        .catch(function (error) {
            console.error(error);
        })
}

module.exports = setPlace;
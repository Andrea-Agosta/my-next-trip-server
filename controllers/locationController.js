let Validator = require('validatorjs');
const saveLog = require("../util/saveLog");
const tequilaClient = require("../flightClient/tequilaClient");
const {Location} = require('../database/models/create_location_table');


async function locationController(queryParams, path){
    const file = './log/location.log';
    let rules = {
        locale: 'string',
        location_types: 'string',
        limit: 'integer',
        sort: 'string'
    };

    if (path !== '/locations/dump'){
        const error = 'wrong location url path, expected: "/locations/dump", pass: "' + path + '"';
        return await saveLog(error, file);
    } else {
        let validation = await new Validator(queryParams, rules);
        if (validation.passes()){

            // CALL THE API CLIENT
            return tequilaClient(queryParams, path).then(async resp => {
                if (resp.status === 200) {
                    const msg = 'All location was saved successfully'
                    let places = [];

                    // STORE ALL DATA IN places ARRAY
                    await resp.data.locations.forEach(location => {
                        places.push(new Location(location));
                    });

                    // SAVE OR UPDATE ALL DATA IN DB
                    await places.forEach(place => {
                        Location.findOneAndUpdate(
                            {name: place.name},
                            {$set:place},
                            {upsert: true, useFindAndModify:false}, () => {}
                        );
                    });
                    await saveLog(msg, file);
                    return resp;
                } else {
                    return resp;
                }
            });
        } else {
            console.log(validation.error);
            return 'error';
        }
    }
}

module.exports = locationController;
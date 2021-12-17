const cron = require('node-cron');
const saveLog = require("../util/saveLog");
const locationController = require("../controllers/locationController");


// JOB FOR SAVE PLACES LIST ON DB
function placesListUpdate(){
    const queryParams = {
        locale: 'en-US',
        location_types: 'airport',
        limit: 10000,
        sort: 'name',
        search_after:[]
    }
    const path = '/locations/dump';

    cron.schedule('0 0 1 * *', async function() {
        const file = './log/location.log';
        const msgStart = 'Job Start';
        const msgEnd = 'Job End';
        const error = 'Error status: ';

        await saveLog(msgStart, file);
        let response = await locationController(queryParams, path);
        if(response.status === 200) {

            // In order to take all location check if the token in search after is the same
            while (
                response.status === 200 && response.data.search_after !== undefined &&
                queryParams.search_after[0] !== response.data.search_after[0]
            ){
                queryParams.search_after = response.data.search_after;
                response = await locationController(queryParams, path);
            }

            // check if something goes wrong
            if(response.status !== 200){
                await saveLog(error, file);
                console.error(response.status);
            }
        } else {
            await saveLog(error, file);
        }
        queryParams.search_after = [];
        await saveLog(msgEnd, file);
    });
}

module.exports = placesListUpdate;
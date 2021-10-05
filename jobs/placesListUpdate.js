const cron = require('node-cron');
const placesList = require('../flightClient/placesList');

// JOB FOR SAVE LIST OF PLACE ON DB
function placesListUpdate(){
    cron.schedule('0 0 0 2 * *', function() {
        console.log('Job start.');
            placesList();
        console.log('Job end. ');
    });
}

module.exports = placesListUpdate;
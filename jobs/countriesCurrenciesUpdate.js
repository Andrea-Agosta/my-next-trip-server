const cron = require('node-cron');
const currencies = require("../flightClient/currenciesList");
const countryList = require("../flightClient/countryList");


function countriesCurrenciesUpdate(){
    cron.schedule('0 0 0 1 * *', function() {
        console.log('Job start.');
        currencies();
        countryList();
        console.log('Job end. ');
    });
}

module.exports = countriesCurrenciesUpdate;
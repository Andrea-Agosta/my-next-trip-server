const cron = require('node-cron');
const currencies = require("../../flightClient/OLD_skyscanner_API(not_working)/currenciesList");
const countryList = require("../../flightClient/OLD_skyscanner_API(not_working)/countryList");


function countriesCurrenciesUpdate(){
    cron.schedule('0 0 0 1 * *', function() {
        console.log('Job start.');
        currencies();
        countryList();
        console.log('Job end. ');
    });
}

module.exports = countriesCurrenciesUpdate;
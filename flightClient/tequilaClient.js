require('dotenv').config();
const axios = require('axios');


async function tequilaClient(queryParams, path){
    let options = {
        method: 'GET',
        url: 'https://tequila-api.kiwi.com' + path,
        params: queryParams,
        headers: {'apikey': process.env.API_KEY_TEQUILA}
    };

    return await axios.request(options).then(response => {
        return response;
    }).catch(function (error) {
        console.error(error);
        return error;
    });
}

module.exports = tequilaClient;
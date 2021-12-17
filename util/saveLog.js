const fs = require("fs");

async function saveLog(error, file){
    getTodayData().then( date => {
        fs.appendFile(
            file,
            '\n' + date + ' - ' + error,
            'utf8', async function (err) {});
    });
    return true;
}

async function getTodayData() {
    let d = await new Date();
    let curr_date = d.getDate();
    let curr_month = d.getMonth() + 1;
    let curr_year = d.getFullYear();
    let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return curr_date + "/" + curr_month + "/" + curr_year + ' - ' + time;
}
module.exports = saveLog;
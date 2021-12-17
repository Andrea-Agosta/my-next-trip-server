const mongoose = require("mongoose");


function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URL_LOCAL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
            .then((res, err) => {
                if (err) return reject(err);
                resolve();
            })
    });
}

module.exports = {connect};
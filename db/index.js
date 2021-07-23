const mongoose = require("mongoose");

function connect() {
    return mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
}

function close() {
    return mongoose.disconnect();
}

module.exports = {connect, close};
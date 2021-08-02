const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    Code:String,
    Name:String
});

const Country = mongoose.model("Country", countrySchema);

module.exports = { Country };
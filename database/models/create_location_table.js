const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    "id": String,
    "int_id": String,
    "active": Boolean,
    "code": String,
    "name": String,
    "slug": String,
    "alternative_names": [String],
    "rank": String,
    "timezone": String,
    "city": {
        "id": String,
        "name": String,
        "code": String,
        "slug": String,
        "subdivision": {
            "id": String,
            "name": String,
            "slug": String,
            "code": String
        },
        "country": {
            "id": String,
            "name": String,
            "slug": String,
            "code": String
        }
    }
});

const Location = mongoose.model("Location", locationSchema);

module.exports = { Location };
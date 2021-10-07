const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    PlaceId:String,
    PlaceName:String,
    CountryId:String,
    RegionId:String,
    CityId:String,
    CountryName:String
});

const Place = mongoose.model("Place", placeSchema);

module.exports = { Place };
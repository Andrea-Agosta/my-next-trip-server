const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    id: String,
    nightsInDest: Number,
    duration: {
        departure: Number,
        return: Number,
        total: Number
    },
    flyFrom: String,
    cityFrom: String,
    cityCodeFrom: String,
    countryFrom: {
        code: String,
        name: String
    },
    flyTo: String,
    cityTo: String,
    cityCodeTo: String,
    countryTo: {
        code: String,
        name: String
    },
    distance: Number,
    routes: [
        String
    ],
    airlines: [
        String
    ],
    pnr_count: Number,
    has_airport_change: Boolean,
    technical_stops: Number,
    throw_away_ticketing: Boolean,
    hidden_city_ticketing: Boolean,
    price: Number,
    bags_price: {
        "1": Number
    },
    baglimit: {
        hand_width: Number,
        hand_height: Number,
        hand_length: Number,
        hand_weight: Number,
        hold_width: Number,
        hold_height: Number,
        hold_length: Number,
        hold_dimensions_sum: Number,
        hold_weight: Number
    },
    availability: {
        seats: Number
    },
    facilitated_booking_available: Boolean,
    conversion: {
        EUR: Number
    },
    quality: Number,
    booking_token: String,
    transfers: [],
    fare: {
        adults: Number,
        children: Number,
        infants: Number
    },
    price_dropdown: {
        base_fare: Number,
        fees: Number
    },
    virtual_interlining: Boolean,
    route: [
        {
            fare_basis: String,
            fare_category: String,
            fare_classes: String,
            fare_family: String,
            last_seen: Date,
            refresh_timestamp: Date,
            return: Number,
            bags_recheck_required: Boolean,
            guarantee: Boolean,
            id: String,
            combination_id: String,
            cityTo: String,
            cityFrom: String,
            cityCodeFrom: String,
            cityCodeTo: String,
            flyTo: String,
            flyFrom: String,
            airline: String,
            operating_carrier: String,
            equipment: String,
            flight_no: Number,
            vehicle_type: String,
            operating_flight_no: String,
            local_arrival: Date,
            utc_arrival: Date,
            local_departure: Date,
            utc_departure: Date
        }
    ],
    local_arrival: Date,
    utc_arrival: Date,
    local_departure: Date,
    utc_departure: Date
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = { Flight };
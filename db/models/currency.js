const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    Code:String,
    Symbol:String,
    ThousandsSeparator:String,
    DecimalSeparator:String,
    SymbolOnLeft:Boolean,
    SpaceBetweenAmountAndSymbol:Boolean,
    RoundingCoefficient:Number,
    DecimalDigits:Number
});

const Currency = mongoose.model("Currency", currencySchema);

module.exports = { Currency };
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require('cors');
const User = require("./db/models/user").User;
const registrationController = require("./controllers/registrationController");
const loginController = require("./controllers/loginController");
const searchFlightController = require("./controllers/searchFlightController");
const countriesCurrenciesUpdate = require("./jobs/countriesCurrenciesUpdate");
// const placesListUpdate = require('./jobs/placesListUpdate');
const cron = require("node-cron");
const {Country} = require("./db/models/country");
const {Currency} = require("./db/models/currency");
const {Place} = require("./db/models/places");

// INITIALIZATION
const app = express();
app.use(express.static("public"));

// CORS
app.use(cors());

// EXPRESS BODY PARSER
app.use(bodyParser.urlencoded({extended:true}));

// EXPRESS SESSION
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// PASSPORT MIDDLEWERE
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT CONFIG
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SCHEDULE JOB
countriesCurrenciesUpdate();
// placesListUpdate();      AT MOMENT I USE AN EXTERNAL APPLICATION IN PYTHON TO DO THIS

app.get("/", function(req, res){
    // res.send("Hello");
    // console.log("home");
});

app.get("/currenciesList", function (req, res){
    Currency.find({}, function (err, currencies){
        if (err){
            console.log(err);
            res.status(400).send("Something goes wrong!, please try again later.");
        } else {
            res.json(currencies);
        }
    });
});

app.get("/countriesList", function (req, res){

    Country.find({}, function (err, countries){
        if (err){
            console.log(err);
            res.status(400).send("Something goes wrong!, please try again later.");
        } else {
            res.json(countries);
        }
    });

});

app.get("/placesList", function (req, res){

    Place.find({}, function (err, countries){
        if (err){
            console.log(err);
            res.status(400).send("Something goes wrong!, please try again later.");
        } else {
            res.json(countries);
        }
    });

});

app.get("/search", async function (req, res){
    searchFlightController(req, res, callbackFlight =>{
        res.json(callbackFlight);
    });
});

app.get("/my-flight", function(req, res){
    if (req.isAuthenticated()){
        res.send("Welcome to your data page!");
    } else {
        res.redirect("/login");
    }
});

app.post("/register", function(req, res){
    registrationController(req,res, passport);
});

app.post("/login", passport.authenticate("local"), function(req, res){
    loginController(req,res, passport);
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

module.exports = app;
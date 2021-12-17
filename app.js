require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require('cors');
const User = require("./database/models/user").User;
const registrationController = require("./controllers/registrationController");
const loginController = require("./controllers/loginController");
const searchFlightController = require("./controllers/searchFlightController");
const placesListUpdate = require('./jobs/placesListUpdate');

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
placesListUpdate();

// SEARCH FLIGHTS
app.get("/flights/search", async function (req, res){
    await searchFlightController(req, res);
});

// LIST OF FLIGHTS SAVED FROM USER
app.get("/my-searches", function(req, res){
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
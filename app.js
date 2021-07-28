require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const User = require("./db/models/user").User;
const registrationController = require("./controllers/registrationController");
const loginController = require("./controllers/loginController");

// INITIALIZATION
const app = express();
app.use(express.static("public"));

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

app.get("/", function(req, res){
    res.send("Hello");
    console.log("home");
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
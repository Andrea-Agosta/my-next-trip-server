require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const User = require("./db/models/user").User;

// INITIALIZATION
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
    let errorMessage = "";
    let isError = false;

    // CHECK MANDATORY DATA
    if (req.body.country === "" || req.body.country === undefined ){
        errorMessage += " Insert a correct Country.";
        isError = true;
    }
    if (req.body.username === "" || req.body.username === undefined ){
        errorMessage += " Insert a correct Email.";
        isError = true;
    }
    if (req.body.password === "" || req.body.password === undefined ){
        errorMessage += " Insert a correct Password.";
        isError = true;
    }
    if (isError) {
        res.status(400).send(errorMessage);
    } else {
        User.register({
            name:req.body.name,
            surname:req.body.surname,
            country:req.body.country,
            username: req.body.username
        }, req.body.password, function(err, user){
            if (err) {
                console.log(err);
                res.status(400).send("Something goes wrong!, please try again later.");
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function (){
                   res.redirect("/my-flight");
                });
            }
        });
    }
});

app.post("/login", passport.authenticate("local"), function(req, res){
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err){
            console.log(err);
            res.status(400).send("Autentication fail");
        } else {
            passport.authenticate("local") (req, res, function (){
                res.redirect("/my-flight")
            });
        }
    });
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

module.exports = app;
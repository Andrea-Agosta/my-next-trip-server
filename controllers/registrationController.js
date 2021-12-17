const User = require("../database/models/user").User;

function registrationController(req, res, passport){
    let errorMessage = "";
    let isError = false;
    const regexCountry = /[A-Z]{2}/g;
    const regexMail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const regexPsw = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/g;

    // CHECK MANDATORY DATA
    if (req.body.country === "" || req.body.country === undefined || !regexCountry.test(req.body.country)){
        errorMessage += " Insert a correct Country.";
        isError = true;
    }
    if (req.body.email === "" || req.body.username === undefined || !regexMail.test(req.body.username)){
        errorMessage += " Insert a correct Email.";
        isError = true;
    }
    if (req.body.password === "" || req.body.password === undefined || !regexPsw.test(req.body.password)){
        errorMessage += " Insert a correct Password.";
        isError = true;
    }

    if (isError) {
        res.status(400).send(errorMessage);
    } else {
        User.findOne({username:req.body.username}, function (err, userSaved){
            if (err){
                res.status(400).send("Something goes wrong!, please try again later.");
                res.redirect("/register");
            } else if (userSaved != null){
                res.status(400).send(" Email already use.");
            } else {
                User.register({
                    name:req.body.name,
                    surname:req.body.surname,
                    country:req.body.country,
                    username: req.body.username
                }, req.body.password, function(err, user){
                    if (err) {
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
    }
}
module.exports = registrationController;
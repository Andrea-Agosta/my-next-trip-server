const User = require("../database/models/user").User;

function loginController(req,res, passport){
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err){
            res.status(400).send("Autentication fail");
        } else {
            passport.authenticate("local") (req, res, function (){
                res.redirect("/my-flight");
            });
        }
    });
}

module.exports = loginController;
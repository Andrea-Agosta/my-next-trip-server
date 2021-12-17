/* -----------------------------------------------------------
    Researching way to mock/stub passport authentication
 ------------------------------------------------------------ */

// process.env.NODE_ENV = "test";
//
// const expect = require("chai").expect;
// const request = require("supertest");
// const passport = require('passport');
// const sinon = require('sinon');
// const app = require("../../../app.js");
// const conn = require("../../../database/index.js");
// const User = require("../../../database/models/user").User;
//
// describe("POST /login", () => {
//
//     // beforeEach(() => {
//     //    this.authenticate = sinon.stub(passport,"authenticate").return(() => {});
//     //    this.serialize = sinon.stub(passport, 'serializeUser').return(() => {});
//     //    this.deserialize = sinon.stub(passport, 'deserializeUser').returns(() => {});
//     // });
//     //
//     // afterEach(() => {
//     //    this.authenticate.restore();
//     //    this.serialize.restore();
//     //    this.deserialize.restore();
//     // });
//
//     before((done => {
//         conn.connect()
//             .then(() => {
//                 // let user;
//                 // user = new User({
//                 //     name:"name.test1",
//                 //     surname:"surname.test1",
//                 //     country:"UK",
//                 //     username: "test1@test.com",
//                 //     password:"Test001!"
//                 // });
//                 // user.save();
//
//                 done()
//             })
//             .catch((err) => done(err));
//     }))
//
//     after((done => {
//         conn.close()
//             .then(() => done())
//             .catch((err) => done(err));
//     }))
//
//     it ("Login with success", (done) => {
//
//         User.findOne({name:"test.name2"}, function(err, user) {
//             if(err) {
//                 console.log("errore:");
//                 console.log(err);
//             } else {
//                 console.log("user trovato:");
//                 console.log(user);
//             }
//         })
//
//         request(app).post("/login")
//             .set('content-type', 'application/x-www-form-urlencoded')
//             .send({
//                 username: "test1@test.com",
//                 password:"Test001!"
//             })
//             .expect(302)
//             .expect('Location', '/my-flight')
//             .then(() => done())
//             .catch((err) => done(err));
//     });
// })
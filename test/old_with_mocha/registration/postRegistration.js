process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");
const passport = require('passport');

const app = require("../../../app.js");
const conn = require("../../../database/old_db_connection");
const User = require("../../../database/models/user").User;

describe("POST /register", () => {
    before((done => {
        conn.connect()
        .then(() => done())
        .catch((err) => done(err));
    }))

    after((done => {
        conn.close()
        .then(() => done())
        .catch((err) => done(err));
    }))

    it("Registration a new User", (done) => {
        let user = {
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "test@test.com",
            password:"Test001!"
        }
        request(app).post("/register")
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .expect(302)
        .expect('Location', '/my-flight')
        .then((res) => {
            User.findOne({name: "name.test"}, function (err, userFound){
                if(err){
                    console.log(err);
                    chai.assert.equal(true, false, "error.");
                }
                expect(userFound.name).to.equal('name.test');
                expect(userFound.surname).to.equal('surname.test');
                expect(userFound.country).to.equal('UK');
                expect(userFound.username).to.equal('test@test.com');
            });
            done();
        })
        .catch((err) => done(err));
    });

    it ("Country is empty", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"",
            username: "test@test.com",
            password:"Test1!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Country wrong format",(done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"Italy",
            username: "test@test.com",
            password:"Test1!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Username is empty", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "",
            password:"Test1!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Username already registered", (done) => {
        // User.register({
        //     name:"name.test",
        //     surname:"surname.test",
        //     country:"UK",
        //     username:"test@test.com"
        // });

        // No need to register the user again because the user is already registered in the first test
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "test@test.com",
            password:"Test1!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Username wrong format no '@'", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username.com",
            password:"Test1!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Username wrong format NO dot", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username@com",
            password:"Test1!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Password is empty", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username.com",
            password:""
        })
        .expect(400)
        .then(() => done())
    });

    it ("Password wrong format NO special char ", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username.com",
            password:"Test0001"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Password wrong format NO uppercase ", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username.com",
            password:"test001!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Password wrong format NO number ", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username.com",
            password:"TestTest!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Password wrong format NO lowercase ", (done) => {
        request(app).post("/register")
        .send({
            name:"name.test",
            surname:"surname.test",
            country:"UK",
            username: "username.com",
            password:"TEST001!"
        })
        .expect(400)
        .then(() => done())
    });

    it ("Password wrong less then 8 char ", (done) => {
        request(app).post("/register")
            .send({
                name:"name.test",
                surname:"surname.test",
                country:"UK",
                username: "username.com",
                password:"Test1!"
            })
            .expect(400)
            .then(() => done())
    });

})
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
let path = require('path');
const app = express();
const mongoose = require('mongoose');


app.set('views', path.join(__dirname, 'pub'));
app.set('view engine', 'pug');


app.use(express.static('pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT | 3000;


let users;

mongoose.connect('mongodb://localhost/project9');

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error;'));
db.once('open', () => {
    console.log('Mongo Database Connected');
    let userSchema = mongoose.Schema({
        userId: String,
        username: String,
        age: Number,
        email: String
    });

    user = mongoose.model('user', userSchema);

    app.get('/', (req, res) => {

        res.render('loginorsignup')

    });

    app.get('/users', (req, res) => {

        user.find({}, (users) => {

            res.render('users', {users: users});
        });
    });

    app.post('/users', (req, res) => {
        let newUser = new user(
            {
                username: req.body.username,
                password: req.body.password,
                email: req.body.emailaddress,
                age: req.body.age,

            }
        );

        newUser.save((err, newUser) => {
            if (err) console.log(err);

            console.log(`${newUser.id} Added to the Database`);

            user.find({}, (err, users) => {
                if (err) console.log(err);

                res.render('users', {users: users});
            })
        })
    });


    // app.post('/login',
    //     passport.authenticate('local', { successRedirect: '/',
    //         failureRedirect: '/login',
    //         failureFlash: true })
    // );

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/signUp', (req, res) => {
        res.render('signUp');
    });


    app.get('/edit/:id', (req, res) => {
        console.log(('req param' + req.params.id));

        var editedUser = user.find({userId: req.params.id});
        console.log(req.params.id);
        user.find({_id: req.params.id}, (err, editedUser) => {
            console.log(editedUser);
            console.log(err);
            res.render('edit', {editedUser: editedUser});








        })

    });


    var r = 1;

    // app.post('/signUp', (req, res) => {
    //     user = {
    //         username: req.body.username,
    //         password: req.body.password,
    //         email: req.body.emailaddress,
    //         age: req.body.age,
    //         id: r
    //     };
    //     users.push(user);
    //     console.log(user);
    //     res.render('./users', {userInfo:users});
    //     r++;
    // });

    app.post('/editUser', (req, res) => {

        console.log('req.body', req.body);


        let existingUser = users.find(user => user.id == req.body.id)[0];
        existingUser.username = req.body.username;
        existingUser.email = req.body.email;
        existingUser.password = req.body.password;
        existingUser.age = req.body.age;
        // existingUser = {
        //     username: req.body.username,
        //     password: req.body.password,
        //     email: req.body.emailaddress,
        //     age: req.body.age,
        //     id: req.body.id
        // };
        console.log('existingUser', existingUser);
        res.render('./users', {userInfo: users});
    });

    app.get('/delete/:id', (req, res) => {
        let existingUser = users.filter(user => user.id == req.params.id)[0];
        users.splice(users.indexOf(existingUser), 1);
        console.log('boi', existingUser);
        res.render('./users', {userInfo: users});
    });
// const users = [
//     {id: 1, username: 'ben', password: 'abc', email: 'ben@example.com'}
//     , {id: 2, username: 'bob', password: '123', email: 'bob@example.com'}
// ];

    //
    // function findByUsername(username, callback) {
    //     for (let i = 0, len = users.length; i < len; i++) {
    //         const user = users[i];
    //         if (user.username === username) {
    //             return callback(null, user);
    //         }
    //     }
    //     return callback(null, null);
    // }
    //
    // passport.use(new LocalStrategy({
    //         // this maps the field names in the html form to the passport stuff
    //         usernameField: 'username',
    //         passwordField: 'password'
    //     },
    //     function (username, password, done) {
    //         // replace this with a DB QUERY function later
    //         findByUsername(username, function (err, user) {
    //             if (err) {
    //                 return done(err);
    //             }
    //             if (!user) {
    //                 console.log('Invalid username');
    //                 return done(null, false, {message: 'Invalid username.'});
    //             } else {
    //                 if (user.password === password) {
    //                     console.log('valid username and password');
    //                     return done(null, user);
    //                 } else {
    //                     console.log('valid username but password is wrong');
    //                     return done(null, false, {message: 'Invalid password.'});
    //                 }
    //             }
    //         });
    //     }
    // ));
    //
    //
    // app.post('/login', (req, res, next) => {
    //     passport.authenticate('local', function (err, user, info) {
    //         console.log(err, user, info);
    //         if (user) {
    //             console.log('here Passport');
    //             res.redirect('/welcome.html');
    //         } else {
    //             res.send({error: err, info: info});
    //         }
    //
    //     })(req, res, next);
    // });

    app.listen(port, () => {
        console.log(`passport local  Strategy example app listening on port 3000`);
    });

});
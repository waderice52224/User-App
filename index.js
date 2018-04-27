const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
let path = require('path');
const app = express();
app.set('views', path.join(__dirname, 'pub'));
app.set('view engine', 'pug');

const port = process.env.PORT | 3000;

let users = [];

app.use(express.static('pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.render('loginorsignup');
});
app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
);

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signUp', (req, res) => {
    res.render('signUp');
});
app.get('/users', (req, res) => {
    res.render('users');
});

app.get('/edit/:id', (req, res) => {
    console.log(('req param' + req.params.id));

    var userINF;
    console.log('here ' + users.length);
    for(let i =0; i < users.length; i++){
        console.log('users i::' + users[i].id);
        if(+users[i].id === +req.params.id){
            console.log('match');
            userINF = users[i];
            res.render('edit', {editedUser: userINF});
        }


    }

});



var r = 1;

app.post('/signUp', (req, res) => {
    user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.emailaddress,
        age: req.body.age,
        id: r
    };
    users.push(user);
    console.log(user);
    res.render('./users', {userInfo:users});
    r++;
});

app.post('/editUser', (req, res) => {

    console.log('req.body', req.body);


    let existingUser = users.filter(user => user.id == req.body.id)[0];
    existingUser.username =req.body.username;
    existingUser.id =req.body.id;
    existingUser.email =req.body.email;
    existingUser.password =req.body.password;
    existingUser.age =req.body.age;
    // existingUser = {
    //     username: req.body.username,
    //     password: req.body.password,
    //     email: req.body.emailaddress,
    //     age: req.body.age,
    //     id: req.body.id
    // };
    console.log('existingUser', existingUser);
    res.render('./users', {userInfo:users});
});

app.post('/delete/:id', (req, res) => {
    let existingUser = users.filter(user => user.id == req.body.id)[0];
    console.log('boi', existingUser);
    res.render('./users', {userInfo:users});
});
// const users = [
//     {id: 1, username: 'ben', password: 'abc', email: 'ben@example.com'}
//     , {id: 2, username: 'bob', password: '123', email: 'bob@example.com'}
// ];



function findByUsername(username, callback) {
    for (let i=0, len = users.length; i < len; i++) {
        const user = users[i];
        if (user.username === username) {
            return callback(null, user);
        }
    }
    return callback(null, null);
}

passport.use(new LocalStrategy({
        // this maps the field names in the html form to the passport stuff
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        // replace this with a DB QUERY function later
        findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('Invalid username');
                return done(null, false, {message: 'Invalid username.'});
            } else {
                if (user.password === password) {
                    console.log('valid username and password');
                    return done(null, user);
                } else {
                    console.log('valid username but password is wrong');
                    return done(null, false, {message: 'Invalid password.'});
                }
            }
        });
    }
));




app.post('/login', (req, res, next) =>{
    passport.authenticate('local', function (err, user, info) {
        console.log(err, user, info);
        if(user) {
            console.log('here Passport');
            res.redirect('/welcome.html');
        } else {
            res.send({error: err, info: info});
        }

    })(req, res, next);
});

app.listen(port, () =>
console.log(`passport local  Strategy example app listening on port 3000`));








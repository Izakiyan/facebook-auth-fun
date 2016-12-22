var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var expressSession = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./UserModel');

mongoose.connect('mongodb://localhost/facebookUsers');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: '396399834030648',
    clientSecret: 'e74ec6ef2cf54184184f740ec5efaf09',
    callbackURL: "http://localhost:8000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {

  	User.findOne({ username: profile.username }, function (err, user) {
      if (err) { return done(err);}

      if (!user) {return (null, false, user);}

       var newUser = new User(req.body);
  
		  newUser.save(function (err, newUser){
		    if(err){ return next(err); }
		    // console.log("accessToken:");
		    // console.log(accessToken);
		    // console.log("refreshToken:");
		    // console.log(refreshToken);
		    // console.log("profile:");
		    // console.log(profile);

		    return done(null, newUser);
		  })
    });

 }));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/facebookCanceled'
}));

// route for showing the profile page
app.get('/profile', function(req, res) {
  console.log(req.user);
  res.render('profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

app.get('/facebookCanceled', function(req, res) {
  res.send("fail!");
});

app.get('/logout', function(req, res) {
	req.session.destroy();
	req.logout();
	res.redirect('/');
})

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  done(null, user);
});



app.listen(8000);
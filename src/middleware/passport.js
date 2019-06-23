// we want to secure part of the api using the json token, a token is sent to the server, see if the info inside the token is valid
const passport = require('passport');
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config/config');

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}
module.exports = new JwtStrategy(opts, function (jwt_payload, done){
    User.findById(jwt_payload.id, function (err, user){
        if(err){
            return done(err, false);
        }
        if(user){
            console.log('here');
            return done(null, user);
            
        } else{
            return done(null, false);
        }
    });
});
var express = require('express'),
//express is for easily getting an instance of the router in all files and apply the routes
    routes = express.Router();
var userController = require('./controller/user-controller');
var passport = require('passport');

routes.get('/', (req, res) => {
    return res.send('Hello, this is the API!');
})

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);

//passing in the middleware
routes.get('/special', passport.authenticate('jwt',{session:false}),(req, res) => {
    return res.json({ msg:'Hej ${req.user.email}!'}); 
})

module.exports = routes;

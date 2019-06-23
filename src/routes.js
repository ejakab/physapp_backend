var express = require("express");
//express is for easily getting an instance of the router in all files and apply the routes
var routes = express.Router();
var userController = require("./controller/user-controller");
var passport = require("passport");
var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

var url = "mongodb+srv://edinaj:edinajpass@physapp-ejf1b.mongodb.net/ionic-jwt";

routes.get("/", (req, res) => {
  return res.send("Hello, this is the API!");
});

routes.get("/", function(req, res, next) {
  res.render("index");
});

routes.post("/register", userController.registerUser);
routes.post("/login", userController.loginUser);
routes.post("/add-completed-exercise", userController.addCompletedExercise);
routes.post("/add-dizzy-log", userController.addDizzyLog);
routes.get("/reauth", userController.reauth);
//passing in the middleware
routes.get(
  "/special",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
  }
);

routes.get("/get-users", function(req, res, next) {
  var resultArray = [];

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db
      .db("ionic-jwt")
      .collection("users")
      .find();
    cursor.forEach(
      function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function() {
        db.close();
        res.json(resultArray);
      }
    );
  });
});
test = function() {
  MongoClient.connect(url, function(err, db) {
    var resultArray = [];

    assert.equal(null, err);
    var cursor = db
      .db("ionic-jwt")
      .collection("excercises")
      .find();
    cursor.forEach(
      function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function() {
        db.close();
        console.log(resultArray);
      }
    );
  });
};
// test();
routes.get("/get-exercises", function(req, res, next) {
  var resultArray = [];

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db
      .db("ionic-jwt")
      .collection("excercises")
      .find();
    cursor.forEach(
      function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function() {
        db.close();
        res.json(resultArray);
      }
    );
  });
});
// routes.get('/validate', )
module.exports = routes;

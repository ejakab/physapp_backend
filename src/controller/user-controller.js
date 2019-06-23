var User = require("../models/user");
var jwt = require("jsonwebtoken");
var config = require("../config/config");

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: 200 // 86400 expires in 24 hours
  });
}

exports.registerUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: "You need to send email and password" });
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    if (user) {
      return res.status(400).json({ msg: "The user already exists" });
    }

    let newUser = User(req.body);
    newUser.save((err, user) => {
      if (err) {
        return res.status(400).json({ msg: err });
      }
      return res.status(201).json(user);
    });
  });
};

exports.loginUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ msg: "You need to send email and password" });
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(400).send({ msg: err });
    }

    if (!user) {
      return res.status(400).json({ msg: "The user does not exist" });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        
        return res.status(200).json({
          token: createToken(user)
        });
      } else {
        return res
          .status(400)
          .json({ msg: "The email and password don't match." });
      }
    });
  });
};
exports.addCompletedExercise = (req, res) => {
  if (!req.body.exerciseId || !req.body.date || !req.body.email) {
    return res.status(400).send({
      msg:
        "Invalid JSON Body - expected {exerciseId: string, date: Date, email: string, liked?: boolean}."
    });
  }

  User.findOneAndUpdate(
    { email: req.body.email },
    {
      $push: {
        completed: {
          exerciseId: req.body.exerciseId,
          date: req.body.date,
          name: req.body.name,
          liked: req.body.liked
        }
      }
    },
    { upsert: true, strict: false, new:true },
    (err, doc, success) => {
      if (err) {
        return res.status(400).send({ msg: err });
      } else {
        return res.status(200).json({
          updatedUser: doc,
          res: success
        });
      }
    }
  );
};

exports.addDizzyLog = (req, res) => {
  if (!req.body.level || !req.body.date || !req.body.email) {
    return res.status(400).send({
      msg:
        "Invalid JSON Body - expected {exerciseId: string, date: Date, email: string, liked?: boolean}."
    });
  }

  User.findOneAndUpdate(
    { email: req.body.email },
    {
      $push: {
        dizzyLog: {
          level: req.body.level,
          date: req.body.date,
        }
      }
    },
    { upsert: true, strict: false, new:true },
    (err, doc, success) => {
      if (err) {
        return res.status(400).send({ msg: err });
      } else {
        return res.status(200).json({
          updatedUser: doc,
          res: success
        });
      }
    }
  );
};
// REAUTHENTICATING USER WITH VALID TOKEN
exports.reauth = (req, res) => {
  const header = req.headers['authorization'];
  
  if (typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1]
    req.token = token;
    jwt.verify(req.token, config.jwtSecret, (err, authData)=> {
      if(err){
        res.sendStatus(403).send(err)
      } else {
        User.findOne({email:authData.email}, (err, user) => {
          if (err) {
            res.sendStatus(404).send(err)
          } else {
            return res.status(200).json(user)
          }
        })
      }
    })
  }
}
exports.userInfo = (req, res) => {
  return res.json({ msg: `Name ${req.user.email}` });
};

var express = require('express');
var router = express.Router();
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var User = require('../models/user');
var moment = require('moment');
var jwt = require('jwt-simple');

function authenticate(req, res, next) {
  var decoded, token = (req.body && req.body.access_token) ||
              (req.query && req.query.access_token) ||
              req.headers['x-access-token'];

  if (token) {
    decoded = jwt.decode(token, 'secret');

    if (decoded.exp <= Date.now()) {
      res.status(400).send('Access token has expired');
    }

    db.get('users', decoded.iss)
      .then(function(result) {
        delete result.body.password;
        req.user = result.body;
        next();
      })
      .fail(function(err) {
        res.status(404).json({ message: err.body.message });
      });
    } else {
      next();
    }
}

router.post('/signin', function(req, res) {
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;

  db.get('users', email)
    .then(function(result) {
      console.log(result.body)
      var expires, token;

      if (User.authenticate(password, result.body.password)) {
        console.log('password authenticated')
        expires = moment().add(7, 'days').valueOf();
        token = jwt.encode({
          iss: email,
          exp: expires
        }, 'secret');

        delete result.body.password;

        return res.json({
          token : token,
          expires: expires,
          user: result.body
        });
      }

      res.status(404).json({ message: 'Incorrect username or password.' });
    })
    .fail(function(err) {
      console.log('couldnt find user')
      res.status(404).json({ message: 'Incorrect username or password.' });
    });
});

router.post('/session', authenticate, function(req, res) {
  console.log('session')
  if (!req.user)
    return res.status(404).end();
  res.json(req.user);
});

module.exports = router;

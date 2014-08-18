var express = require('express');
var router = express.Router();
var User = require('../models/user');
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);

router.post('/', function(req, res) {
  var user = new User(req.body);

  db.put('users', user.email, user)
    .then(function(results) {
      //user.id = results.headers.location.split('/')[3];
      delete user.password;
      res.json(user);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

module.exports = router;

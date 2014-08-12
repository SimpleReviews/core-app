var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');
var denorm = require('./denorm-reviews');
var kew = require('kew');

router.get('/', function(req, res) {
  db.list('denorm_reviews')
    .then(function(results) {
      res.json(normalize(results.body.results));
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.get('/:id', function(req, res) {
  db.get('denorm_reviews', req.params.id)
    .then(function(results) {
      res.json(results.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.put('/:id', function(req, res) {
  db.put('reviews', req.params.id, req.body)
    .then(function(results) {
      denorm.run({ collection: 'reviews' });
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.post('/', function(req, res) {
  db.post('reviews', req.body)
    .then(function(results) {
      var promises = [];
      req.body.id = results.headers.location.split('/')[3];
      denorm.run({ collection: 'reviews' });
      res.json(req.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.delete('/:id', function(req, res) {
  db.remove('reviews')
    .then(function(results) {
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

module.exports = router;

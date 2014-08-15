var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');
var denorm_products = require('./denorm-products');
var denorm_categories = require('./denorm-categories');
var kew = require('kew');

router.get('/', function(req, res) {
  db.list('denorm_categories', { limit: 100 })
    .then(function(results) {
      res.json(normalize(results.body.results));
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.get('/search', function(req, res) {
  var query = req.query.q;
  db.newSearchBuilder()
  .collection('categories')
  .limit(100)
  .query(query)
  .then(function(results) {
    res.json(normalize(results.body.results));
  })
  .fail(function(err) {
    res.status(err.statusCode)
      .json({ message: err.body.message });
  });
});

router.get('/:id', function(req, res) {
  db.get('denorm_categories', req.params.id)
    .then(function(results) {
      res.json(results.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.put('/:id', function(req, res) {
  db.put('categories', req.params.id, req.body)
    .then(function(results) {
      denorm_products.run({ collection: 'products' });
      denorm_categories.run({ collection: 'categories' });
      res.status(statusCode).end();
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.post('/', function(req, res) {
  db.post('categories', req.body)
    .then(function(results) {
      // get the key that orchestrate creates from the header
      req.body.id = results.headers.location.split('/')[3];
    })
    .then(function(results) {
      denorm_products.run({ collection: 'products' });
      denorm_categories.run({ collection: 'categories' });
      res.json(req.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.delete('/:id', function(req, res) {
  db.remove('categories')
    .then(function(results) {
      res.status(results.statusCode).end();
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

module.exports = router;

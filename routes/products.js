var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');
var denorm_products = require('./denorm-products');
var denorm_categories = require('./denorm-categories');
var kew = require('kew');

router.get('/', function(req, res) {
  db.list('denorm_products')
    .then(function(results) {
      res.json(normalize(results.body.results));
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.get('/:id', function(req, res) {
  db.get('denorm_products', req.params.id)
    .then(function(results) {
      res.json(results.body);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.put('/:id', function(req, res) {
  db.put('products', req.params.id, req.body)
    .then(function(results) {
      // TODO add graphs
      denorm.run({ collection: 'products' });
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.post('/', function(req, res) {
  db.post('products', req.body)
    .then(function(results) {
      var promises = [];
      // get the key that orchestrate creates from the header
      req.body.id = results.headers.location.split('/')[3];

      if (req.body.categories && req.body.categories.length) {
        req.body.categories.forEach(function(item) {
          promises.push(
            db.newGraphBuilder()
              .create()
              .from('products', req.body.id)
              .related('categories')
              .to('categories', item.id)
          );
          promises.push(
            db.newGraphBuilder()
              .create()
              .from('categories', item.id)
              .related('products')
              .to('products', req.body.id)
          );
        });
      }
      if (req.body.reviews && req.body.reviews.length) {
        req.body.reviews.forEach(function(item) {
          promises.push(
            db.newGraphBuilder()
              .create()
              .from('products', req.body.id)
              .related('reviews')
              .to('reviews', item.id)
          );
        });
      }
      return kew.all(promises);
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
  db.remove('products')
    .then(function(results) {
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

module.exports = router;

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
      denorm_products.run({ collection: 'products' });
      denorm_categories.run({ collection: 'categories' });
      res.status(results.statusCode).end();
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

      if (req.body.category) {
        return db.post('categories', {
          name: req.body.category
        });
      }

      return kew.reject('missing category');
    })
    .then(function(results) {
      return db.newGraphBuilder()
        .create()
        .from('categories', results.headers.location.split('/')[3])
        .related('products')
        .to('products', req.body.id)
    })
    .then(function(results) {
      denorm_products.run({ collection: 'products' });
      denorm_categories.run({ collection: 'categories' });
      res.json(req.body);
    })
    .fail(function(err) {
      if (!err.statusCode) {
        res.status(404).json({ message: err });
      }

      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.delete('/:id', function(req, res) {
  db.remove('products')
    .then(function(results) {
      denorm_products.run({ collection: 'products' });
      denorm_categories.run({ collection: 'categories' });
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

module.exports = router;

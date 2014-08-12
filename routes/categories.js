var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');
var denorm_products = require('./denorm-products');
var denorm_categories = require('./denorm-categories');
var kew = require('kew');

function graphManyToMany(categoryId, products) {
  var promises = [];
  console.log('products');
  if (products && products.length) {
    products.forEach(function(item) {
      promises.push(
        db.newGraphBuilder()
          .create()
          .from('categories', categoryId)
          .related('products')
          .to('products', item.id)
      );
      promises.push(
        db.newGraphBuilder()
          .create()
          .from('products', item.id)
          .related('categories')
          .to('categories', categoryId)
      );
    });
  }
  return kew.all(promises);
}

router.get('/', function(req, res) {
  db.list('denorm_categories')
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
  var statusCode;
  db.put('categories', req.params.id, req.body)
    .then(function(results) {
      console.log(results.headers);
      statusCode = results.statusCode;
      return graphManyToMany(req.params.id, req.body.products);
    })
    .then(function(results) {
      console.log('here')
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
  console.log('categories')
  db.post('categories', req.body)
    .then(function(results) {
      // get the key that orchestrate creates from the header
      req.body.id = results.headers.location.split('/')[3];
      // TODO run this in parallel, there could be a lot of products which would hold up the
      // post request
      return graphManyToMany(req.body.id, req.body.products);
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

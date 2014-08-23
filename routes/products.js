var express = require('express');
var router = express.Router();
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var normalize = require('../lib/normalize');
var denorm = require('../lib/denorm')();
var kew = require('kew');

router.get('/search', function(req, res) {
  db.search('denorm_products', 'value.name:' + '"' + req.query.q + '"')
    .then(function(results) {
      res.json(normalize(results.body.results));
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

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
  console.log(req.params.id);
  db.get('denorm_products', req.params.id)
    .then(function(results) {
      results.body.id = req.params.id;
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
      // get the key that orchestrate creates from the header
      req.body.id = results.headers.location.split('/')[3];
    })
    .then(function() {
      return db.newGraphBuilder()
        .create()
        .from('products', req.body.id)
        .related('category')
        .to('categories', req.body.categories_id);
    })
    .then(function() {
      return db.newGraphBuilder()
        .create()
        .from('categories',  req.body.categories_id)
        .related('products')
        .to('products', req.body.id);
    })
    .then(function() {
      denorm.run('products', req.body.id);
      denorm.run('categories', req.body.categories_id);
      res.json(req.body);
    })
    .fail(function(err) {
      console.log(err);
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

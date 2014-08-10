var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');
var denorm = require('./denorm-categories');
var kew = require('kew');

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
  db.put('categories', req.params.id, req.body)
    .then(function(results) {
      // TODO add graphs
      denorm.run({ collection: 'categories' });
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

router.post('/', function(req, res) {
  db.post('categories', req.body)
    .then(function(results) {
      var promises = [];
      // get the key that orchestrate creates from the header
      req.body.id = results.headers.location.split('/')[3];

      if (req.body.products && req.body.products.length) {
        req.body.products.forEach(function(item) {
          promises.push(
            db.newGraphBuilder()
              .create()
              .from('categories', req.body.id)
              .related('products')
              .to('products', item.id)
          );
        });
      }
      return kew.all(promises);
    })
    .then(function(results) {
      denorm.run({ collection: 'categories' });
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
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

module.exports = router;

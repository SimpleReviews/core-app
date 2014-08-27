var express = require('express');
var router = express.Router();
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var denorm = require('../lib/denorm')();
var normalize = require('../lib/normalize');
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
      denorm.run('products', req.body.product);
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
      req.body.id = results.headers.location.split('/')[3];
      req.key = results.headers.location.split('/')[3];
      req.category = 'reviews';
      console.log('ID: ' + req.body.id);
      console.log('Prod: ' + req.body.product);
      console.log('Body: ');
      for (var i in req.body){
          console.log(i);
      }
      return db.newGraphBuilder()
        .create()
        .from('products', req.body.product)
        .related('reviews')
        .to('reviews', req.body.id);
    })
    .then(function(results) {
      denorm.run('products', req.body.product);
      res.json(req.body);
      console.log('Created: ' + results);
      console.log(req.body);
      for (var i in req.body){
        console.log(i);
      }
    })
    .fail(function(err) {
      res.json(err);
      console.log('Failed: ' + err);
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
        console.log('Failed: ' + err);
    });
});

module.exports = router;

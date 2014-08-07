var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');


router.get('/', function(req, res) {
    db.list('products')
        .then(function (result) {
            res.json(normalize(result.body.results));
        })
        .fail(function (err){
            res.json(err.body.message);
        });
});

router.get('/:key', function(req, res) {
    var product;
    var reviews;

    db.get('products', req.params.key)
      .then(function (res){
          product = res.body;
          return product;
      })
      .then(function(product) {
          return db.newGraphReader()
              .get()
              .from('products', product)
              .related('review');
      })
      .then(function(res) {
          reviews = res.body.results;
      })
      .then(function() {
          return db.get('categories', product.cat);
      })
      .then(function(results) {
        res.json({
          reviews: reviews,
          product: product,
          category: results.body.labelPlural
        });
      })
      .fail(function(err) {
          res.json(err.body.message);
      });
});

module.exports = router;

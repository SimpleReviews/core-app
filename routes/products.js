var express = require('express');
var router = express.Router();
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var normalize = require('../lib/normalize');
var denorm = require('../lib/denorm')();
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
  console.log(req.body)
  db.post('products', req.body)
    .then(function(results) {
      // get the key that orchestrate creates from the header
      req.body.id = results.headers.location.split('/')[3];
      findOrCreateCategory(req.body.category, req.body.id);
      // send the product back to the client
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
      denorm_products.run({ collection: 'products' });
      denorm_categories.run({ collection: 'categories' });
      res.status(results.statusCode);
    })
    .fail(function(err) {
      res.status(err.statusCode)
        .json({ message: err.body.message });
    });
});

function findOrCreateCategory(name, productId) {
  console.log(name);
  var categoryId;
  db.search('categories', 'value.name:' + '"' + name + '"')
    .then(function(results) {
      console.log('1');
      // if it doesn't exist, create a new category
      if (!results.body.results.length && name) {
        return db.post('categories', { name: name });
      }
      // if it does, return the existing category's key
      return results.body.results[0].path.key;
    })
    .then(function(results) {
      if (results.headers) {
        categoryId = results.headers.location.split('/')[3];
      } else {
        categoryId = results;
      }
      // create a graph between categories and products
      return db.newGraphBuilder()
        .create()
        .from('categories',  categoryId)
        .related('products')
        .to('products', productId)
    })
    .then(function() {
      console.log('3');
      // denormalize the categories and products collections
      denorm.run('products', productId);
      denorm.run('categories', categoryId);
    })
    .fail(function(err) {
      console.log('4');
      throw err;
    });
}

module.exports = router;

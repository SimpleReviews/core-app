var express = require('express');
var router = express.Router();
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var normalize = require('../lib/normalize');

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
      return findOrCreateCategory(req.body.name);
    })
    .then(function(categoryId) {
      req.body.id = categoryId;
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

function findOrCreateCategory(name) {
  console.log(name);
  return db.search('categories', 'value.name:' + '"' + name + '"')
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
      if (results.headers)
        return results.headers.location.split('/')[3];
      return results;
    });
}

module.exports = router;

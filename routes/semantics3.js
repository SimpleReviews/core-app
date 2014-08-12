var express = require('express');
var router = express.Router();

var api_key = 'SEM3C72272AA8C5DF47965A504A0AE46A683';
var api_secret = 'YjJmZWFmYTk3OTEwZmVkYjFhNjZhYjIxYWJlMjU3Yjk';
var sem3 = require('semantics3-node')(api_key,api_secret);

router.get('/search', function(req, res) {
  var query = req.query.q;
  sem3.products.products_field("name", query);
  sem3.products.get_products(
    function(err, products) {
      if (err) {
        res.send("Couldn't execute query: get_products").end();
        return;
      }
      var products = JSON.parse(products);
      res.json(products.results);
   }
  );
});

module.exports = router;

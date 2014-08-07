var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);
var normalize = require('./normalize.js');

router.get('/', function(req, res) {
    db.list('categories')
        .then(function (result) {
            res.json(normalize(result.body.results));
        })
        .fail(function (err){
            res.send(err.body.message);
            //console.log(err);
        });
});

var catName;

var getCat = function(cat){
    return db.get('categories',cat)
        .then(function (result){
            catName = result.body.labelPlural;
            return catName;
        })
        .fail(function (err){
            res.render('error',err);
        });
};

var getProducts = function(cat){
    return db.newGraphReader()
        .get()
        .from('categories',cat)
        .related('product')
        .then(function(response){
            var products = response.body.results;
            return {count: response.body.count, products: products};
        });
};

router.get('/:category', function(req, res) {
    var cat = req.params.category;

    getCat(cat);

    getProducts(cat)
        .then(function (response) {
            res.json({products: response.products, category: catName});
        })
        .fail(function (response){
            res.render('error',err);
        });
    });

module.exports = router;

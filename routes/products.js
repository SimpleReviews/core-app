var express = require('express');
var router = express.Router();
var config = require('../config.js');
var Q = require('q');
var db = require('orchestrate')(config.dbKey);

router.get('/', function(req,res){
    res.redirect('../');
});

var prodName;
var catName;
var product;

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

var getProd = function(prod){
    return db.get('products',prod)
        .then(function (result){
            product = result.body;
            return product;
        })
        .fail(function (err){
            res.render('error',err);
        });
};

var getReviews = function(prod){
    return db.newGraphReader()
        .get()
        .from('products',prod)
        .related('review')
        .then(function(response){
            var reviews = response.body.results;
            return {count: response.body.count, reviews: reviews};
        });
};

router.get('/:product', function(req, res) {
    var prod = req.params.product;

    getProd(prod);

    getReviews(prod)
        .then(function (response) {
            getCat(product.cat);
            console.log(response);
            
            //Sort Reviews
            var reviews = response.reviews.sort(function(a,b){
                if (a.value.count > b.value.count) {
                    return -1;
                }
                if (a.value.count < b.value.count){
                    return 1;
                }
                else{
                    return 0;
                }
            });
            
            //Count and Separate Reviews
            var goodReviews = [];
            var badReviews = [];
            var goodReviewsCount = 0;
            var badReviewsCount = 0;
            for (var review = 0; review < response.count; review++){
                if (reviews[review].value.type == 'bad') {
                    console.log(reviews[review].value);
                    badReviewsCount += reviews[review].value.count;
                    badReviews.push(reviews[review].value);
                }
                if (reviews[review].value.type == 'good') {
                    goodReviewsCount += reviews[review].value.count;
                    goodReviews.push(reviews[review].value);
                }
            }

            res.render('products', {goodReviews: goodReviews,goodReviewsCount: goodReviewsCount, badReviews: badReviews, badReviewsCount: badReviewsCount, product: product, category: catName});
        })
        .fail(function (response){
            res.render('error',err);
        });
    });

module.exports = router;

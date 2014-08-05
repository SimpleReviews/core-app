var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);

router.get('/', function(req, res) {
    db.list('categories')
        .then(function (result) {
            res.render('index', {categories: result.body.results});
            console.log(result);
        })
        .fail(function (err){
            res.send(err.body.message);
            console.log(err);
        });
});

module.exports = router;

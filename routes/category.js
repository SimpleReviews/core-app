var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.dbKey);

console.log('test');
router.get('/', function(req, res) {
    db.list('categories')
        .then(function (result) {
            res.json(result.body.results);
        })
        .fail(function (err){
            res.send(err.body.message);
            //console.log(err);
        });
});

module.exports = router;

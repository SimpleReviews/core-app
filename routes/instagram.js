var express = require('express');
var router = express.Router();
var insta = require('instagram-node-lib');

insta.set('client_id', process.env.INSTAGRAM_CLIENT_ID);
insta.set('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);

router.get('/recent', function(req, res) {
    insta.tags.recent({
        name: req.query.q,
        count: 15,
        complete: function(data){
            res.json(data);
        },
        error: function(errMsg, errObj, caller){
            res.send("Couldn't execute query: " + errMsg).end();
        }
    });
});

router.get('/tags', function(req, res) {
    insta.tags.search({
        q: req.query.q,
        complete: function(data){
            res.json(data);
        },
        error: function(errMsg, errObj, caller){
            res.send("Couldn't execute query: " + errMsg).end();
        }
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var yt = require('youtube-search');

router.get('/search', function(req, res) {
    var query = req.query.q;
    yt(query + " review", {maxResults:10,startIndex:1}, function(err, results){
        if(err){
            res.send("Couldn't execute query:" + err).end();
        }
        res.json(results);
    });
});

module.exports = router;

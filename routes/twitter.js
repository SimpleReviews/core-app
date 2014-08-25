var express = require('express');
var router = express.Router();
var Twit = require('twit');

var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_CONSUMER_SECRET,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/search', function(req, res) {
  T.get('search/tweets', {
    q: req.query.q,
    count: 10,
    result_type: 'popular'
  }, function(err, data, response) {
      if (err) return res.status(response.statusCode).end();
      res.json(data);
    }
  );
});

module.exports = router;

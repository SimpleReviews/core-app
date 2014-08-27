var Collection = require('./base');
var Review = require('../models/review');

module.exports = Collection.extend({
  model: Review,
  url: '/reviews',
  comparator: function(review) {
    return -review.get('count');
  }
});

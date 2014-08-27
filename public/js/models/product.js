var Backbone = require('backbone');
var _ = require('underscore');

var Product = Backbone.Model.extend({
  parse: function(response) {
    console.log(response);
    var positiveReviews = _.filter(response.reviews, function(item) {
      return item.type === 'positive';
    });
    var negativeReviews = _.filter(response.reviews, function(item) {
      return item.type === 'negative';
    });
    response.positiveReviews = _.sortBy(positiveReviews, function(item) {
      return +item.count;
    });
    response.negativeReviews = _.sortBy(negativeReviews, function(item) {
      return +item.count;
    });
    return response;
  }
});

module.exports = Product;

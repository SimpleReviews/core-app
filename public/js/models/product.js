var Backbone = require('backbone');
var _ = require('underscore');

var Product = Backbone.Model.extend({
  parse: function(response) {
    console.log(response);
    response.positiveReviews = _.filter(response.reviews, function(item) {
      return item.type === 'positive';
    });
    response.negativeReviews = _.filter(response.reviews, function(item) {
      return item.type === 'negative';
    });
    return response;
  }
});

module.exports = Product;

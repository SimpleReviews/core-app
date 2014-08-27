var View = require('./base');
var Review = require('../models/review');
var ReviewListItemView = require('../views/review-list-item');

module.exports = View.extend({

  initialize: function(options) {
    var self = this;
    this.collection.on('change add', function() {
      console.log('change');
      this.sort();
      self.$el.empty();
      self.render();
    });
  },

  render: function() {
    var self = this;
    this.collection.each(function(item) {
      var reviewListItemView = new ReviewListItemView({ model: item });
      self.$el.append(reviewListItemView.render().el);
    });
  }
});

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var template = require('../../../templates/products/show.hbs');

var ProductsShowView = Backbone.View.extend({
  render: function () {
    this.$el.html(template);
  }
});

module.exports = ProductsShowView;

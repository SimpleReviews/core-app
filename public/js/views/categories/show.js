var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var template = require('../../../templates/categories/show.hbs');

var CategoriesShowView = Backbone.View.extend({
  render: function () {
    this.$el.html(template);
  }
});

module.exports = CategoriesShowView;

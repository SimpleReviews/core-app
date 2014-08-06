var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var template = require('../../../templates/categories/index.hbs');

var CategoriesIndexView = Backbone.View.extend({
  render: function () {
    this.$el.html(template);
  }
});

module.exports = CategoriesIndexView;

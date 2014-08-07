var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var CategoriesView = require('./views/categories');
var CategoryCollection = require('./collections/categories');

var Router = Backbone.Router.extend({
  routes: {
    '': 'categories'
  },
  initialize: function() {
    this.categories = new CategoryCollection();
  },
  categories: function() {
    this.categoriesView = new CategoriesView({
      el: 'body',
      collection: this.categories
    });
  }
});

$(function () {
  window.app = new Router();
  Backbone.history.start();
});

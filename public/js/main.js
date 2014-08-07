var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var CategoriesView = require('./views/categories');
var CategoryCollection = require('./collections/categories');

var ProductsView = require('./views/products');
var ProductCollection = require('./collections/products');

var Router = Backbone.Router.extend({
  routes: {
    '': 'categories',
    'categories/:key': 'category',
    '*notFound': 'notFound'
  },
  initialize: function() {
    this.categories = new CategoryCollection();
    this.products = new ProductCollection();
  },
  categories: function() {
    this.categoriesView = new CategoriesView({
      el: 'body',
      collection: this.categories
    });
  },
  category: function(key) {
    this.productsView = new ProductsView({
      el: 'body',
      key: key,
      collection: this.products
    });
  },
  notFound: function() {
    $('body').html('<h1>Route not found</h1>');
  }
});

$(function () {
  window.app = new Router();
  Backbone.history.start();
});

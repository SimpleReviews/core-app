var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var CategoriesIndexView = require('./views/categories/index');
var CategoriesShowView = require('./views/categories/show');
var ProductsShowView = require('./views/products/show');

var Router = Backbone.Router.extend({
  routes: {
    '': 'showCategories',
    'categories/:id': 'showCategory',
    'products/:id': 'showProduct'
  },
  showCategories: function () {
    this.categoriesIndexView = new CategoriesIndexView({ el: 'body' });
    this.categoriesIndexView.render();
  },
  showCategory: function() {
    this.categoriesShowView = new CategoriesShowView({ el: 'body' });
    this.categoriesShowView.render();
  },
  showProduct: function() {
    this.productsShowView = new ProductsShowView({ el: 'body' });
    this.productsShowView.render();
  }
});

$(function () {
  window.app = new Router();
  Backbone.history.start();
});

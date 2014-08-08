var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

Backbone.Collection.prototype.findModel = function(id) {
  var model = this.get(id);
  if (!model) {
    model = this.add({id: id});
    model.fetch();
  }
  return model;
};

var CategoriesView = require('./views/categories');
var CategoryCollection = require('./collections/categories');

var ProductsView = require('./views/products');
var ProductCollection = require('./collections/products');

var ProductView = require('./views/product');
var Product = require('./models/product');

var Router = Backbone.Router.extend({
  routes: {
    '': 'categories',
    'categories/:key': 'category',
    'products/:key': 'product',
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
  product: function(key) {
    var model = this.products.findModel(key);
    this.productView = new ProductView({
      el: 'body',
      model: model
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

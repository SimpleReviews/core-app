var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var CategoriesView = require('./views/categories');
var CategoryCollection = require('./collections/categories');
var CategoryView = require('./views/category');
var CategoryNewView = require('./views/category-new');
var ProductCollection = require('./collections/products');
var ProductView = require('./views/product');
var ProductNewView = require('./views/product-new');
var Product = require('./models/product');
var Category = require('./models/category');

var Router = Backbone.Router.extend({
  routes: {
    '': 'categories',
    'categories/new': 'categoryNew',
    'categories/:id': 'category',
    'products/new': 'productNew',
    'products/:id': 'product',
    '*notFound': 'notFound'
  },
  initialize: function() {
    this.categories = new CategoryCollection();
    this.products = new ProductCollection();
  },
  categories: function() {
    var self = this;
    this.categories.fetch().then(function() {
      self.categoriesView = new CategoriesView({
        el: '#app',
        collection: self.categories
      });
    });
  },
  category: function(id) {
    var category = this.categories.getOrFetch(id);
    this.categoryView = new CategoryView({
      el: '#app',
      model: category
    });
  },
  categoryNew: function() {
    this.categoryNewView = new CategoryNewView({
      el: '#app',
      collection: this.categories
    });
  },
  product: function(id) {
    var product = this.products.getOrFetch(id);
    this.productView = new ProductView({
      el: '#app',
      model: product
    });
  },
  productNew: function() {
    this.productNewView = new ProductNewView({
      el: '#app',
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

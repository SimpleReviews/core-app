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
        el: 'body',
        collection: self.categories
      });
    });
  },
  category: function(id) {
    var self = this;
    var category = new Category({ id: id });
    category.urlRoot = '/categories';
    category.fetch().then(function() {
      self.categoryView = new CategoryView({
        el: 'body',
        model: category
      });
    });
  },
  categoryNew: function() {
    this.categoryNewView = new CategoryNewView({
      el: 'body',
      collection: this.categories
    });
  },
  product: function(id) {
    var product = new Product({ id: id });
    product.urlRoot = '/products';
    product.fetch().then(function() {
      self.productView = new ProductView({
        el: 'body',
        model: product
      });
    });
  },
  productNew: function() {
    this.productNewView = new ProductNewView({
      el: 'body',
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

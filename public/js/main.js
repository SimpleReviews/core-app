var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var AppView = require('./views/app');

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
    this.appView = new AppView({ el: 'body' });
    this.categories = new CategoryCollection();
    this.products = new ProductCollection();
  },
  categories: function() {
    var self = this;
    this.appView.showSpinner();
    this.categories.fetch().then(function() {
      self.renderDetail(new CategoriesView({ collection: self.categories }));
    });
  },
  category: function(id) {
    var self = this;
    this.appView.showSpinner();
    this.categories.getOrFetch(id).then(function(category) {
      self.renderDetail(new CategoryView({ model: category }));
    });
  },
  categoryNew: function() {
    this.renderDetail(new CategoryNewView({ collection: this.categories }));
  },
  product: function(id) {
    var self = this;
    this.appView.showSpinner();
    this.products.getOrFetch(id).then(function(product) {
      self.renderDetail(new ProductView({ model: product }));
    });
  },
  productNew: function() {
    this.renderDetail(new ProductNewView({ collection: this.products }));
  },
  renderDetail: function(view) {
    this.appView.renderChildView(view);
  },
  notFound: function() {
    $('body').html('<h1>Route not found</h1>');
  }
});

$(function () {
  window.app = new Router();
  Backbone.history.start();
});

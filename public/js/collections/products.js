var Backbone = require('backbone');
var Product = require('../models/product');

var Products = Backbone.Collection.extend({
  model: Product,
  url: '/products'
});

module.exports = Products;

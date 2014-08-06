var Backbone = require('backbone');
var Product = require('../models/product');

var Products = Backbone.Collection.extend({
  model: Product,
  url: '/api/products'
});

module.exports = Products;

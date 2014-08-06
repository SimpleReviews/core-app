var Backbone = require('backbone');
var Product = require('../models/category');

var Products = Backbone.Collection.extend({
  model: Product,
  url: '/api/products'
});

module.exports = Products;

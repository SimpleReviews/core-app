var Collection = require('./base');
var Product = require('../models/product');

module.exports = Collection.extend({
  model: Product,
  url: '/products/search'
});

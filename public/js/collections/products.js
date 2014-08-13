var Collection = require('./base');
var Product = require('../models/product');

module.exports = Collection.extend({
  model: Product,
  url: '/products',

  parse: function(response) {
    console.log(response);
    return response;
  }
});

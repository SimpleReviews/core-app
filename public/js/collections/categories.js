var Collection = require('./base');
var Category = require('../models/category');

module.exports = Collection.extend({
  model: Category,
  url: '/categories'
});

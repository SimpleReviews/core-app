var Backbone = require('backbone');
var Category = require('../models/category');

var Categories = Backbone.Collection.extend({
  model: Category,
  url: '/api/categories'
});

module.exports = Categories;

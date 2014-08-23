var Backbone = require('backbone');

var Category = Backbone.Model.extend({
  urlRoot: '/categories'
});

module.exports = Category;

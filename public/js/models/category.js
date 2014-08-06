var Backbone = require('backbone');

var Category = Backbone.Model.extend({});

Category.set('FIXTURES', [
  {
    "id": 1,
    "name": "wearables"
  }
]);

module.exports = Category;

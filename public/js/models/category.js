var Backbone = require('backbone');

var Category = Backbone.Model.extend({});

Category.FIXTURES = [
  {
    "id": 1,
    "name": "wearables"
  }, {
    "id": 2,
    "name": "tablets"
  }
];

module.exports = Category;

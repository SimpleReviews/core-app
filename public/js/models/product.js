var Backbone = require('backbone');

var Product = Backbone.Model.extend({});

Product.set('FIXTURES', [
  {
    "id": 1,
    "name": "Fitbit",
    "category_ids": [
      "wearables",
      "fitness"
    ]
  }
]);

module.exports = Product;

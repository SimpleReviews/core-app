var Backbone = require('backbone');

var Product = Backbone.Model.extend({
  parse: function(response) {
    console.log(response);
    return response;
  }
});

module.exports = Product;

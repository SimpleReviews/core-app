var View = require('./base');
var template = require('../../templates/product-search.hbs');

module.exports = View.extend({
  template: template,

  initialize: function(options) {
    console.log('products search');
    this.query = options.query;
  },

  templateData: function() {
    return {
      query: this.query,
      searchResults: this.collection.toJSON()
    }
  }
});

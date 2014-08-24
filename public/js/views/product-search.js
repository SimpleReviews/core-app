var View = require('./base');
var template = require('../../templates/product-search.hbs');

module.exports = View.extend({

  events: {
    'submit #product-search-form': 'handleSubmit'
  },

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
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var query = this.$('#query').val();
    window.app.navigate('#/products/search?q='+ encodeURI(query), { trigger: true });
  }

});

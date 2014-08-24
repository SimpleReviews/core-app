var View = require('./base');
var template = require('../../templates/categories.hbs');

module.exports = View.extend({

  events: {
    'submit #product-search-form': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('categories');
    //this.render();
  },

  handleSubmit: function(e) {
    e.preventDefault();
    console.log('search');
    var query = this.$('#query').val();
    console.log(query);
    window.app.navigate('#/products/search?q='+ encodeURI(query), { trigger: true });
  }
});

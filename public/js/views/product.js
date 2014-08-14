var View = require('./base');
var template = require('../../templates/product.hbs');

module.exports = View.extend({

  events: {
      'submit #form': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('product');
    //this.model.on('request', this.renderLoading, this);
    this.model.on('change', this.render, this);
    console.log(this.model);
  },

  handleSubmit: function(e) {
    e.preventDefault();
    console.log('clicked');
  }
});

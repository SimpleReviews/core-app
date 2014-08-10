var View = require('./base');
var template = require('../../templates/product.hbs');

module.exports = View.extend({
  template: template,

  initialize: function(options) {
    console.log('product');
    //this.model.on('request', this.renderLoading, this);
    this.model.on('sync', this.render, this);
    this.render();
  }
});

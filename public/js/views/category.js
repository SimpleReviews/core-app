var View = require('./base');
var template = require('../../templates/category.hbs');

module.exports = View.extend({
  template: template,

  initialize: function(options) {
    console.log('category');
    //this.model.on('request', this.renderLoading, this);
    this.model.on('change', this.render, this);
    this.render();
  }
});

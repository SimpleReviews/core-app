var View = require('./base');
var template = require('../../templates/categories.hbs');

module.exports = View.extend({
  template: template,

  initialize: function(options) {
    console.log('categories');
    //this.render();
  }
});

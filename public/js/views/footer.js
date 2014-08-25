var View = require('./base');
var template = require('../../templates/footer.hbs');

module.exports = View.extend({
  template: template,

  initialize: function(options) {
    console.log('footer');
    var self = this;
  },

});

var View = require('./base');
var template = require('../../templates/signin.hbs');

module.exports = View.extend({

  events: {
    'submit': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('signin');
  },

  afterRender: function() {
    this.$('[name="email"]').focus();
  },

  handleSubmit: function(e) {
    e.preventDefault();
  }
});

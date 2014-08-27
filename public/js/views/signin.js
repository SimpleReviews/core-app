var View = require('./base');
var template = require('../../templates/signin.hbs');
var Auth = require('../models/auth');

module.exports = View.extend({

  events: {
    'submit #signin-form': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('signin');
    this.error = null;
    this.transitionTo = null;
  },

  afterRender: function() {
    this.$('#email').focus();
  },

  templateData: function() {
    return {
      error: {
        message: this.error
      },
      email: this.$('#email').val()
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;
    var email = this.$('#email').val();
    var password = this.$('#password').val();

    Auth.open(email, password)
      .then(function() {
        if (self.transitionTo) {
          window.app.navigate(self.transitionTo, { trigger: true });
        } else {
          window.app.navigate('/#/', { trigger: true });
        }
      })
      .fail(function(err) {
        console.log(err)
        self.error = err;
        self.render();
      });
  }
});

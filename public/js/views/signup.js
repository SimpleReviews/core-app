var View = require('./base');
var template = require('../../templates/signup.hbs');
var Auth = require('../models/auth');

module.exports = View.extend({

  events: {
    'submit': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('signup');
    var self = this;
    this.error = null;
    this.model.on('invalid', function(model, errors) {
      if (errors.length) {
        self.hasErrors = true;
        //self.error = 'There were problems creating your account.';
        self.render();
        errors.forEach(function(item) {
          self.addInputError('#' + item.attr, item.msg);
        });
      }
    });
  },

  afterRender: function() {
    if (!this.hasErrors)
      this.$('#username').focus();

    // TODO check for available username's on the fly
    /*
    this.$('[name="username"]').on('input', function() {
      console.log('check username');
    });
    */
  },

  templateData: function() {
    return {
      error: {
        message: this.error
      },
      model: this.model.toJSON()
    }
  },

  addInputError: function(selector, msg) {
    this.$(selector).parent().addClass('has-error');
    this.$(selector).after('<span class="help-block">' + msg +'</span>');
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;

    this.model.set({
      username: this.$('#username').val(),
      email: this.$('#email').val(),
      password: this.$('#password').val(),
      confirmPassword: this.$('#confirm-password').val()
    });

    if(!!this.model.isValid()) {
      Auth.signup(this.model.toJSON())
        .then(function() {
          window.app.navigate('/#/', { trigger: true });
        })
        .fail(function(err) {
          self.error = err;
          self.render();
        });
    }
  }
});

var View = require('./base');
var template = require('../../templates/signup.hbs');

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
    var username = this.$('#username').val();
    var email = this.$('#email').val();
    var password = this.$('#password').val();
    var confirmPassword = this.$('#confirm-password').val();

    this.model.save({
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    });

  }
});

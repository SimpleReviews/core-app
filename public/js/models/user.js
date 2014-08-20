var Backbone = require('backbone');

var User = Backbone.Model.extend({

  urlRoot: '/users',

  validate: function(attrs, options) {
    var errors = [];
    if (!attrs.username) {
      errors.push({
        attr: 'username',
        msg: 'Please enter a username.'
      });
    }
    if (!attrs.email) {
      errors.push({
        attr: 'email',
        msg: 'Please enter an email address.'
      });
    }
    if (!attrs.password) {
      errors.push({
        attr: 'password',
        msg: 'Please enter a password.'
      });
    }
    if (attrs.password !== attrs.confirmPassword) {
      errors.push({
        attr: 'confirm-password',
        msg: "Password does't match."
      });
    }
    return errors.length ? errors : false;
  }
});

module.exports = User;

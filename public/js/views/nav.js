var View = require('./base');
var template = require('../../templates/nav.hbs');
var Auth = require('../models/auth');

module.exports = View.extend({

  events: {
    'click #signout': 'signout'
  },

  template: template,

  initialize: function(options) {
    console.log('nav');
    var self = this;

    Auth.on('authenticated', function(user) {
      self.currentUser = user;
      self.render();
    });
  },

  templateData: function() {
    return {
      isAuthenticated: Auth.loggedIn,
      currentUser: this.currentUser
    }
  },

  signout: function() {
    Auth.close();
  }

});

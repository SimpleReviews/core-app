var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var kew = require('kew');

var Auth = {

  open: function(email, password) {
    var self = this;
    var defer = kew.defer();

    $.ajax({
      url: '/signin',
      method: 'POST',
      data: {
        email: email,
        password: password
      }
    })
    .done(function(res) {
      if (res.token) {
        localStorage.token = res.token;
        $.ajaxSetup({
          headers: {
            'x-access-token': res.token
          }
        });
        defer.resolve();
        self.onChange(res.user);
      } else {
        defer.reject();
        self.onChange(null);
      }
    })
    .fail(function(err) {
      defer.reject(err.responseJSON.message);
      self.onChange(null);
    });

    return defer.promise;
  },

  fetch: function() {
    var self = this;
    var defer = kew.defer();
    var token = this.getToken();

    if (!token) {
      defer.reject();
      this.onChange(null);
    }

    $.ajax('/session', {
      type: 'POST',
      data: { access_token: token }
    })
    .done(function(res) {
      defer.resolve();
      self.onChange(res);
    })
    .fail(function(err) {
      defer.reject();
      self.onChange(null);
    });

    return defer.promise;
  },

  signup: function(data) {
    var self = this;
    var defer = kew.defer();

    $.ajax({
      url: '/users',
      method: 'POST',
      data: data
    })
    .done(function(res) {
      return self.open(data.email, data.password);
    })
    .then(function(res) {
      defer.resolve();
      self.onChange(res);
    })
    .fail(function(err) {
      defer.reject(err.responseJSON.message || err.message);
      self.onChange(null);
    });

    return defer.promise;
  },

  close: function() {
    delete localStorage.token;
    $.ajaxSetup({
      headers: {}
    });
    this.onChange(null);
  },

  getToken: function() {
    return localStorage.token;
  },

  loggedIn: function() {
    return !!localStorage.token;
  },

  onChange: function(user) {
    this.trigger('authenticated', user);
  }
};

_.extend(Auth, Backbone.Events);

module.exports = Auth;

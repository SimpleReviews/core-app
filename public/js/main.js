var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var Router = Backbone.Router.extend({
  routes: {
    '': 'main'
  },
  main: function () {
    $('body').html(require('../templates/index.hbs'));
  }
});

$(function () {
  window.app = new Router();
  Backbone.history.start();
});

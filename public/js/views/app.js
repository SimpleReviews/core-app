var View = require('./base');
var SpinView = require('./spin');
var NavView = require('./nav');
var template = require('../../templates/app.hbs');
var Auth = require('../models/auth');

module.exports = View.extend({

  template: template,

  initialize: function(options) {
    console.log('app view');

    Auth.fetch()
      .fail(function() {
        console.error('Unauthenticated');
      });

    this.spinner = new SpinView({ size: 'large' });
    this.render();
    this.renderNavView();
  },

  showSpinner: function() {
    this.spinner.setElement(this.$('#detail'));
    this.spinner.render();
  },

  renderNavView: function() {
    this.navView = new NavView();
    this.navView.render();
    this.$('#nav').html(this.navView.el);
  },

  renderChildView: function(view) {
    if (this.currentView){
      this.currentView.remove();
    }

    this.currentView = view;
    this.currentView.render();
    this.$('#detail').html(this.currentView.el);
  }
});

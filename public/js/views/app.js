var View = require('./base');
var SpinView = require('./spin');

var appTemplate = require('../../templates/app.hbs');
var navTemplate = require('../../templates/nav.hbs');

module.exports = View.extend({

  template: appTemplate,

  initialize: function(options) {
    console.log('app view');
    this.spinner = new SpinView({ size: 'large' });
    this.render();
  },

  afterRender: function() {
    this.$el.find('#nav').html(navTemplate);
  },

  showSpinner: function() {
    this.spinner.setElement(this.$('#detail'));
    this.spinner.render();
  },

  renderChildView: function(view) {
    view.setElement(this.$('#detail'));
    view.render();
  }
});

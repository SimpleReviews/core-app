var View = require('./base');

var appTemplate = require('../../templates/app.hbs');
var navTemplate = require('../../templates/nav.hbs');

module.exports = View.extend({

  template: appTemplate,

  initialize: function(options) {
    console.log('app view');
    this.render();
  },

  afterRender: function() {
    this.$el.find('#nav').html(navTemplate);
  },

  renderChildView: function(view) {
    view.setElement(this.$('#detail'));
    view.render();
  }
});

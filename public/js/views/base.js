var Backbone = require('backbone');
var _ = require('underscore');

var LoadingTemplate = require('../../templates/loading.hbs');

module.exports = Backbone.View.extend({

  templateData: function () {
    if (this.model)
      return this.model.toJSON();
    if (this.collection)
      return this.collection.toJSON();
    return {};
  },

  renderLoading: function() {
    this.$el.html(LoadingTemplate);
  },

  render: function() {
    if (_.isFunction(this.beforeRender))
      this.beforeRender();

    this.$el.html(this.template(this.templateData()));

    if (_.isFunction(this.afterRender))
      this.afterRender();

    return this;
  }
});

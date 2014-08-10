var View = require('./base');
var template = require('../../templates/product-new.hbs');

module.exports = View.extend({

  events: {
    'submit': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('category-new');
    this.render();
  },

  afterRender: function() {
    this.$('#name').focus();
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.$el.find('#name').val();

    this.collection.create({
      name: name
    }, {
      success: function(model) {
        window.app.navigate('products/' + model.get('id'), { trigger: true });
      },
      error: function(model, xhr) {
        console.error(xhr);
      }
    });
  }
});

var View = require('./base');
var template = require('../../templates/product-new.hbs');

module.exports = View.extend({

  events: {
    'submit': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('category-new');
    this.searchResults = [];
  },

  afterRender: function() {
    var self = this;
    $('#name').selectize({
      valueField: 'ean',
      labelField: 'name',
      searchField: 'name',
      options: [],
      create: false,
      render: {
        option: function(item, escape) {
          return '<div>' + escape(item.name) +
          '<p><b>' + escape(item.category) + '</b></p>' +
          '</div>';
        }
      },
      load: function(query, callback) {
        if (!query.length) return callback();
        $.ajax({
          url: '/semantics3/search?q='+query,
          type: 'GET',
          error: function() {
            callback();
          },
          success: function(res) {
            console.log(res);
            callback(res);
            res.forEach(function(item) {
              self.searchResults[item.ean] = item;
            });
          }
        });
      }
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var product = this.searchResults[this.$el.find('#name').val()];

    this.collection.create({
      name: product.name,
      product_data: product
    }, {
      success: function(model) {
        window.app.navigate('/products/' + model.get('id'), { trigger: true });
      },
      error: function(model, xhr) {
        console.error(xhr);
      }
    });
  }
});

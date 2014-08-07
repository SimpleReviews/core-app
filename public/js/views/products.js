var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Category = require('../models/product');

var ProductsView = Backbone.View.extend({
  template: require('../../templates/products.hbs'),
  initialize: function(options) {
    this.key = options.key;
    this.collection = options.collection;
    //this.collection.add(Category.FIXTURES);
    this.listenTo(this.collection, 'all', this.render);
    this.collection.fetch({
      data: { key: options.key }
    })
      .then(function(res) {
        console.log(res);
      });

    this.render();
  },
  render: function () {
    var data = [];
    this.collection.models.forEach(function(item) {
      data.push({
        key: item.get('key'),
        label: item.get('label')
      });
    });
    this.$el.html(this.template({
      key: this.key,
      products: data
    }));
  }
});

module.exports = ProductsView;

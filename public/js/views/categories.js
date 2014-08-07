var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Category = require('../models/category');

var CategoriesView = Backbone.View.extend({
  template: require('../../templates/categories.hbs'),
  initialize: function(options) {
    this.collection = options.collection;
    //this.collection.add(Category.FIXTURES);
    this.listenTo(this.collection, 'all', this.render);
    this.collection.fetch()
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
        name: item.get('labelPlural')
      });
    });
    this.$el.html(this.template({categories: data}));
  }
});

module.exports = CategoriesView;

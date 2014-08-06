var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Category = require('../../models/category');
var Categories = require('../../collections/categories');
var template = require('../../../templates/categories/index.hbs');

var CategoriesIndexView = Backbone.View.extend({
  collection: new Categories(),
  initialize: function() {
    this.collection.add(Category.FIXTURES);
    this.listenTo(this.collection, 'all', this.render);
  },
  render: function () {
    var data = [];
    this.collection.models.forEach(function(item) {
      data.push({name: item.get('name')});
    });
    this.$el.html(template({categories: data}));
  }
});

module.exports = CategoriesIndexView;

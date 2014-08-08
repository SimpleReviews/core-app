var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Product = require('../models/product');

var ProductView = Backbone.View.extend({
  isLoading: true,
  template: require('../../templates/product.hbs'),
  initialize: function(options) {
    var self = this;
    this.model = options.model;
    this.listenTo(this.model, 'all', this.render);
    /*
    this.model.fetch()
      .then(function(res) {
        console.log(res);
        self.isLoading = false;
        self.render();
      });
      */
    this.render();
  },
  render: function () {
    console.log('render');
    this.$el.html(this.template({
      //isLoading: this.isLoading,
      model: this.model.toJSON()
    }));
  }
});

module.exports = ProductView;

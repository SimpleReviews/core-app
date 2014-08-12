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
    $('select').selectize({
      valueField: 'name',
      labelField: 'name',
			searchField: 'name',
			options: [],
			create: false,
			render: {
				option: function(item, escape) {
					return '<div>' + escape(item.name) + '</div>';
				}
			},
			load: function(query, callback) {
				if (!query.length) return callback();
				$.ajax({
					url: '/categories/search',
					type: 'GET',
					data: {
						q: query
					},
					error: function() {
						callback();
					},
					success: function(res) {
						console.log(res);
						callback(res);
					}
				});
			}
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.$el.find('#name').val();

    this.collection.create({
      name: name
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

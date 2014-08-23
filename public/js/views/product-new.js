var View = require('./base');
var template = require('../../templates/product-new.hbs');
var Category = require('../models/category');

module.exports = View.extend({

  events: {
    'submit #product-form': 'handleSubmit'
  },

  template: template,

  initialize: function(options) {
    console.log('category-new');
    this.category = new Category();
    this.searchResults = {};
    this.instaResults = {};
  },

  afterRender: function() {
    var self = this;

    $('#insta').selectize({
      valueField: 'name',
      labelField: 'name',
      searchField: 'name',
      options: [],
      create: false,
      render: {
        option: function(item, escape) {
          return '<div>' + "#" + escape(item.name) +
          '<p><b>' + 'Used '  + escape(item.media_count) + ' times</b></p>' +
          '</div>';
        }
      },
      load: function(query, callback) {
        if (!query.length) return callback();
        $.ajax({
          url: '/instagram/tags?q='+query,
          type: 'GET',
          error: function() {
            callback();
          },
          success: function(res) {
            console.log(res);
            callback(res);
            res.forEach(function(item) {
              self.instaResults[item.name] = item;
            });
          }
        });
      },
      onChange: function(tagname){
        $.ajax({
          url: '/instagram/recent?q=' + tagname,
          type: 'GET',
          error: function(err) {
            console.log('error retreiving images ' + err);
            return err;
          },
          success: function(res) {
            images = res;
            $('#photo-selector').html(function(){
                console.log(images);
                var html = '<label for="insta">Select product photo</label><select class="image-picker show-html">';
                for (var image in images){
                    html += '<option data-img-src="' + images[image].images.thumbnail.url + '" value="' + image + '">' + image + '</option>';
                }
                html += '</select>';
                return html;
            });
            $("select").imagepicker();
          }
        });
      }
    });

    $('#name').selectize({
      valueField: 'sem3_id',
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
            res.forEach(function(item) {
              self.searchResults[item.sem3_id] = item;
            });
            callback(res);
          }
        });
      }
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;
    var category;
    var product = this.searchResults[this.$el.find('#name').val()];
    var insta = this.$el.find('#insta').val();
    var thumbnail = this.$el.find("div.thumbnail.selected img.image_picker_image").attr('src');

    this.category.save({
      name: product.category
    }, {
      success: function(category) {
        category = category;
        self.collection.create({
          name: product.name,
          product_data: product,
          categories_id: category.get('id'),
          hashtag: insta,
          thumbnail: thumbnail
        }, {
          success: function(model) {
            model.set('categories', category.toJSON());
            window.app.navigate('/products/' + model.get('id'), { trigger: true });
          },
          error: function(model, xhr) {
            console.error(xhr);
          }
        });
      },
      error: function(model, xhr) {
        console.error(xhr);
      }
    });

  }
});

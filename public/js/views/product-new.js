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
    this.instaResults = [];
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







        //$('#photo-selector').html(function(){
            //return tagname;
        //});
      }
    });

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
    var self = this;
    var product = this.searchResults[this.$el.find('#name').val()];
    var insta = this.$el.find('#insta').val();
    
    self.collection.create({
      name: product.name,
      product_data: product,
      category: product.category,
      hashtag: insta,
      thumbnail: $("div.thumbnail.selected img.image_picker_image").attr('src'),
      },{
      success: function(model) {
        window.app.navigate('/products/' + model.get('id'), { trigger: true });
      },
      error: function(model, xhr) {
        console.error(xhr);
      }
    });

  }
});

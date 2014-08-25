var View = require('./base');
var template = require('../../templates/product.hbs');

module.exports = View.extend({

  events: {
      'submit #add-positive': 'addPositive',
      'submit #add-negative': 'addNegative'
  },

  template: template,

  initialize: function(options) {
    console.log('product');
  },

  afterRender: function() {
    $("videos").css('visibility','hidden');
    $.ajax({
      url: '/youtube/search?q='+this.model.get('name').replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g," "),
      type: 'GET',
      error: function() {
      },
      success: function(res) {
        $('#videos').html(function(){return '';});
        for (var i in res){
            var url = res[i].url;
            var thumbnail = res[i].thumbnails[0].url;
            $('#videos').prepend('<a href="' + url + '"><img src="' + thumbnail + '" height="150" class="cloud9-item" alt=' + i + '></a>');
        }
        $("#videos").Cloud9Carousel( {
          buttonLeft: $("#video-buttons > .left"),
          buttonRight: $("#video-buttons > .right"),
          speed: 10,
          bringToFront: true,
          onLoaded: function() {
            showcase.css( 'visibility', 'visible' );
            showcase.css( 'display', 'none' );
            showcase.fadeIn( 1500 );
          },
          onRendered: function(carousel) {
            $('#youtube-title').text(res[carousel.nearestItem().element.alt].title);
            $('#youtube-body').html(function(){return '';});
            $('#youtube-body').append("Author: " + res[carousel.nearestItem().element.alt].author+ "<br />");
            $('#youtube-body').append("Published:" + res[carousel.nearestItem().element.alt].title + "<br />");
            $('#youtube-body').append("Category: " + res[carousel.nearestItem().element.alt].category + "<br />");
            $('#youtube-body').append("Description: " + res[carousel.nearestItem().element.alt].description+ "<br />");
            $('#youtube-body').append("View Count: " + res[carousel.nearestItem().element.alt].viewCount);
          }
        });
      }
    });
    $.ajax({
      url: '/instagram/recent?q='+this.model.get('hashtag')+'&count=14',
      type: 'GET',
      error: function() {
          console.log('unable to get instagram photos');
      },
      success: function(res) {
        $('#instagram').html(function(){return '';});
        for (var i in res){
            var url = res[i].link;
            var thumbnail = res[i].images.thumbnail.url;
            var alt = res[i].caption.text;
            $('#instagram').append('<a href="' + url + '"><img src="' + thumbnail + '" alt="' + alt + '" width="150" height="150" class="cloud9-item"></a>');
        }
        $("#instagram").Cloud9Carousel( {
          buttonLeft: $("#instagram-buttons > .left"),
          buttonRight: $("#instagram-buttons > .right"),
          speed: 10,
          bringToFront: true
        });
      }
    });
  },

  addPositive: function(e) {
    var self = this;
    e.preventDefault();
    text = this.$el.find('#positive-input').val();
    console.log(text);
    $.ajax({
        type: 'POST',
        url: '/reviews',
        data: {
            text:text,
            count: 1,
            type: "positive",
            product: this.model.get('id')
        },
        success: function(data){
            console.log('working....');
        },
        error: function(data){
            console.log(data);
        }
    })
    .done(function(res) {
      console.log('res: ' + res.message);
      for (var i in res){
          console.log(i);
      }
      self.model.get('positiveReviews').push(res);
      self.render();
    });
  },

  addNegative: function(e) {
    var self = this;
    e.preventDefault();
    text = this.$el.find('#negative-input').val();
    console.log(text);
    $.ajax({
        url: '/reviews',
        type: 'POST',
        data: {
            text: text,
            count: 1,
            type: "negative",
            product: this.model.get('id')
        },
        success: function(data){
            console.log(data);
        },
        error: function(data){
            console.log(data);
        }
    })
    .done(function(res) {
      self.model.get('negativeReviews').push(res);
      self.render();
    });
  }
});

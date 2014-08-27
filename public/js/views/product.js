var View = require('./base');
var template = require('../../templates/product.hbs');
var ReviewCollection = require('../collections/reviews');
var ReviewListView = require('./review-list');
var Auth = require('../models/auth');

module.exports = View.extend({

  events: {
      'submit #add-positive': 'addPositive',
      'submit #add-negative': 'addNegative'
  },

  template: template,

  initialize: function(options) {
    console.log('product');
    this.positiveReviews = new ReviewCollection(this.model.get('positiveReviews'));
    this.negativeReviews = new ReviewCollection(this.model.get('negativeReviews'));
  },

  afterRender: function() {
    $("videos").css('visibility','hidden');
    this.renderPositiveReviews();
    this.renderNegativeReviews();
    this.renderYoutube();
    this.renderInstagram();
  },

  renderPositiveReviews: function() {
    this.positiveReviewsView = new ReviewListView({
      collection: this.positiveReviews
    });
    this.positiveReviewsView.setElement($('#positive'));
    this.positiveReviewsView.render();
  },

  renderNegativeReviews: function() {
    this.negativeReviewsView = new ReviewListView({
      collection: this.negativeReviews
    });
    this.negativeReviewsView.setElement($('#negative'));
    this.negativeReviewsView.render();
  },

  renderYoutube: function() {
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
            $('#videos').prepend('<a href="' + url + '" target="_blank"><img src="' + thumbnail + '" height="150" class="cloud9-item" alt=' + i + ' targer="_blank"></a>');
        }
        $("#videos").Cloud9Carousel( {
          buttonLeft: $("#video-buttons > .left"),
          buttonRight: $("#video-buttons > .right"),
          speed: 10,
          bringToFront: true,
          onRendered: function(carousel) {
            $('#youtube-title').text(res[carousel.nearestItem().element.alt].title);
            $('#youtube-body').html(function(){return '';});
            $('#youtube-body').append("Author: " + res[carousel.nearestItem().element.alt].author+ "<br />");
            $('#youtube-body').append("Published:" + res[carousel.nearestItem().element.alt].published + "<br />");
            $('#youtube-body').append("View Count: " + res[carousel.nearestItem().element.alt].statistics.viewCount + "<br />");
            $('#youtube-body').append("View Count: " + res[carousel.nearestItem().element.alt].statistics.favoriteCount);
          }
        });
      }
    });
  },

  renderInstagram: function() {
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
            var alt;
            if (res[i].caption){
                alt = res[i].caption.text;
            }
            else{
                alt = "No Description";
            }
            $('#instagram').append('<a href="' + url + '" target="_blank"><img src="' + thumbnail + '" alt="' + alt + '" width="150" height="150" class="cloud9-item"></a>');
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
    e.preventDefault();
    var self = this;
    var text = this.$el.find('#positive-input').val();
    if (!Auth.currentUser) {
      this.renderSigninPage();
      return;
    }
    this.positiveReviews.create({
      text: text,
      count: 1,
      type: 'positive',
      product: this.model.get('id'),
      user_id: Auth.currentUser.email
    }, {
      success: function(model) {
        self.$el.find('#positive-input').val('');
      },
      error: function(model, xhr) {
        console.log(xhr);
      }
    });
  },

  addNegative: function(e) {
    e.preventDefault();
    var self = this;
    var text = this.$el.find('#negative-input').val();
    if (!Auth.currentUser) {
      this.renderSigninPage();
      return;
    }
    this.negativeReviews.create({
      text: text,
      count: 1,
      type: 'negative',
      product: this.model.get('id'),
      user_id: Auth.currentUser.email
    }, {
      success: function(model) {
        self.$el.find('#negative-input').val('');
      },
      error: function(model, xhr) {
        console.log(xhr);
      }
    });
  },

  renderSigninPage: function() {
    window.app.navigate('#/signin', { trigger: true });
    window.app.appView.currentView.transitionTo = '#/products/'+this.model.get('id');
    window.app.appView.currentView.error = 'Please login to add a review.';
    window.app.appView.currentView.render();
  }
});

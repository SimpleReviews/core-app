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
    $.ajax({
      url: '/youtube/search?q='+this.model.get('name'),
      type: 'GET',
      error: function() {
      },
      success: function(res) {
        console.log(res);
        console.log(res[0].url);
        for (var i in res){
            var url = res[i].url;
            var thumbnail = res[i].thumbnails[0].url;
            $('#videos').prepend('<a href="' + url + '"><img src="' + thumbnail + '" width="250" height="150"></a>');
        }
      }
    });
    $.ajax({
      url: '/instagram/recent?q=blackandwhite',
      type: 'GET',
      error: function() {
      },
      success: function(res) {
        console.log(res);
        console.log(res[0].url);
        for (var i in res){
            var url = res[i].link;
            var thumbnail = res[i].images.thumbnail.url;
            $('#instagram').prepend('<a href="' + url + '"><img src="' + thumbnail + '" width="150" height="150"></a>');
        }
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

var View = require('./base');
var template = require('../../templates/product.hbs');

module.exports = View.extend({

  events: {
      'submit #add-positive': 'addPositive',
      'submit #add-negative': 'addNegative'
  },

  template: template,

  initialize: function(options) {
    //console.log('product');
    //this.model.on('request', this.renderLoading, this);
    this.model.on('change', this.render, this);
    //console.log(this.model);
  },

  addPositive: function(e) {
    var self = this;
    e.preventDefault();
    text = this.$el.find('#positive-input').val();
    console.log(text);
    $.ajax({
        type: 'POST',
        url: '/reviews',
        data: {text:text},
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
    console.log('clicked negative button');
    $.ajax({
        url: '/reviews',
        type: 'POST',
        data: {},
        error: function(){
        console.log('testingtestingtesting');
        }
    })
    .done(function(res) {
      self.model.get('negativeReviews').push(res);
      self.render();
    });
  }
});

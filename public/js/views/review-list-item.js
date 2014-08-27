var View = require('./base');
var template = require('../../templates/review-list-item.hbs');
var Auth = require('../models/auth');

module.exports = View.extend({

  events: {
    'click': 'handleClick'
  },

  template: template,

  initialize: function() {
    console.log('review list item');
    if (this.model.get('type') === 'positive') {
      this.model.set('style', 'success');
    } else {
      this.model.set('style', 'danger');
    }
  },

  handleClick: function(e) {
    e.preventDefault();
    var canVote = true;
    var count = +this.model.get('count') + 1;
    if (Auth.currentUser.email === this.model.get('user_id')) {
      return;
    }
    this.model.collection.each(function(item) {
      if (item.get('user_id') === Auth.currentUser) {
        canVote = true;
      }
    });
    if (canVote) {
      this.model.set('count', count);
      this.model.save();
      this.render();
    }
  }

});

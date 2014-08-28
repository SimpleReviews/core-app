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
  },

  handleClick: function(e) {
    e.preventDefault();
    var count = +this.model.get('count') + 1;
    var users = this.model.get('user_ids');
    if (this.model.get('user_ids').indexOf(Auth.currentUser.email) >= 0) {
      console.log("IS USER IN THE LIST: " + this.model.get('user_ids').indexOf(Auth.currentUser.email) >= 0);
      console.log("USERS WHO VOTED: " + this.model.get('user_ids'));
      console.log("CURRENT USER: " + Auth.currentUser.email);
      console.log('USER ALREADY VOTED');
      return;
    }
    if (this.model.get('user_ids').indexOf(Auth.currentUser.email) < 0) {
      console.log("LOCATION OF USER IN THE LIST: " + this.model.get('user_ids').indexOf(Auth.currentUser.email));
      console.log("USERS WHO VOTED: " + this.model.get('user_ids'));
      console.log("CURRENT USER: " + Auth.currentUser.email);
      console.log('USER JUST VOTED');
      this.model.set('count', count);
      users.push(Auth.currentUser.email);
      this.model.set('user_ids', users);
      this.model.save();
      this.render();
    }
  }

});

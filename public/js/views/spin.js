var View = require('./base');
var $ = require('jquery');
var Spinner = require('spin.js');
var template = require('../../templates/spin.hbs');

module.exports = View.extend({

 template: template,

  sizes: {
    large: {
      lines: 11,
      length: 6,
      width: 3,
      radius: 7
    },
    small: {
      lines: 10,
      length: 4,
      width: 2,
      radius: 3.5
    }
  },

  initialize: function(options) {
    this.size = this.sizes[options.size];
  },

  afterRender: function() {
    var options = {
      lines: 11,
      length: 6,
      width: 3,
      radius: 7,
      corners: 1,
      rotate: 0,
      direction: 1,
      color: "#000",
      speed: .8,
      trail: 61,
      shadow: !1,
      hwaccel: !0,
      className: "spinner",
      zIndex: 1e3,
      top: "auto",
      left: "auto"
    };
    $.extend(options, this.size);
    var spinner = new Spinner(options).spin();
    this.$('.spin').append(spinner.el);
  }

});

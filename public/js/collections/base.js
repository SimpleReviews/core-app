var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  getOrFetch: function(id) {
    var model = this.get(id);
    if (!model) {
      model = this.add({id: id});
      model.fetch();
    }
    return model;
  }
});

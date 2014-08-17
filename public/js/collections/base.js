var Backbone = require('backbone');
var kew = require('kew');

module.exports = Backbone.Collection.extend({
  getOrFetch: function(id) {
    var model = this.get(id);
    var deferred = kew.defer();

    if (!model) {
      model = this.add({id: id});
      model.fetch()
        .then(function() {
          deferred.resolve(model);
        });
    } else {
      deferred.resolve(model);
    }

    return deferred.promise;
  }
});

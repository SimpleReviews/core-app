var orc_denorm = require('../lib/denorm')();
var kew = require('kew');
var normalize = require('./normalize');

orc_denorm.denormalize = function(db, path, item) {
  return db.newGraphReader()
    .get()
    .from(path.collection, path.key)
    .related('reviews')
    .then(function(results) {
      item.reviews = normalize(results[1].body.results);
      return item;
    })
    .then(function(item) {
      var collection = ['denorm', path.collection].join('_');
      return db.put(collection, path.key, item);
    })
    .then(function() {
      return item;
    });
};

module.exports = orc_denorm;

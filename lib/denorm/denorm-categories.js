var kew = require('kew');
var normalize = require('../normalize');

function denormalize(db, path, item) {
  var promises = [
    db.newGraphReader()
      .get()
      .from('categories', path.key)
      .related('products')
  ];

  return kew.all(promises)
    .then(function(results) {
      item.products = normalize(results[0].body.results);
      return item;
    })
    .then(function(item) {
      return db.put('denorm_categories', path.key, item);
    })
    .then(function() {
      return item;
    });
};

module.exports = denormalize;

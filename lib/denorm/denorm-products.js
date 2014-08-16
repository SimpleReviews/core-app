var kew = require('kew');
var normalize = require('../normalize');

function denormalize(db, path, item) {
  console.log('denorm')
  var promises = [
    db.newGraphReader()
      .get()
      .from('products', path.key)
      .related('reviews')
  ];

  return kew.all(promises)
    .then(function(results) {
      item.reviews = normalize(results[0].body.results);
      return item;
    })
    .then(function(item) {
      return db.put('denorm_products', path.key, item);
    })
    .then(function() {
      return item;
    });
};

module.exports = denormalize;

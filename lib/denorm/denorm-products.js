var kew = require('kew');
var normalize = require('../normalize');

function denormalize(db, path, item) {
  console.log('denorm')
  return this._denormalize(db, path, item)
    .then(function(item) {
      return db.newGraphReader()
        .get()
        .from('products', path.key)
        .related('reviews')
        .then(function(res) {
          item.reviews = normalize(res.body.results);
          return item;
        });
    })
    .then(function(item) {
      console.log('DENORM: ' + path.key);
      return db.put('denorm_products', path.key, item);
    })
    .then(function() {
      return item;
    });
};

module.exports = denormalize;

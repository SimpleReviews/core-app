var kew = require('kew');
var _ = require('lodash');

function denormalize (db, path, item) {
  var denorm_item = {};
  var promises = _.map(Object.keys(item), function (field) {
    if (field.slice(-4) === '_key') {
      var collection = field.slice(0, -4);
      var key = item[field];

      return db.get(collection, key)
      .then(function (res) {
        denorm_item[collection] = res.body;
      })
      .fail(function (err) {
        if (err.statusCode === 404) {
          denorm_item[collection] = null;
        } else {
          throw err;
        }
      });
    } else {
      denorm_item[field] = item[field];
      return false;
    }
  });

  promises = _.compact(promises);
  return kew.all(promises)
  .then(function () {
    var denorm_collection = 'denorm_' + path.collection;
    return db.put(denorm_collection, path.key, denorm_item);
  })
  .then(function () {
    return denorm_item;
  });
}

module.exports = denormalize;

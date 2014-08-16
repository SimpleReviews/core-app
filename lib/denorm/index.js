function OrcDenorm() {}
OrcDenorm.prototype.run = require('./run');
OrcDenorm.prototype.denorm_products = require('./denorm-products');
OrcDenorm.prototype.denorm_categories = require('./denorm-categories');

module.exports = function() {
  return new OrcDenorm();
};

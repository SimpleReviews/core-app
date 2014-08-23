function OrcDenorm() {}
OrcDenorm.prototype.run = require('./run');
OrcDenorm.prototype.denorm_products = require('./denorm-products');
OrcDenorm.prototype.denorm_categories = require('./denorm-categories');
OrcDenorm.prototype._denormalize = require('./denormalize');

module.exports = function() {
  return new OrcDenorm();
};

function OrcDenorm() {}
OrcDenorm.prototype.run = require('./run');
OrcDenorm.prototype.denormalize = require('./denormalize');

module.exports = function() {
  return new OrcDenorm();
};

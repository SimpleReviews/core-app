var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

function User(data) {
  data = data || {};
  this.username = data.username || '';
  this.email = data.email || '';
  this.password = makeHash(data.password) || '';
}

function makeHash(password) {
  return bcrypt.hashSync(password, salt);
}

User.authenticate = function(password, claim) {
  return bcrypt.compareSync(password, claim);
};

module.exports = User;

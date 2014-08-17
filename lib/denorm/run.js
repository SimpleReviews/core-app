var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);

function run(collection, key) {
  var self = this;

  db.search(collection, key)
    .then(function(results) {
      console.log('run');
      return self['denorm_' + collection](db, results.body.results[0].path, results.body.results[0].value);
    })
    .then(function() {
      console.log('done')
    })
    .fail(function(err) {
      console.log(err);
      throw err;
    });
}

module.exports = run;

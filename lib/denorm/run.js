var orchestrate = require('orchestrate');
var apiKey = require('../../config').dbKey;
var async = require('async');
var EventEmitter = require('events').EventEmitter;

function run (options) {
  this.should_stop = false;
  this.collection = options.collection;
  this.db = orchestrate(apiKey);
  this.emitter = new EventEmitter();
  this.scan = scan.bind(this);
  this.stop = stop.bind(this);

  this.scan();

  return this.emitter;
}

function stop () {
  this.should_stop = true;
}

function scan (next) {
  var self = this;
  var promise;
  if (next) {
    promise = next.get();
  } else {
    promise = this.db.list(this.collection);
  }

  if (!this.should_stop) {
    promise
    .then(function (res) {
      async.mapSeries(res.body.results, function (result, done) {
        self.denormalize(self.db, result.path, result.value)
        .then(function (item) {
          self.emitter.emit('update', item);
        })
        .fail(function (err) {
          self.emitter.emit('error', err);
        })
        .fin(function () {
          done();
        });
      }, function () {
        if (res.links && res.links.next) {
          self.scan(res.links && res.links.next);
        } else {
          self.should_stop = true;
          self.emitter.emit('done');
        }
      });
    })
    .fail(function (err) {
      self.emitter.emit('error', err);
      self.scan();
    });
  } else {
    this.emitter.emit('end');
  }
}

module.exports = run;

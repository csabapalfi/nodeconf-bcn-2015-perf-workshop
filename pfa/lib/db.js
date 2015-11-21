var assert = require('assert');
var async = require('async');
var mongoose = require('mongoose');

var date = require('./date');
var generateId = require('./id-gen');

mongoose.connect(process.env.DBURL || 'mongodb://localhost/test');

var StatusSchema = new mongoose.Schema({
  id: String,
  date: String,
  text: String
});
StatusSchema.index({ text: 'text' });
var Status = mongoose.model('Status', StatusSchema);

exports.erase = erase;
function erase(cb) {
  Status.remove({}, cb);
}

exports.add = add;
function add(text, cb) {
  assert.equal(typeof text, 'string');
  assert.equal(typeof cb, 'function');

  var doc = {
    id: generateId(),
    date: date(),
    text: text
  };
  var status = new Status(doc);
  status.save(cb);
}

exports.get = get;
function get(count, cb) {
  if (typeof cb !== 'function') {
    cb = count;
    count = 20;
  }

  assert.equal(typeof cb, 'function');

  Status
    .find()
    .sort('-_id')
    .limit(count)
    .exec(then);

  function then(err, results) {
    cb(err, !err && results);
  }
}

exports.search = search;
function search(word, cb) {
  Status.find().exec(then);

  function then(err, results) {
    if (err)
      return cb(err);

    cb(null, results.filter(containsWord));
  }

  function containsWord(status, cb) {
    try { ensureText(status.text, word); }
    catch (e) { return false; }
    return true;
  }
}

exports.multiSearch = multiSearch;

function multiSearch(words, cb) {
  var results = [];
  async.each(words, collect, done);

  function collect(word, cb) {
    exports.search(word, then);

    function then(err, res) {
      if (err)
        return cb(err);

      results = results.concat(res);
      cb();
    }
  }

  function done(err) {
    cb(err, !err && results);
  }
}

function justTheText(results) {
  return results && results.map(textMap) || null;
  function textMap(s) { return s.text; }
}

function ensureText(text, subtext) {
  if (!~text.indexOf(subtext))
    throw Exception('not found');
}

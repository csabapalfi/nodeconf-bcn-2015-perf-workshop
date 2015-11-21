var util = require('util');
var assert = require('assert');
var request = require('request');
var chance = require('chance')();

var App = require('../');

describe('API', function(){
  var app = App({ quiet: true });
  var server;
  var baseUrl;

  before(function(done) {
    var appPort = chance.integer({ min: 3000, max: 9999 });
    baseUrl = util.format('http://localhost:%d', appPort);
    server = app.listen(appPort, done);
  });

  describe('GET /statuses', function() {
    it('returns a list of statuses', function(done){
      var opts = {
        method: 'GET',
        url: baseUrl + '/statuses',
        json: true
      };
      request(opts, then);

      function then(err, res, body) {
        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(typeof body, 'object');
        assert.equal(typeof body.count, 'number');
        assert(Array.isArray(body.statuses));

        done();
      }
    });
  });

  describe('POST /statuses', function() {
    var status = chance.sentence();

    it('takes new statuses', function(done) {
      var opts = {
        method: 'POST',
        url: baseUrl + '/statuses',
        json: {
          status: status
        }
      };
      request(opts, then);

      function then(err, res, body) {
        assert.ifError(err);
        assert.equal(res.statusCode, 201);
        assert.equal(typeof body, 'undefined');

        done();
      }
    });

    it('includes submitted statuses on future status requests',
        function(done) {
      var opts = {
        method: 'GET',
        url: baseUrl + '/statuses',
        json: true
      };
      request(opts, then);

      function then(err, res, body) {
        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(typeof body, 'object');
        assert.equal(typeof body.count, 'number');
        assert(Array.isArray(body.statuses));
        body.statuses.forEach(function(s) {
          assert.equal(typeof s.text, 'string');
          assert.equal(typeof s.id, 'string');
          assert.equal(typeof s.date, 'string');
        });
        assert(body.statuses.some(function(s) {
          return s.text === status;
        }));

        done();
      }
    });

    it('rejects tweets longer than 140 characters', function(done) {
      var tweet = chance.paragraph({ sentences: 10 });
      assert(tweet.length > 140);

      var opts = {
        method: 'POST',
        url: baseUrl + '/statuses',
        json: {
          status: tweet
        }
      };
      request(opts, then);

      function then(err, res, body) {
        assert.ifError(err);
        assert.equal(res.statusCode, 413);

        done();
      }
    });
  });

  describe('POST /search', function() {
    var words;

    before(function(done) {
      words = [];
      var nWords = 2;
      var nStatuses = 2;

      addWord();

      function addWord() {
        var word = chance.word({ length: 50 });
        words.push(word);

        var statusCount = 0;

        addStatus();

        function addStatus() {
          var status = chance.word() + ' ' + word;
          var opts = {
            method: 'POST',
            url: baseUrl + '/statuses',
            json: {
              status: status
            }
          };
          request(opts, then);

          function then(err, res, body) {
            assert.ifError(err);
            assert.equal(res.statusCode, 201);
            assert.equal(typeof body, 'undefined');

            if (status++ < nStatuses)
              return setImmediate(addStatus);

            if (words.length < nWords)
              return setImmediate(addWord);

            done();
          }
        }
      }
    });

    it('finds statuses with any given word', function(done) {
      var opts = {
        method: 'POST',
        url: baseUrl + '/search',
        json: words
      };
      request(opts, then);

      function then(err, res, statuses) {
        assert.ifError(err);
        assert(statuses.length);
        assert.equal(res.statusCode, 200);

        statuses.forEach(check);

        done();
      }

      function check(status) {
        assert(words.some(isPart));

        function isPart(word) {
          return ~status.text.indexOf(word);
        }
      }
    });
  });

  describe('GET /stats', function() {
    var endpoint = '/' + chance.word();

    before(function(done) {
      var opts = {
        method: 'GET',
        url: baseUrl + endpoint
      };
      request(opts, then);

      function then(err, res) {
        assert.ifError(err);
        assert.equal(res.statusCode, 404);

        done();
      }
    });

    it('provides a recent count of endpoint usage', function(done) {
      var opts = {
        method: 'GET',
        url: baseUrl + '/stats',
        json: true
      };
      request(opts, then);

      function then(err, res, stats) {
        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        assert.equal(typeof stats, 'object');
        assert.equal(stats['GET ' + endpoint], 1);
        assert.equal(stats['GET /stats'], 1);

        done();
      }
    });
  });

  after(function(done) {
    server.close(done);
  });
});


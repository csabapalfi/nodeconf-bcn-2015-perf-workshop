var util = require('util');
var assert = require('assert');
var chance = require('chance')();

var db = require('../lib/db');

describe('Data model', function() {
  before(function(done) {
    db.erase(done);
  });

  describe('add()', function () {
    it('takes statuses', function(done) {
      db.add(chance.paragraph(), done);
    });
  });

  describe('get()', function() {
    var last = [];
    var lastNCount = 2;

    before(function(done) {
      var count = 4;

      oneMore();

      function oneMore() {
        var status = chance.paragraph();
        db.add(status, then);

        function then(err) {
          assert.ifError(err);

          if (count <= lastNCount)
            last.push(status);

          if (--count)
            return setImmediate(oneMore);

          done();
        }
      }
    });

    it('provides last statuses', function(done) {
      db.get(lastNCount, then);

      function then(err, list) {
        assert.ifError(err);

        assert.equal(list.length, last.length);

        checkOne();

        function checkOne() {
          var one = list.pop();
          assert.equal(typeof one, 'object');
          assert.equal(typeof one.text, 'string');
          assert.equal(typeof one.id, 'string');
          assert.equal(typeof one.date, 'string');
          assert(/\d\d\:\d\d \w\w\w \d+\w\w/.test(one.date));
          assert.notEqual(last.indexOf(one.text), -1);

          if (list.length)
            return setImmediate(checkOne);

          done();
        }
      }
    });
  });

  describe('search()', function() {
    var word, status;

    before(function(done) {
      word = chance.word({ length: 50 });
      status = chance.sentence() + ' ' + word;
      db.add(status, done);
    });

    it('finds statuses with a specific word', function(done) {
      db.search(word, then);

      function then(err, statuses) {
        assert.ifError(err);
        assert.equal(statuses.length, 1);
        assert.equal(statuses[0].text, status);

        done();
      }
    });
  });

  describe('multiSearch()', function() {
    var words;

    before(function(done) {
      words = [];
      var nWords = 2;
      var nStatuses = 3;

      addWord();

      function addWord() {
        var word = chance.word({ length: 50 });
        words.push(word);

        var statusCount = 0;

        addStatus();

        function addStatus() {
          var status = chance.sentence() + ' ' + word;
          db.add(status, then);

          function then(err) {
            assert.ifError(err);

            if (status++ < nStatuses)
              return setImmediate(addStatus);

            if (words.length < nWords)
              return setImmediate(addWord);

            done();
          }
        }
      }
    });

    it('finds statuses with any word from a list', function(done) {
      db.multiSearch(words, then);

      function then(err, statuses) {
        assert.ifError(err);
        assert(statuses.length);
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
});


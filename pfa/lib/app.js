var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var db = require('./db');
var stats = require('./stats');

module.exports = App;

function App(opts) {
  opts = opts || {};

  var app = express();

  if (! opts.quiet)
    app.use(logger('dev'));

  app.use(bodyParser.json({ limit: '5mb' }));

  app.use(function(req, res, next) {
    stats(req.method + ' ' + req.path);
    next();
  });

  app.get('/statuses', function(req, res) {
    db.get(20, then);

    function then(err, statuses) {
      if (err)
        throw err;

      res.status(200).send({ count: statuses.length, statuses: statuses });
    }
  });

  app.post('/statuses', function(req, res) {
    var status = req.body.status;
    if (! status)
      return res.sendStatus(400);

    if (status.length > 140)
      return res.sendStatus(413);

    db.add(status, then);

    function then(err) {
      if (err)
        throw err;

      res.status(201).send();
    }
  });

  app.post('/search', function(req, res) {
    var words = req.body;

    db.multiSearch(words, then);

    function then(err, result) {
      if (err)
        throw err;

      res.send(result);
    }
  });

  app.get('/stats', function(req, res) {
    res.send(stats());
  });

  return app;
}

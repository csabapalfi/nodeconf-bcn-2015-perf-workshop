#!/usr/bin/env node

var App = require('..');

var app = App();

var server = app.listen(process.env.PORT || 7070, function () {
  var info = server.address();
  var host = info.address;
  var port = info.port;
  console.log('Example app listening at http://%s:%s', host, port);
});


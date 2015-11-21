var async = require('async');

module.exports = work;

function work(items, reportProgress, done) {
  async.each(items, each, done);

  function each(item, cb) {
    // Report progress
    var percent = 10;
    var total = items.length - (items.length % percent);
    var step = total / percent;
    var progress = (item / step) * percent;
    if (item % step === 0)
      reportProgress(progress);

    // Simulate a little local processing e.g. producing a request
    var d = Date.now();
    while (Date.now() - d < 4);

    // Simulate remote processing e.g. db operation
    setTimeout(cb, 100);
  }
}


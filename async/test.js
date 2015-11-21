var items = require('./items');
var work = require('./work');

// Simulate that other stuff is happening e.g. handling other requests
var lastTimeOtherStuffHadAChangeToHappen = Date.now();
setInterval(doOtherStuff, 100).unref();
function doOtherStuff() {
  lastTimeOtherStuffHadAChangeToHappen = Date.now();
}

// Let's say this is part of the handling of a single request
work(items, reportProgressAndCheckEventLoopDelay, done);

function reportProgressAndCheckEventLoopDelay(progress) {
  console.log('%d%% ...', progress);

  // Make sure other stuff has been getting a chance to happen
  // e.g. one request shouldn't delay all the other ones.
  var time = Date.now() - lastTimeOtherStuffHadAChangeToHappen;
  if (time > 3 * 1000)
    throw new Error('No other requests could be serviced for too long');
}

function done(err) {
  if (err) throw err;
  console.log('All done!');
}


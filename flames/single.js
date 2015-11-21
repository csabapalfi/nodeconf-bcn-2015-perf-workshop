var started = Date.now();
service(then);

function then() {
  console.log('Total: ' + (Date.now() - started));
  started = Date.now();
  service(then);
}

function service(cb) {
  doWaitA(afterA);

  function afterA() {
    doWaitB(afterB);
  }

  function afterB() {
    doWaitC(afterC);
  }

  function afterC() {
    cb();
  }
}

function doWaitA(cb) {
  spin(100);
  setImmediate(cb);
}

function doWaitB(cb) {
  spin(400);
  setImmediate(cb);
}

function doWaitC(cb) {
  spin(500);
  setImmediate(cb);
}

// Simulate using CPU
function spin(time) {
  var started = Date.now();
  while (Date.now() - started < time);
}

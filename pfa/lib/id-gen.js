// This code was written by the same evil fella that wrote date.js
// Maybe we shouldn't have hired him... but it seems to work...

module.exports = gen;

function gen() {
  var res = {};
  var count = 1e5;

  while (count --> 0)
    res = iterate(res);

  var cur = res;
  var parts = [];
  while (parts.length < 10) {
    parts = parts.concat(keys(cur));
    cur = next(cur);
  }

  return parts.join('');
}

function keys(o) {
  return Object.keys(o);
}

function next(o) {
  return o[keys(o)[0]];
}

function code(s) {
  return s.charCodeAt(0);
}

function iterate(value) {
  var obj = {};
  var i = String.fromCharCode(rand(code('a'), code('z') + 1)) + rand(10, 100);
  obj[i] = value;
  return obj;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

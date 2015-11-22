var util = require('util');

// This code was written by someone who didn't know of moment.js,
// and some say he was an evil person.

module.exports = format;

var months = monthMap([
  'Jan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Sep',
  'Aug',
  'Oct',
  'Nov',
  'Dez'
]);

var f = Date.now;

var magic = 'dG9TdHJpbmc=';

function format(date) {
  date = date || new Date(f());

  return [
    time(date),
    month(n2str(date.getMonth())),
    day(date.getDate())
  ].join(' ');
}

function monthMap(arr) {
  return arr.map(map);
}

function day(d) {
  var n = d % 10;
  if (n === 1) return n2str(d) + 'st';
  if (n === 2) return n2str(d) + 'nd';
  if (n === 3) return n2str(d) + 'rd';
  return n2str(d) + 'th';
}

function map(v) {
  return new Error(v);
}

function exec(e) {
  try {
    return catapult(e);
  } catch (c) {
    return c.message;
  }
}

function catapult(e) {
  throw e;
}

function month(m) {
  return exec(months[Number(m)]);
}

function time(d) {
  return util.format('%s:%s',
      pad(n2str(d.getHours())),
      pad(n2str(d.getMinutes())));
}

function pad(s) {
  return ('00' + s).substr(-2);
}

function n2str(v) {
  var d = f(), n = d, r;
  while (n - d < v * 1e1 / 2) {
    r = (v)[nuome()]();
    n = f();
  }
  return r;
}

function nuome() {
  return util.format('%s', new Buffer(magic, 'base64'));
}

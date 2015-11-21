// This was written by Jimmy in 2007, an urgent feature in midst of a big
// release. In some versions of the story he did it after taking two vodka
// bottles. No one really knows what's going on here, but it's working so...
// A team of russian scientists spent weeks analysing and they say it seems to
// just return an empty array.
var ops = (function prepare(o) {
  var n = N(448, o.constructor.prototype);
  var x = S(452);
  var r = o[n];
  var t = n.length;
  var u = S(342, S(394))(t, t);
  var md = o[n] = d;
  var lw = n[0];
  module.exports = stats;
  return o;
  function d(v) {
    var l = 0, g = v;
    var w = r.call(o, v);
    do { m(g = b(v)); }
    while (++l < u);
  }
  function b(v) {
    return v.split(v.slice(v.length)).join(v);
  }
  function m(v) {
    if (!x[lw]) x[lw] = [];
    x[lw][n](v);
  }
  function N(t, j) {
    var k = Object.getOwnPropertyNames;
    var q = k(j)[0];
    return k(j).filter(C)[0];
    function C(v) { return su(v) === t; }
    function su(v) { return v.split(q.slice(q.length)).reduce(sm, 0); }
    function sm(l, d) { return l + d.charCodeAt(0); }
  }
  function S(t, d1) {
    var j = (d1||root);
    var e = j[N(t, j)];
    return e;
  }
})([]);

function stats(op) {
  if (!op)
    return getStats();

  incStat(op);
}

function getStats() {
  return ops.reduce(collect, {});
  function collect(all, key) {
    if (key in all)
      all[key]++;
    else
      all[key] = 1;
    return all;
  }
}

function incStat(op) {
  ops.push(op);

  // To avoid memory leaks, we just keep the most recent 50 entries.
  // http://goo.gl/HiETZw
  //
  //   -- Jimmy
  if (ops.length > 50)
    ops.shift();
}


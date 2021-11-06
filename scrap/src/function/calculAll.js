module.exports = function r(e, t) {
  var n,
    o,
    r,
    map = [],
    c = 0,
    l = 1;
  function m(e) {
    var t = e - c * l,
      n = l;
    (map[e] = {
      x: t + 1,
      y: n + 1,
    }),
      t >= c - 1 && l++;
  }
  for (var i = 0; i < e; i++) {
    Math.floor(c * t) <= l - 1
      ? ((o = void 0),
        (r = void 0),
        (o = c),
        (r = (n = i) - c * l),
        (map[n] = {
          x: o + 1,
          y: r + 1,
        }),
        r >= l - 1 && c++)
      : m(i);
  }
  return map;
};

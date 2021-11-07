module.exports = (index) => {
  let epoch = Math.floor(Math.sqrt(index / 2)) + 1;
  let x, y;
  if (index <= 2 * epoch * (epoch - 1)) {
    x = index - 2 * (epoch - 1) ** 2;
    y = epoch;
  } else if (index <= (2 * epoch * (epoch - 1) + 2 * epoch ** 2) / 2) {
    x = 2 * epoch - 1;
    y = (index % epoch) + 1;
  } else {
    x = 2 * epoch;
    y = (index % epoch) + 1;
  }
  return { x, y };
};

Object.assign(module.exports, {
  pixelToJSON: (pixel) =>
    `{"x":${pixel.x},"y":${pixel.y},"indexInFlag":${
      pixel.indexInFlag
    },"index":${pixel.index},"hexColor":"${pixel.hexColor}","author":"${
      pixel.author
    }"${pixel.pseudo ? `,"pseudo":${JSON.stringify(pixel.pseudo)}` : ""}}`,
  pixelDépartementsToJSON: (pixel) =>
    `{"x":${pixel.x},"y":${pixel.y},"indexInFlag":${
      pixel.indexInFlag
    },"index":${pixel.index},"hexColor":"${pixel.hexColor}","author":"${
      pixel.author
    }"${pixel.pseudo ? `,"pseudo":${JSON.stringify(pixel.pseudo)}` : ""}}`,
});

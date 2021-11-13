Object.assign(module.exports, {
  pixelToJSON: (pixel) =>
    `{"x":${pixel.x},"y":${pixel.y},"indexInFlag":${
      pixel.indexInFlag
    },"index":${pixel.index},"hexColor":"${pixel.hexColor}","author":"${
      pixel.author
    }"${pixel.pseudo ? `,"pseudo":${JSON.stringify(pixel.pseudo)}` : ""}${
      pixel.modifier.author
        ? `,"modifier":{"pseudo":${JSON.stringify(
            pixel.modifier.pseudo
          )},"author":"${pixel.modifier.author}"}`
        : ""
    }${
      pixel.discord.pseudo
        ? `,"discord":{"pseudo":${JSON.stringify(pixel.discord.pseudo)},"id":"${
            pixel.discord.id
          }"}`
        : ""
    }}`,
  pixelDépartementsToJSON: (pixel) =>
    `{"x":${pixel.x},"y":${pixel.y},"indexInFlag":${
      pixel.indexInFlag
    },"index":${pixel.index},"hexColor":"${pixel.hexColor}","author":"${
      pixel.author
    }"${pixel.pseudo ? `,"pseudo":${JSON.stringify(pixel.pseudo)}` : ""}${
      pixel.modifier.author
        ? `,"modifier":{"pseudo":${JSON.stringify(
            pixel.modifier.pseudo
          )},"author":"${pixel.modifier.author}"}`
        : ""
    }${
      pixel.discord
        ? `,"discord":{"pseudo":${JSON.stringify(pixel.discord.pseudo)},"id":"${
            pixel.discord.id
          }"}`
        : ""
    },
     "departements":${JSON.stringify(pixel.departements)}}`,
});

const https = require("https");
const Joi = require("joi");

const redis = require("../services/redis");
const models = require("../services/models");
const { handler: getDépartements } = require("./getDépartements");
const { handler: getUser } = require("./getUser");

Object.assign(module.exports, {
  regex: /^\/pixels\/zone\/$/,
  method: "GET",
  returnString: true,
  schema: Joi.object({
    x: Joi.number().integer().positive().required(),
    y: Joi.number().integer().positive().required(),
    r: Joi.number().integer().required(),
  }),

  handler: async (url, data) => {
    console.time();

    let pixels = await models["Pixels"].find(
      {
        x: { $lte: data.x + data.r, $gte: data.x - data.r },
        y: { $lte: data.y + data.r, $gte: data.y - data.r },
      },
      { _id: false }
    );
    console.timeLog();

    let pixelsString = [];
    for (var i = 0; i < pixels.length; i++) {
      pixelsString.push(
        `{"x":${pixels[i].x},"y":${pixels[i].y},"indexInFlag":${
          pixels[i].indexInFlag
        },"index":${pixels[i].index},"hexColor":"${
          pixels[i].hexColor
        }","author":"${pixels[i].author}"${
          pixels[i].pseudo
            ? `,"pseudo":${JSON.stringify(pixels[i].pseudo)}`
            : ""
        }}`
      );
    }
    console.timeEnd();

    return `[${pixelsString.toString()}]`;
  },
});

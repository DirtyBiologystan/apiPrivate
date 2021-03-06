const https = require("https");
const Joi = require("joi");

const redis = require("../services/redis");
const models = require("../services/models");
const { handler: getDépartements } = require("./getDépartements");
const { pixelDépartementsToJSON, pixelToJSON } = require("../services/convert");
const typeReturn = require("../constante/typeReturn");

Object.assign(module.exports, {
  regex: /^\/pixels\/$/,
  method: "GET",
  typeReturn: typeReturn.STRING,
  schema: Joi.alternatives().try(
    Joi.object({
      x: Joi.number().integer().positive().required(),
      y: Joi.number().integer().positive().required(),
    }),
    Joi.object({
      indexInFlag: Joi.number().integer().positive().required(),
    }),
    Joi.object({
      index: Joi.number().integer().positive().required(),
    }),
    Joi.object({
      q: Joi.string().min(3).required(),
    }),
    Joi.object({
      pseudo: Joi.string().required(),
    }),
    Joi.object({
      idDiscord: Joi.string().required(),
    }),
    Joi.object({})
  ),
  handler: async (url, data) => {
    let pPixel;
    if (data.x && data.y) {
      pPixel = models["Pixels"].findOne(
        {
          x: data.x,
          y: data.y,
        },
        { _id: false }
      );
    } else if (data.indexInFlag) {
      pPixel = models["Pixels"].findOne(
        {
          indexInFlag: data.indexInFlag,
        },
        { _id: false }
      );
    } else if (data.index) {
      pPixel = models["Pixels"].findOne(
        {
          index: data.index,
        },
        { _id: false }
      );
    } else if (data.pseudo) {
      pPixel = models["Pixels"].findOne(
        {
          pseudo: data.pseudo,
        },
        { _id: false }
      );
    } else if (data.idDiscord) {
      pPixel = models["Pixels"].findOne(
        {
          "discord.id": data.idDiscord,
        },
        { _id: false }
      );
    } else if (data.q) {
      const q = data.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let pixel = await models["Pixels"].find(
        {
          pseudo: { $regex: q, $options: "i" },
        },
        { _id: false }
      );
      console.log(pixel);
      return `[${pixel.map(pixelToJSON).toString()}]`;
    } else {
      let pixel = await models["Pixels"].find({}, { _id: false });
      return `[${pixel.map(pixelToJSON).toString()}]`;
    }
    const pixel = await pPixel;
    if (pixel) {
      const pDépartement = getDépartements(null, pixel);
      return pixelDépartementsToJSON({
        ...pixel.toObject(),
        departements: await pDépartement,
      });
    } else {
      throw Error("not found");
    }
  },
});

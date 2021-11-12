const Joi = require("joi");

const models = require("../services/models");
const typeReturn = require("../constante/typeReturn");

Object.assign(module.exports, {
  regex: /^\/departements\/$/,
  method: "GET",
  typeReturn: typeReturn.OBJECT,
  schema: Joi.alternatives().try(
    Joi.object({
      x: Joi.number().integer().positive().required(),
      y: Joi.number().integer().positive().required(),
    }),
    Joi.object({
      name: Joi.string().required(),
    }),
    Joi.object({})
  ),
  handler: async (url, data) => {
    let départements;
    if (data.x && data.y) {
      départements = await models["Departements"].find(
        {
          "min.x": { $lte: data.x },
          "min.y": { $lte: data.y },
          "max.x": { $gte: data.x },
          "max.y": { $gte: data.y },
        },
        {
          name: true,
          region: true,
          _id: false,
          discord: true,
          regionDiscord: true,
        }
      );
    } else if (data.name) {
      const [département] = await models["Departements"].find(
        {
          name: data.name,
        },
        {
          name: true,
          region: true,
          _id: false,
          discord: true,
          regionDiscord: true,
          min: true,
          max: true,
        }
      );
      if (département) {
        return département;
      } else {
        throw new Error("not found");
      }
    } else {
      départements = await models["Departements"].find(
        {},
        {
          name: true,
          region: true,
          max: true,
          min: true,
          _id: false,
          discord: true,
          regionDiscord: true,
        }
      );
    }

    return départements;
  },
});

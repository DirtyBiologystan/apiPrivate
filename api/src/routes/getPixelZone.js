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
  schema:
  Joi.alternatives().try(
    Joi.object({
      x: Joi.number().integer().positive().required(),
      y: Joi.number().integer().positive().required(),
      r: Joi.number().integer().positive().required(),
    }),
    Joi.object({
      minx: Joi.number().integer().positive().required(),
      miny: Joi.number().integer().positive().required(),
      maxx: Joi.number().integer().positive().required(),
      maxy: Joi.number().integer().positive().required(),
    }),
    Joi.object({
      departement: Joi.string().required(),
    })
  ),

  handler: async (url, data) => {
    let pixels
    if(data.x && data.y)
    {
      pixels = await models["Pixels"].find(
        {
          x: {  $gte: data.x - data.r,$lte: data.x + data.r},
          y: {  $gte: data.y - data.r,$lte: data.y + data.r },
        },
        { _id: false }
      );
    }else if(data.minx && data.miny && data.maxx && data.maxy )
    {
      pixels = await models["Pixels"].find(
        {
          x: { $gte: data.minx, $lte: data.maxx },
          y: { $gte: data.miny, $lte: data.maxy},
        },
        { _id: false }
      );
    }else if(data.departement){
      const [departement] =await models["Departements"].find({name:data.departement},{min:true,max:true, _id: false});
      if(!departement){
        throw Error("not found");
        return;
      }

      console.log(departement)
      pixels=await models["Pixels"].find(
        {
          x: { $gte: departement.min.x, $lte: departement.max.x},
          y: { $gte: departement.min.y, $lte: departement.max.y},
        },
        { _id: false }
      );
    }

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

    return `[${pixelsString.toString()}]`;
  },
});

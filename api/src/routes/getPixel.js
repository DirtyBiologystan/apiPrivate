const https = require("https");
const Joi = require("joi");

const redis = require("../services/redis");
const models = require("../services/models");
const { handler: getDépartements } = require("./getDépartements");
const { handler: getUser } = require("./getUser");

Object.assign(module.exports, {
  regex: /^\/pixels\/$/,
  method: "GET",
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
      index: Joi.number().integer().positive().required(),
    }),
    Joi.object({}),
  ),

  handler: async (url, data) => {
    let pPixel
    if(data.x &data.y){
       pPixel = models["Pixels"]
        .findOne(
          {
            x: data.x,
            y: data.y,
          },
          { _id: false }
        )
    }else if(data.indexInFlag){
      pPixel = models["Pixels"]
       .findOne(
         {
           indexInFlag:data.indexInFlag,
         },
         { _id: false }
       )
    }else if(data.index){
      pPixel = models["Pixels"]
       .findOne(
         {
           index:data.index,
         },
         { _id: false }
       )
    }else{
      pPixel = models["Pixels"].find({},{ _id: false })
      return pPixel;
    }
    const pixel = await pPixel;
        if(pixel){
    const pDépartement = getDépartements(null, pixel);


      return {
        ...pixel.toObject(),
        departements: await pDépartement,
        user: JSON.parse(await getUser([, pixel.author])),
      };
    }else{
      throw Error("not found");
    }

  },
});

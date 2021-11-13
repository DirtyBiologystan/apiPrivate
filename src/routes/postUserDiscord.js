const models = require("../services/models");
const Joi = require("joi");
const typeReturn = require("../constante/typeReturn");

Object.assign(module.exports, {
  regex: /^\/users\/discord$/,
  method: "POST",
  typeReturn: typeReturn.STRING,
  schema: Joi.object({
    pseudo: Joi.string().required(),
    x: Joi.number().integer().positive().required(),
    y: Joi.number().integer().positive().required(),
    idDiscord: Joi.string().required(),
  }),
  handler: async (url, data) => {
    const pixel = await models.Pixels.findOne({ x: data.x, y: data.y });
    if (!pixel) {
      throw Error("not found");
    }
    const user = new models.Users(data);
    await user.save();

    pixel.discord = { pseudo: data.pseudo, id: data.idDiscord };
    await pixel.save();
    return '{"status":"ok"}';
  },
});

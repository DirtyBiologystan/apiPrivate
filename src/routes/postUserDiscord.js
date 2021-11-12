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
    idDiscord: Joi.number().integer().positive().unsafe().required(),
  }),
  handler: async (url, data) => {
    console.log(models.Users);
    const user = new models.Users(data);
    await user.save();
    const datas = await model.find({ pseudo: { $exists: false } });

    return '{"status":"ok"}';
  },
});

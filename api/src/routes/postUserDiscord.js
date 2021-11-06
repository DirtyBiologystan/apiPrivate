const models = require("../services/models");
const Joi = require("joi");

Object.assign(module.exports, {
  regex: /^\/users\/discord$/,
  method: "POST",
  returnString: true,
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
    return '{"status":"ok"}';
  },
});

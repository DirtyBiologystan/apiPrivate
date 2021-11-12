const models = require("../services/models");
const mongoose = require("../services/mongoose");
const client = require("../services/redis");
const typeReturn = require("../constante/typeReturn");

Object.assign(module.exports, {
  regex: /^\/status$/,
  method: "GET",
  typeReturn: typeReturn.OBJECT,

  handler: async (url, data) => {
    const test = await client.get("isUp");
    return {
      mongodb: (await mongoose()).connection.readyState === 1,
      redis: test === "true",
    };
  },
});
